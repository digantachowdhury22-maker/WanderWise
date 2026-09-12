import { Link } from 'react-router-dom';

const TripCard = ({ trip, onDelete, onToggleFavorite }) => {
    return (
        <div className="info-card">
            <h3>{trip.destination}</h3>
            <p>{trip.startDate} • {trip.days} days</p>
            <p>Budget: {trip.budget}</p>
            <p>Travel style: {trip.travelStyle}</p>
            <div className="hero-actions" style={{ marginTop: '12px' }}>
                <Link className="primary-btn" to={`/trip/${trip._id}`}>View</Link>
                <button className="secondary-btn" onClick={() => onToggleFavorite(trip._id)}>
                    {trip.favorite ? '★ Favorite' : '☆ Favorite'}
                </button>
                <button className="secondary-btn" onClick={() => onDelete(trip._id)}>Delete</button>
            </div>
        </div>
    );
};

export default TripCard;
