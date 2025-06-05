import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const validateForm = () => {
        if (!email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
            setError('Invalid email format');
            return false;
        }
        if (!password.match(/^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/)) {
            setError('Password must be 8-16 characters with at least one uppercase letter and one special character');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!validateForm()) return;

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, { email, password });
            localStorage.setItem('token', response.data.token);
            onLogin(response.data.user);
            // Navigate to dashboard after successful login
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data.message || 'Error logging in');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="max-w-md w-full mx-4 p-8 bg-white rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Login</h2>
                {error && <div className="text-red-500 text-center mb-4">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            className="text-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="text-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="form-button"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;