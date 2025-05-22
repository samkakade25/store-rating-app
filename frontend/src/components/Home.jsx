import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {/* Hero Section */}
            <section className="bg-blue-600 text-white py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to Store Rating</h1>
                    <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
                        Discover and rate your favorite stores. Join our community to share your experiences and help others find the best places to shop!
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link
                            to="/login"
                            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
                        >
                            Login
                        </Link>
                        <Link
                            to="/signup"
                            className="bg-blue-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-900 transition"
                        >
                            Signup
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">Why Choose Store Rating?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="text-4xl mb-4">⭐</div>
                            <h3 className="text-xl font-semibold mb-2">Rate Stores</h3>
                            <p className="text-gray-600">
                                Share your feedback by rating stores from 1 to 5 stars.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl mb-4">🔍</div>
                            <h3 className="text-xl font-semibold mb-2">Discover Stores</h3>
                            <p className="text-gray-600">
                                Search and explore stores with detailed ratings and reviews.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl mb-4">📊</div>
                            <h3 className="text-xl font-semibold mb-2">Manage Your Store</h3>
                            <p className="text-gray-600">
                                Store owners can view ratings and improve their services.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-8">
                <div className="container mx-auto px-4 text-center">
                    <p>&copy; 2025 Store Rating. All rights reserved.</p>
                    <div className="mt-4 flex justify-center gap-4">
                        <Link to="/login" className="hover:text-gray-300">Login</Link>
                        <Link to="/signup" className="hover:text-gray-300">Signup</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;