import { useEffect, useState } from 'react';
import axios from 'axios';

const StoreOwnerDashboard = () => {
    const [stores, setStores] = useState([]);
    const [ratings, setRatings] = useState([]);
    const [filters, setFilters] = useState({ name: '', email: '', address: '', sortBy: 'name', order: 'asc' });
    const [newStore, setNewStore] = useState({ name: '', email: '', address: '' });
    const [error, setError] = useState('');

    useEffect(() => {
        console.log('StoreOwnerDashboard mounted'); // Debug
        fetchStores();
        fetchRatings();
    }, []);

    const validateStoreForm = () => {
        if (newStore.name.length < 20 || newStore.name.length > 60) {
            setError('Store name must be 20-60 characters');
            return false;
        }
        if (!newStore.email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
            setError('Invalid store email format');
            return false;
        }
        if (newStore.address && newStore.address.length > 400) {
            setError('Store address must be under 400 characters');
            return false;
        }
        return true;
    };

    const fetchStores = async () => {
        try {
            console.log('Fetching stores...'); // Debug
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/store-owner/stores`, {
                headers: { 
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                params: filters,
            });
            console.log('Stores response:', response.data); // Debug
            setStores(response.data);
        } catch (err) {
            console.error('Stores error:', err.response?.data || err.message); // Debug
            setError(err.response?.data?.message || 'Error fetching stores');
        }
    };

    const fetchRatings = async () => {
        try {
            console.log('Fetching ratings...'); // Debug
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/store-owner/ratings`, {
                headers: { 
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log('Ratings response:', response.data); // Debug
            setRatings(response.data);
        } catch (err) {
            console.error('Ratings error:', err.response?.data || err.message); // Debug
            setError(err.response?.data?.message || 'Error fetching ratings');
        }
    };

    const handleAddStore = async (e) => {
        e.preventDefault();
        setError('');
        if (!validateStoreForm()) return;

        try {
            console.log('Adding store:', newStore); // Debug
            await axios.post(`${import.meta.env.VITE_API_URL}/api/store-owner/stores`, newStore, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            fetchStores();
            setNewStore({ name: '', email: '', address: '' });
        } catch (err) {
            console.error('Add store error:', err.response?.data || err.message); // Debug
            setError(err.response?.data.message || 'Error adding store');
        }
    };

    const handleSort = (field) => {
        const newOrder = filters.sortBy === field && filters.order === 'asc' ? 'desc' : 'asc';
        setFilters({ ...filters, sortBy: field, order: newOrder });
        fetchStores();
    };

    return (
        <div className="py-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Store Owner Dashboard</h2>
            {error && <div className="text-red-500 mb-6 text-center">{error}</div>}

            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Add Store</h3>
            <form onSubmit={handleAddStore} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 bg-white p-6 rounded-lg shadow-md">
                <input
                    type="text"
                    placeholder="Name"
                    className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={newStore.name}
                    onChange={(e) => setNewStore({ ...newStore, name: e.target.value })}
                />
                <input
                    type="email"
                    placeholder="Email"
                    className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={newStore.email}
                    onChange={(e) => setNewStore({ ...newStore, email: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Address"
                    className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={newStore.address}
                    onChange={(e) => setNewStore({ ...newStore, address: e.target.value })}
                />
                <button
                    type="submit"
                    className="bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition col-span-1 md:col-span-3"
                >
                    Add Store
                </button>
            </form>

            {/* <h3 className="text-2xl font-semibold text-gray-800 mb-4">My Stores</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6 bg-white p-6 rounded-lg shadow-md">
                <input
                    type="text"
                    placeholder="Filter by Name"
                    className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={filters.name}
                    onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Filter by Email"
                    className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={filters.email}
                    onChange={(e) => setFilters({ ...filters, email: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Filter by Address"
                    className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={filters.address}
                    onChange={(e) => setFilters({ ...filters, address: e.target.value })}
                />
                <button
                    className="bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                    onClick={fetchStores}
                >
                    Apply Filters
                </button>
            </div> */}
            <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                <table className="w-full">
                    <thead>
                        <tr>
                            <th className="cursor-pointer" onClick={() => handleSort('name')}>
                                Name {filters.sortBy === 'name' && (filters.order === 'asc' ? '↑' : '↓')}
                            </th>
                            <th className="cursor-pointer" onClick={() => handleSort('email')}>
                                Email {filters.sortBy === 'email' && (filters.order === 'asc' ? '↑' : '↓')}
                            </th>
                            <th>Address</th>
                            <th>Rating</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stores.map((store) => (
                            <tr key={store.id} className="hover:bg-gray-50">
                                <td>{store.name}</td>
                                <td>{store.email}</td>
                                <td>{store.address || 'N/A'}</td>
                                <td>{store.average_rating !== undefined && store.average_rating !== null ? parseFloat(store.average_rating).toFixed(1) : 'N/A'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <h3 className="text-2xl font-semibold text-gray-800 mb-4 mt-8">Store Ratings</h3>
            <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                <table className="w-full">
                    <thead>
                        <tr>
                            <th>Store Name</th>
                            <th>Rating</th>
                            <th>User ID</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ratings.map((rating) => (
                            <tr key={rating.id} className="hover:bg-gray-50">
                                <td>{rating.store_name}</td>
                                <td>{rating.rating}</td>
                                <td>{rating.user_id}</td>
                                <td>{new Date(rating.created_at).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StoreOwnerDashboard;