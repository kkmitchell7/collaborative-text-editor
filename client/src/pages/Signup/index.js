import React from 'react'
import { useNavigate } from 'react-router-dom';
import './styles.css'

export default function Signup() {
    const navigate = useNavigate();
    const backendUrl = process.env.REACT_APP_BACKEND_URL;

    const handleSignup = async (e) => {
        e.preventDefault();
        const username = e.target.username.value;
        const password = e.target.password.value;

        const response = await fetch(`${backendUrl}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            alert('Signup successful! Please log in.');
            navigate('/'); // Redirect to login page
        } else {
            alert('Signup failed. Please try again.');
        }
    };

    return (
        <div className="signup-container">
            <h1>Signup</h1>
            <form onSubmit={handleSignup} className="signup-form">
                <div className="input-group">
                    <label>Username:</label>
                    <input 
                        type="text" 
                        name="username" 
                        required 
                        className="input-field"
                    />
                </div>
                <div className="input-group">
                    <label>Password:</label>
                    <input 
                        type="password" 
                        name="password" 
                        required 
                        className="input-field"
                    />
                </div>
                <button type="submit" className="submit-button">Signup</button>
            </form>
            <button onClick={() => navigate('/')} className="back-to-login-button">Back to Login</button>
        </div>
    );
}
