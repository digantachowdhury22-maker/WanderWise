import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api.js';

const TripDetails = () => {
    const { id } = useParams();
    const [trip, setTrip] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrip = async () => {
            try {
                const response = await api.get(`/trips/${id}`);
                setTrip(response.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchTrip();
    }, [id]);

    if (loading) {
        return <div className="page-state">Loading trip details...</div>;
    }

    if (!trip) {
        return <div className="page-card"><h2>Trip not found</h2></div>;
    }

    return (
        <div className="dashboard-page">
            <Link to="/dashboard">← Back to dashboard</Link>
            <div className="page-card" style={{ marginTop: '16px' }}>
                <h2>{trip.destination}</h2>
                <p>{trip.days} days • {trip.budget} budget • {trip.tripType}</p>
                <p>{trip.summary}</p>

                <h3>Itinerary</h3>
                {trip.itinerary?.map((day) => (
                    <div key={day.day} className="info-card" style={{ marginTop: '12px' }}>
                        <h4>Day {day.day}: {day.title}</h4>
                        {day.activities?.map((activity, index) => (
                            <p key={`${day.day}-${index}`}>
                                <strong>{activity.time}</strong> — {activity.activity}: {activity.description} ({activity.estimatedCost})
                            </p>
                        ))}
                    </div>
                ))}

                <h3>Hotels</h3>
                {trip.hotels?.map((hotel, index) => (
                    <div key={`${hotel.name}-${index}`} className="info-card" style={{ marginTop: '12px' }}>
                        <h4>{hotel.name}</h4>
                        <p>{hotel.area} • Estimated {hotel.estimatedPricePerNight}/night</p>
                        <p>{hotel.description}</p>
                    </div>
                ))}

                <h3>Restaurants</h3>
                {trip.restaurants?.map((restaurant, index) => (
                    <div key={`${restaurant.name}-${index}`} className="info-card" style={{ marginTop: '12px' }}>
                        <h4>{restaurant.name}</h4>
                        <p>{restaurant.area} • Estimated {restaurant.estimatedCostPerPerson}/person</p>
                        <p>{restaurant.recommendedFood}</p>
                    </div>
                ))}

                <h3>Budget Breakdown</h3>
                <div className="info-card" style={{ marginTop: '12px' }}>
                    <p>Accommodation: {trip.budgetBreakdown?.accommodation}</p>
                    <p>Food: {trip.budgetBreakdown?.food}</p>
                    <p>Transport: {trip.budgetBreakdown?.transport}</p>
                    <p>Activities: {trip.budgetBreakdown?.activities}</p>
                    <p>Shopping/Extras: {trip.budgetBreakdown?.shoppingAndExtras}</p>
                    <p><strong>Estimated Total: {trip.budgetBreakdown?.estimatedTotal}</strong></p>
                </div>
            </div>
        </div>
    );
};

export default TripDetails;
