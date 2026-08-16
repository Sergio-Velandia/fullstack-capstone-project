import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AuthContext';
import './LoginPage.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [incorrect, setIncorrect] = useState('');

  const navigate = useNavigate();
  const { setIsLoggedIn } = useAppContext();
  const urlConfig = { backendUrl: process.env.REACT_APP_BACKEND_URL };

  const handleLogin = async () => {
    try {
      const authtoken = sessionStorage.getItem('auth-token');

      const response = await fetch(`${urlConfig.backendUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authtoken ? `Bearer ${authtoken}` : '',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.authtoken) {
        sessionStorage.setItem('auth-token', data.authtoken);
        sessionStorage.setItem('name', data.userName);
        sessionStorage.setItem('email', data.userEmail);
        setIsLoggedIn(true);
        navigate('/app');
      } else {
        setIncorrect(data.error || 'Correo o contraseña incorrectos');
      }
    } catch (e) {
      setIncorrect('Error de conexión con el servidor');
    }
  };

  return (
    <div className="login-container">
      <h2>Iniciar sesión</h2>

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

      {incorrect && <p className="error-text">{incorrect}</p>}

      <button onClick={handleLogin}>Ingresar</button>
    </div>
  );
}

export default LoginPage;
