import { useEffect, useState } from 'react';
import axios from 'axios';

const UserDashboard = () => {
    const [stores, setStores] = useState([]);
    const [filters, setFilters] = useState({ name: '', address: '', sortBy: 'name', order: 'asc' });
    const [error, setError] = useState('');

    useEffect(() => {
        fetchStores();
    }, [filters]); // Add filters as dependency

    const fetchStores = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/stores`, {
                headers: { 
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                params: filters
            });
            setStores(response.data);
        } catch (err) {
            console.error('Error fetching stores:', err);
            setError(err.response?.data?.message || 'Error fetching stores');
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Store Listings</h1>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            
            {/* Filters */}
            <div className="mb-4 flex gap-4">
                <input
                    type="text"
                    placeholder="Search by name"
                    className="p-2 border rounded"
                    value={filters.name}
                    onChange={(e) => setFilters({...filters, name: e.target.value})}
                />
                <input
                    type="text"
                    placeholder="Search by address"
                    className="p-2 border rounded"
                    value={filters.address}
                    onChange={(e) => setFilters({...filters, address: e.target.value})}
                />
            </div>

            {/* Stores List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {stores.map((store) => (
                    <div key={store.id} className="border p-4 rounded shadow">
                        <h2 className="text-xl font-semibold">{store.name}</h2>
                        <p className="text-gray-600">{store.address}</p>
                        <p className="text-gray-600">Rating: {store.average_rating || 'No ratings yet'}</p>
                    </div>
                ))}
            </div>

            {stores.length === 0 && !error && (
                <p className="text-center text-gray-500">No stores found</p>
            )}
        </div>
    );
};

export default UserDashboard;