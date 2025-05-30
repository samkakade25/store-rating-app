import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import StoreOwnerDashboard from './components/StoreOwnerDashboard';
import Navbar from './components/Navbar';
import UpdatePassword from './components/UpdatePassword';
import './index.css';

function safeParseUser() {
    const userStr = localStorage.getItem('user');
    try {
        return userStr && userStr !== 'undefined' ? JSON.parse(userStr) : null;
    } catch {
        return null;
    }
}

function App() {
    const [user, setUser] = useState(safeParseUser());
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check authentication status on mount
        const checkAuth = () => {
            const token = localStorage.getItem('token');
            const userData = safeParseUser();
            if (!token || !userData) {
                handleLogout();
            }
            setIsLoading(false);
        };
        checkAuth();
    }, []);

    const handleLogin = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <Router>
            <Navbar user={user} onLogout={handleLogout} />
            <div className="container mx-auto p-4">
                <Routes>
                    <Route 
                        path="/" 
                        element={user ? <Navigate to="/dashboard" /> : <Home />} 
                    />
                    <Route 
                        path="/login" 
                        element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/dashboard" />} 
                    />
                    <Route 
                        path="/signup" 
                        element={!user ? <Signup onSignup={handleLogin} /> : <Navigate to="/dashboard" />} 
                    />
                    <Route
                        path="/dashboard"
                        element={
                            user ? (
                                user.role === 'admin' ? (
                                    <AdminDashboard />
                                ) : user.role === 'user' ? (
                                    <UserDashboard />
                                ) : (
                                    <StoreOwnerDashboard />
                                )
                            ) : (
                                <Navigate to="/login" />
                            )
                        }
                    />
                    <Route 
                        path="/update-password" 
                        element={user ? <UpdatePassword /> : <Navigate to="/login" />} 
                    />
                </Routes>
            </div>
        </Router>
    );
}

export default App;