import { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
    const [dashboard, setDashboard] = useState({});
    const [stores, setStores] = useState([]);
    const [users, setUsers] = useState([]);
    const [filters, setFilters] = useState({ name: '', email: '', address: '', role: '', sortBy: 'name', order: 'asc' });
    const [newUser, setNewUser] = useState({ name: '', email: '', address: '', password: '', role: '' });
    const [newStore, setNewStore] = useState({ name: '', email: '', address: '', owner_id: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadDashboard = async () => {
            setIsLoading(true);
            try {
                await Promise.all([
                    fetchDashboard(),
                    fetchStores(),
                    fetchUsers()
                ]);
            } catch (err) {
                console.error('Dashboard loading error:', err);
            } finally {
                setIsLoading(false);
            }
        };
        loadDashboard();
    }, []);

    const validateUserForm = () => {
        if (newUser.name.length < 20 || newUser.name.length > 60) {
            setError('User name must be 20-60 characters');
            return false;
        }
        if (!newUser.email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
            setError('Invalid user email format');
            return false;
        }
        if (newUser.address && newUser.address.length > 400) {
            setError('User address must be under 400 characters');
            return false;
        }
        if (!newUser.password.match(/^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/)) {
            setError('User password must be 8-16 characters with at least one uppercase letter and one special character');
            return false;
        }
        if (!['admin', 'user', 'store_owner'].includes(newUser.role)) {
            setError('Invalid role selected');
            return false;
        }
        return true;
    };

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
        if (!newStore.owner_id || isNaN(newStore.owner_id)) {
            setError('Valid owner ID required');
            return false;
        }
        return true;
    };

    const fetchDashboard = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/dashboard`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setDashboard(response.data);
        } catch (err) {
            console.error('Error fetching dashboard:', err);
            setError(err.response?.data?.message || 'Error fetching dashboard data');
        }
    };

    const fetchStores = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/stores`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                params: filters,
            });
            setStores(response.data);
        } catch (err) {
            console.error('Error fetching stores:', err);
            setError(err.response?.data?.message || 'Error fetching stores');
        }
    };

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Authentication token not found');
                return;
            }

            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/users`, {
                headers: { 
                    'Authorization': `Bearer ${token}`
                }
            });

            if (Array.isArray(response.data)) {
                setUsers(response.data);
                setError('');
            } else {
                throw new Error('Invalid response format');
            }
        } catch (err) {
            console.error('Error fetching users:', err);
            setError(err.response?.data?.message || 'Failed to fetch users');
            setUsers([]);
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        setError('');
        
        try {
            if (!validateUserForm()) return;

            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/admin/users`, 
                newUser,
                {
                    headers: { 
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.status === 201) {
                await fetchUsers();
                setNewUser({ name: '', email: '', address: '', password: '', role: '' });
                setError('');
            }
        } catch (err) {
            console.error('Error adding user:', err);
            setError(err.response?.data?.message || 'Error adding user');
        }
    };

    const handleAddStore = async (e) => {
        e.preventDefault();
        setError('');
        if (!validateStoreForm()) return;

        try {
            await axios.post(`${process.env.VITE_API_URL}/admin/stores`, newStore, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            fetchStores();
            setNewStore({ name: '', email: '', address: '', owner_id: '' });
        } catch (err) {
            setError(err.response?.data.message || 'Error adding store');
        }
    };

    const handleSort = (field) => {
        const newOrder = filters.sortBy === field && filters.order === 'asc' ? 'desc' : 'asc';
        setFilters({ ...filters, sortBy: field, order: newOrder });
        fetchStores();
        fetchUsers();
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-xl">Loading dashboard...</div>
            </div>
        );
    }

    return (
        <div className="py-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h2>
            {error && <div className="text-red-500 mb-6 text-center">{error}</div>}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                    <h3 className="text-lg font-semibold text-gray-700">Total Users</h3>
                    <p className="text-2xl text-blue-600">{dashboard.totalUsers || 0}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                    <h3 className="text-lg font-semibold text-gray-700">Total Stores</h3>
                    <p className="text-2xl text-blue-600">{dashboard.totalStores || 0}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                    <h3 className="text-lg font-semibold text-gray-700">Total Ratings</h3>
                    <p className="text-2xl text-blue-600">{dashboard.totalRatings || 0}</p>
                </div>
            </div>

            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Add User</h3>
            <form onSubmit={handleAddUser} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 bg-white p-6 rounded-lg shadow-md">
                <input
                    type="text"
                    placeholder="Name"
                    className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                />
                <input
                    type="email"
                    placeholder="Email"
                    className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Address"
                    className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={newUser.address}
                    onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                />
                <select
                    className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                >
                    <option value="">Select Role</option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                    <option value="store_owner">Store Owner</option>
                </select>
                <button
                    type="submit"
                    className="bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition col-span-1 md:col-span-2"
                >
                    Add User
                </button>
            </form>

            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Add Store</h3>
            <form onSubmit={handleAddStore} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 bg-white p-6 rounded-lg shadow-md">
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
                <input
                    type="number"
                    placeholder="Owner ID"
                    className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={newStore.owner_id}
                    onChange={(e) => setNewStore({ ...newStore, owner_id: e.target.value })}
                />
                <button
                    type="submit"
                    className="bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition col-span-1 md:col-span-2"
                >
                    Add Store
                </button>
            </form>

            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Stores</h3>
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
            </div>
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
                                <td>{store.address}</td>
                                <td>{store.rating ? parseFloat(store.rating).toFixed(1) : 'N/A'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <h3 className="text-2xl font-semibold text-gray-800 mb-4 mt-8">Users</h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6 bg-white p-6 rounded-lg shadow-md">
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
                <select
                    className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={filters.role}
                    onChange={(e) => setFilters({ ...filters, role: e.target.value })}
                >
                    <option value="">All Roles</option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                    <option value="store_owner">Store Owner</option>
                </select>
                <button
                    className="bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                    onClick={fetchUsers}
                >
                    Apply Filters
                </button>
            </div>
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
                            <th>Role</th>
                            <th>Rating</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.address}</td>
                                <td>{user.role}</td>
                                <td>
                                    {user.rating && user.role === 'store_owner' ? parseFloat(user.rating).toFixed(1) : 'N/A'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminDashboard;