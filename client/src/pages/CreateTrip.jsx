import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api.js';

const CreateTrip = () => {
    const [form, setForm] = useState({
        destination: '',
        startDate: '',
        days: '5',
        budget: '',
        travelers: '2',
        travelStyle: 'Balanced',
        tripType: 'Couple',
        interests: 'Adventure',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.post('/trips/generate', {
                ...form,
                days: Number(form.days),
                budget: Number(form.budget),
                travelers: Number(form.travelers),
                interests: form.interests.split(',').map((item) => item.trim()).filter(Boolean),
            });

            navigate(`/trip/${response.data._id}`);
        } catch (err) {
            setError(err.response?.data?.message || 'Unable to create trip');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-card">
            <h2>Create a new trip</h2>
            <p>Fill in your travel details to prepare a personalized itinerary.</p>
            {error ? <div className="error-box">{error}</div> : null}
            <form className="trip-form" onSubmit={handleSubmit}>
                <label>
                    Destination
                    <input value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} required />
                </label>
                <label>
                    Start Date
                    <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} required />
                </label>
                <label>
                    Number of Days
                    <input type="number" min="1" max="14" value={form.days} onChange={(e) => setForm({ ...form, days: e.target.value })} required />
                </label>
                <label>
                    Budget
                    <input value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} placeholder="₹25,000" required />
                </label>
                <label>
                    Travelers
                    <input type="number" min="1" value={form.travelers} onChange={(e) => setForm({ ...form, travelers: e.target.value })} required />
                </label>
                <label>
                    Travel Style
                    <select value={form.travelStyle} onChange={(e) => setForm({ ...form, travelStyle: e.target.value })}>
                        <option>Budget</option>
                        <option>Balanced</option>
                        <option>Luxury</option>
                    </select>
                </label>
                <label>
                    Trip Type
                    <select value={form.tripType} onChange={(e) => setForm({ ...form, tripType: e.target.value })}>
                        <option>Solo</option>
                        <option>Couple</option>
                        <option>Friends</option>
                        <option>Family</option>
                    </select>
                </label>
                <label>
                    Interests
                    <input value={form.interests} onChange={(e) => setForm({ ...form, interests: e.target.value })} placeholder="Adventure, Beaches, Food" />
                </label>
                <button type="submit" disabled={loading}>{loading ? 'Creating trip...' : 'Generate My Trip'}</button>
            </form>
        </div>
    );
};

export default CreateTrip;
