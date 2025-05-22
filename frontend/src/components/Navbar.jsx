import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        onLogout();
        navigate('/login');
    };

    return (
        <nav className="bg-blue-600 text-white p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-xl font-bold">Store Rating</Link>
                <div className="flex items-center space-x-6">
                    {user ? (
                        <>
                            <span className="text-sm md:text-base">Welcome, {user.name} ({user.role})</span>
                            <Link to="/update-password" className="text-sm md:text-base hover:text-blue-200">Update Password</Link>
                            <button
                                onClick={handleLogout}
                                className="text-sm md:text-base hover:text-blue-200"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-sm md:text-base hover:text-blue-200">Login</Link>
                            <Link to="/signup" className="text-sm md:text-base hover:text-blue-200">Signup</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;