import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css'

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const backendUrl = process.env.REACT_APP_BACKEND_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${backendUrl}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const { userId,token } = await response.json();
                localStorage.setItem('token', token);
                localStorage.setItem('userId', JSON.stringify(userId));
                navigate('/documents'); // Redirect to documents page
            } else {
                setError('Invalid credentials');
            }
        } catch (error) {
            console.error('Login error:', error);
            setError('An error occurred. Please try again.');
        }
    };

    return (
        <div className="login-container">
            <h1>Login</h1>
            <form onSubmit={handleSubmit} className="login-form">
                <input
                    type="username"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="input-field"
                    maxlength="15"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="input-field"
                />
                {error && <p className="error-message">{error}</p>}
                <button type="submit" className="submit-button">Login</button>
            </form>
            
            <button onClick={() => navigate('/signup')} className="signup-button">Sign Up</button>
        </div>
    );
}
