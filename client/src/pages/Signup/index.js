import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom';
import './styles.css'

export default function Signup() {
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [countdown, setCountdown] = useState(3);
    
    const navigate = useNavigate();
    const backendUrl = process.env.REACT_APP_BACKEND_URL;

    //Delay function for delay to redirect to login page
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }

    const handleSignup = async (e) => {
        e.preventDefault();
        try{
            const username = e.target.username.value;
            const password = e.target.password.value;

            const response = await fetch(`${backendUrl}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            if (response.ok){
                setMessage('Success! Redirecting in 3 seconds...');
                //countdown to redirection
                let counter = 3;
                const interval = setInterval(() => {
                    counter -= 1;
                    setCountdown(counter);
                    if (counter === 0) {
                    clearInterval(interval);
                    }
                }, 1000);
                await delay(3000);
                navigate('/login'); // Redirect to login page 
            } else {
                try{
                    const data = await response.json();
                    if (data.error === 'Username is already taken') {
                        setError(data.error); // Display specific error message
                    } else {
                        setError('Something went wrong, please try again.');
                    }
                } catch (err) {
                    console.error('Error parsing response:', err);
                    setError('A server error occurred. Please try again.');
                }
            }
        } catch (error){
            setError(error)
            return;
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
                        maxlength="15"
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
                {error && <p className="error-message">{error}</p>}
                {message && countdown > 0 && <p className="success-message">Success! Redirecting in {countdown}...</p>}
                <button type="submit" className="submit-button">Signup</button>
            </form>
            <button onClick={() => navigate('/')} className="back-to-login-button">Back to Login</button>
        </div>
    );
}
