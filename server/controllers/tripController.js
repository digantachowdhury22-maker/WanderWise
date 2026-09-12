import Trip from '../models/Trip.js';
import { generateTripWithFreeAPI } from '../services/aiService.js';

const buildFallbackTrip = (payload) => ({
    summary: `A ${payload.days}-day trip to ${payload.destination} tailored for ${payload.travelStyle.toLowerCase()} travel.`,
    itinerary: [
        {
            day: 1,
            title: 'Arrival and local highlights',
            activities: [
                {
                    time: 'Morning',
                    activity: 'Check in and settle',
                    description: 'Start with a relaxed arrival and explore the local surroundings.',
                    estimatedCost: 500,
                },
            ],
        },
    ],
    hotels: [
        {
            name: 'City Stay Hotel',
            area: 'Central Area',
            estimatedPricePerNight: 1800,
            description: 'Comfortable stay with easy access to key attractions.',
        },
    ],
    restaurants: [
        {
            name: 'Local Flavors',
            area: 'Downtown',
            estimatedCostPerPerson: 600,
            recommendedFood: 'Signature local dish',
        },
    ],
    attractions: [
        {
            name: 'Main Sight',
            description: 'A must-visit experience for first-time travelers.',
            estimatedEntryFee: 300,
        },
    ],
    budgetBreakdown: {
        accommodation: 7000,
        food: 4000,
        transport: 3000,
        activities: 2500,
        shoppingAndExtras: 1500,
        estimatedTotal: 18000,
    },
    travelTips: ['Carry a small day bag.', 'Keep cash for local vendors.'],
});

export const generateTrip = async (req, res) => {
    try {
        const payload = req.body;

        if (!payload.destination || !payload.startDate || !payload.days || !payload.budget) {
            return res.status(400).json({ message: 'Please provide destination, start date, days, and budget' });
        }

        if (!process.env.MONGO_URI) {
            return res.status(503).json({ message: 'Database is not configured yet. Add MONGO_URI to continue.' });
        }

        let aiTrip;
        try {
            aiTrip = await generateTripWithFreeAPI(payload);
        } catch (error) {
            console.error('AI trip generation failed:', error.message);
            aiTrip = buildFallbackTrip(payload);
        }

        const trip = await Trip.create({
            user: req.user._id,
            destination: payload.destination,
            startDate: payload.startDate,
            days: Number(payload.days),
            budget: Number(payload.budget),
            travelers: Number(payload.travelers || 1),
            travelStyle: payload.travelStyle || 'Balanced',
            tripType: payload.tripType || 'Solo',
            interests: payload.interests || [],
            summary: aiTrip.summary,
            itinerary: aiTrip.itinerary,
            hotels: aiTrip.hotels,
            restaurants: aiTrip.restaurants,
            attractions: aiTrip.attractions,
            budgetBreakdown: aiTrip.budgetBreakdown,
            travelTips: aiTrip.travelTips,
        });

        res.status(201).json(trip);
    } catch (error) {
        res.status(500).json({ message: 'Unable to generate trip' });
    }
};

export const getTrips = async (req, res) => {
    try {
        const trips = await Trip.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(trips);
    } catch (error) {
        res.status(500).json({ message: 'Unable to fetch trips' });
    }
};

export const getTripById = async (req, res) => {
    try {
        const trip = await Trip.findOne({ _id: req.params.id, user: req.user._id });
        if (!trip) {
            return res.status(404).json({ message: 'Trip not found' });
        }
        res.json(trip);
    } catch (error) {
        res.status(500).json({ message: 'Unable to fetch trip' });
    }
};

export const deleteTrip = async (req, res) => {
    try {
        const trip = await Trip.findOneAndDelete({ _id: req.params.id, user: req.user._id });
        if (!trip) {
            return res.status(404).json({ message: 'Trip not found' });
        }
        res.json({ message: 'Trip deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Unable to delete trip' });
    }
};

export const toggleFavorite = async (req, res) => {
    try {
        const trip = await Trip.findOne({ _id: req.params.id, user: req.user._id });
        if (!trip) {
            return res.status(404).json({ message: 'Trip not found' });
        }

        trip.favorite = !trip.favorite;
        await trip.save();
        res.json(trip);
    } catch (error) {
        res.status(500).json({ message: 'Unable to update favorite status' });
    }
};
