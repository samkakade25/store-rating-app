import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = ({ onSignup } ) => {
    const [formData, setFormData] = useState({ name: '', email: '', address: '', password: '', role: 'user' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const validateForm = () => {
        if (formData.name.length < 20 || formData.name.length > 60) {
            setError('Name must be 20-60 characters');
            return false;
        }
        if (!formData.email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
            setError('Invalid email format');
            return false;
        }
        if (formData.address && formData.address.length > 400) {
            setError('Address must be under 400 characters');
            return false;
        }
        if (!formData.password.match(/^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/)) {
            setError('Password must be 8-16 characters with at least one uppercase letter and one special character');
            return false;
        }
        if (!['admin', 'user', 'store_owner'].includes(formData.role)) {
            setError('Invalid role selected');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!validateForm()) return;

        console.log('Sending signup request:', formData); // Debug

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/signup`, formData);
            console.log('Signup response:', response.data); // Debug
            localStorage.setItem('token', response.data.token);
            onSignup(response.data.user);
            navigate('/login');
        } catch (err) {
            console.error('Signup error:', err.response?.data || err.message); // Debug
            setError(err.response?.data.message || 'Error signing up');
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="max-w-md w-full mx-4 p-8 bg-white rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Signup</h2>
                {error && <div className="text-red-500 text-center mb-4">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className='form-label'>Name</label>
                        <input
                            type="text"
                            name="name"
                            className="text-input"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label className='form-label'>Email</label>
                        <input
                            type="email"
                            name="email"
                            className="text-input"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label className='form-label'>Address</label>
                        <input
                            type="text"
                            name="address"
                            className="text-input"
                            value={formData.address}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className='form-label'>Password</label>
                        <input
                            type="password"
                            name="password"
                            className="text-input"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        {/* <label className="block text-gray-700 font-medium mb-2">Role</label> */}
                        {/* <select
                            name="role"
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={formData.role}
                            onChange={handleChange}
                            required
                        >
                            <option value="user">User</option>
                            <option value="store_owner">Store Owner</option>
                            <option value="admin">Admin</option>
                        </select> */}
                    </div>
                    <button
                        type="submit"
                        className="form-button"
                    >
                        Signup
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Signup;