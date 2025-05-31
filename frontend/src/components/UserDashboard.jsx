import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import StarRating from './StarRating';

const UserDashboard = () => {
    const [stores, setStores] = useState([]);
    const [filters, setFilters] = useState({ name: '', address: '', sortBy: 'name', order: 'asc' });
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState({}); // storeId: true/false

    // Debounce logic for filters
    const debounceTimeout = useRef();

    useEffect(() => {
        if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
        debounceTimeout.current = setTimeout(() => {
            fetchStores();
        }, 400);
        return () => clearTimeout(debounceTimeout.current);
    }, [filters.name, filters.address, filters.sortBy, filters.order]);

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

    const handleRatingChange = async (storeId, rating) => {
        setSubmitting((prev) => ({ ...prev, [storeId]: true }));
        try {
            await axios.post(
                `${import.meta.env.VITE_API_URL}/api/user/stores/${storeId}/rate`,
                { rating },
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            fetchStores(); // Refresh ratings
        } catch (err) {
            console.error('Error submitting rating:', err);
            setError(err.response?.data?.message || 'Error submitting rating');
        } finally {
            setSubmitting((prev) => ({ ...prev, [storeId]: false }));
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stores.map((store) => (
                    <div key={store.id} className="bg-white border border-gray-200 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow flex flex-col gap-3">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-xl font-bold text-gray-800">{store.name}</h2>
                            <div className="flex items-center gap-1">
                                <StarRating value={store.overall_rating ? Math.round(store.overall_rating) : 0} readOnly size={20} />
                                <span className="ml-1 text-yellow-600 font-semibold text-sm">{store.overall_rating ? parseFloat(store.overall_rating).toFixed(2) : 'No ratings'}</span>
                            </div>
                        </div>
                        <p className="text-gray-500 mb-2">{store.address}</p>
                        <div className="flex items-center gap-2 mt-2">
                            <span className="text-lg font-semibold text-indigo-700 tracking-wide drop-shadow-sm bg-indigo-50 px-2 py-1 rounded-md shadow-inner border border-indigo-100 mr-2 transition-all duration-200">Your Rating:</span>
                            <StarRating
                                value={store.user_rating || 0}
                                onChange={rating => handleRatingChange(store.id, rating)}
                                readOnly={submitting[store.id]}
                                size={22}
                            />
                            {submitting[store.id] && <span className="text-sm text-gray-400 ml-2">Saving...</span>}
                        </div>
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