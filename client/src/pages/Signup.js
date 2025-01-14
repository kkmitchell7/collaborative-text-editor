import React from 'react'
import { useNavigate } from 'react-router-dom';

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
        <div>
            <h1>Signup</h1>
            <form onSubmit={handleSignup}>
                <div>
                    <label>Username:</label>
                    <input type="text" name="username" required />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" name="password" required />
                </div>
                <button type="submit">Signup</button>
            </form>
            <button onClick={() => navigate('/')}>Back to Login</button>
        </div>
    );
}
