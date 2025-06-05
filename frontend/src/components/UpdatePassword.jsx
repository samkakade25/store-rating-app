import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UpdatePassword = () => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const validatePassword = () => {
        if (!password.match(/^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/)) {
            setError('Password must be 8-16 characters with at least one uppercase letter and one special character');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        if (!validatePassword()) return;

        try {
            await axios.put(
                `${import.meta.env.VITE_API_URL}/api/auth/password`,
                { password },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            setSuccess('Password updated successfully');
            setTimeout(() => navigate('/dashboard'), 2000);
        } catch (err) {
            setError(err.response?.data.message || 'Error updating password');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="max-w-md w-full mx-4 p-8 bg-white rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Update Password</h2>
                {error && <div className="text-red-500 text-center mb-4">{error}</div>}
                {success && <div className="text-green-500 text-center mb-4">{success}</div>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="form-label">New Password</label>
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
                        Update Password
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UpdatePassword;