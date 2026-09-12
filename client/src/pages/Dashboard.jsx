import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api.js';
import TripCard from '../components/TripCard.jsx';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const [trips, setTrips] = useState([]);

    const loadTrips = async () => {
        const response = await api.get('/trips');
        setTrips(response.data);
    };

    useEffect(() => {
        loadTrips();
    }, []);

    const handleDelete = async (id) => {
        await api.delete(`/trips/${id}`);
        loadTrips();
    };

    const handleToggleFavorite = async (id) => {
        await api.patch(`/trips/${id}/favorite`);
        loadTrips();
    };

    return (
        <div className="dashboard-page">
            <div className="dashboard-header">
                <div>
                    <p className="eyebrow">Dashboard</p>
                    <h2>Welcome, {user?.name || 'traveler'}!</h2>
                    <p>Your saved trip ideas are ready whenever you want them.</p>
                </div>
                <button className="secondary-btn" onClick={logout}>Logout</button>
            </div>

            <div className="dashboard-grid">
                <div className="info-card">
                    <h3>Quick start</h3>
                    <p>Start a new trip plan and build your itinerary with AI.</p>
                    <Link className="primary-btn" to="/create-trip">Create New Trip</Link>
                </div>
                <div className="info-card">
                    <h3>Trip stats</h3>
                    <ul>
                        <li>Total Trips: {trips.length}</li>
                        <li>Favorite Trips: {trips.filter((trip) => trip.favorite).length}</li>
                        <li>Recent Trips: {trips.slice(0, 3).length}</li>
                    </ul>
                </div>
            </div>

            <div className="dashboard-grid" style={{ marginTop: '20px' }}>
                {trips.map((trip) => (
                    <TripCard key={trip._id} trip={trip} onDelete={handleDelete} onToggleFavorite={handleToggleFavorite} />
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
