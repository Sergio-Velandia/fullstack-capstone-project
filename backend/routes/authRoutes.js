const express = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const connectToDatabase = require('../db');
const router = express.Router();
const dotenv = require('dotenv');
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';

// Registro de un nuevo usuario
router.post('/register', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('users');

    const existingEmail = await collection.findOne({ email: req.body.email });
    if (existingEmail) {
      return res.status(400).json({ error: 'El correo ya está registrado' });
    }

    const salt = await bcryptjs.genSalt(10);
    const hash = await bcryptjs.hash(req.body.password, salt);

    const newUser = await collection.insertOne({
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: hash,
      createdAt: new Date(),
    });

    const payload = { user: { id: newUser.insertedId } };
    const authtoken = jwt.sign(payload, JWT_SECRET);

    res.json({ authtoken, email: req.body.email });
  } catch (e) {
    res.status(500).send('Error interno del servidor');
  }
});

// Inicio de sesión
router.post('/login', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('users');

    const theUser = await collection.findOne({ email: req.body.email });

    if (!theUser) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const isMatch = await bcryptjs.compare(req.body.password, theUser.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    const payload = { user: { id: theUser._id.toString() } };
    const authtoken = jwt.sign(payload, JWT_SECRET);

    res.json({
      authtoken,
      userName: theUser.firstName,
      userEmail: theUser.email,
    });
  } catch (e) {
    res.status(500).send('Error interno del servidor');
  }
});

// Actualizar información del usuario
router.put('/update', async (req, res) => {
  try {
    const email = req.headers.email;
    if (!email) {
      return res.status(400).json({ error: 'Email es requerido en los headers' });
    }

    const db = await connectToDatabase();
    const collection = db.collection('users');

    const existingUser = await collection.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    existingUser.firstName = req.body.name || existingUser.firstName;
    existingUser.updatedAt = new Date();

    const updatedUser = await collection.findOneAndUpdate(
      { email },
      { $set: existingUser },
      { returnDocument: 'after' }
    );

    const payload = { user: { id: updatedUser._id.toString() } };
    const authtoken = jwt.sign(payload, JWT_SECRET);

    res.json({ authtoken });
  } catch (e) {
    res.status(500).send('Error interno del servidor');
  }
});

module.exports = router;
