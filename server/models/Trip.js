import mongoose from 'mongoose';

const itineraryDaySchema = new mongoose.Schema({
    day: Number,
    title: String,
    activities: [
        {
            time: String,
            activity: String,
            description: String,
            estimatedCost: Number,
        },
    ],
});

const tripSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        destination: { type: String, required: true, trim: true },
        startDate: { type: String, required: true },
        days: { type: Number, required: true },
        budget: { type: Number, required: true },
        travelers: { type: Number, required: true },
        travelStyle: { type: String, required: true },
        tripType: { type: String, required: true },
        interests: [{ type: String }],
        summary: { type: String, default: '' },
        itinerary: [itineraryDaySchema],
        hotels: [{ type: Object }],
        restaurants: [{ type: Object }],
        attractions: [{ type: Object }],
        budgetBreakdown: { type: Object, default: {} },
        travelTips: [{ type: String }],
        favorite: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const Trip = mongoose.model('Trip', tripSchema);

export default Trip;
