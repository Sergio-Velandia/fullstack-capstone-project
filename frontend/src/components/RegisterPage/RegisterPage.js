import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AuthContext';
import './RegisterPage.css';

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showerr, setShowerr] = useState('');

  const navigate = useNavigate();
  const { setIsLoggedIn } = useAppContext();
  const urlConfig = { backendUrl: process.env.REACT_APP_BACKEND_URL };

  const handleRegister = async () => {
    try {
      const response = await fetch(`${urlConfig.backendUrl}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, firstName, lastName }),
      });

      const data = await response.json();

      if (data.authtoken) {
        sessionStorage.setItem('auth-token', data.authtoken);
        sessionStorage.setItem('name', firstName);
        sessionStorage.setItem('email', email);
        setIsLoggedIn(true);
        navigate('/app');
      } else {
        setShowerr(data.error || 'Error al registrar el usuario');
      }
    } catch (e) {
      setShowerr('Error de conexión con el servidor');
    }
  };

  return (
    <div className="register-container">
      <h2>Crear cuenta</h2>

      <input
        type="text"
        placeholder="Nombre"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Apellido"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
      />
      <input
        type="email"
        placeholder="Correo electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {showerr && <p className="error-text">{showerr}</p>}

      <button onClick={handleRegister}>Registrarse</button>
    </div>
  );
}

export default RegisterPage;
