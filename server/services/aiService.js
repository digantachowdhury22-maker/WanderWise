import https from 'https';
import dotenv from 'dotenv';

dotenv.config();

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const OPENROUTER_MODEL = 'openai/gpt-4o-mini';

const buildPrompt = (payload) => {
    return `You are a helpful travel planner. Create a personalized trip plan in STRICT JSON format. The user wants a trip to ${payload.destination} starting on ${payload.startDate} for ${payload.days} days with a budget of ${payload.budget}. Travelers: ${payload.travelers}. Travel style: ${payload.travelStyle}. Trip type: ${payload.tripType}. Interests: ${payload.interests.join(', ')}. Return JSON with this exact structure: {"summary":"...","itinerary":[{"day":1,"title":"...","activities":[{"time":"Morning","activity":"...","description":"...","estimatedCost":500}]}],"hotels":[{"name":"...","area":"...","estimatedPricePerNight":2000,"description":"..."}],"restaurants":[{"name":"...","area":"...","estimatedCostPerPerson":500,"recommendedFood":"..."}],"attractions":[{"name":"...","description":"...","estimatedEntryFee":200}],"budgetBreakdown":{"accommodation":8000,"food":5000,"transport":4000,"activities":3000,"shoppingAndExtras":2000,"estimatedTotal":22000},"travelTips":["..."]}. Prices are estimates only. Do not pretend to have real-time hotel availability. Make the plan practical and concise.`;
};

export const generateTripWithFreeAPI = async (payload) => {
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
        throw new Error('OPENROUTER_API_KEY is not configured');
    }

    const body = JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: [
            {
                role: 'system',
                content: 'You are a practical travel planner that returns strict JSON only.',
            },
            {
                role: 'user',
                content: buildPrompt(payload),
            },
        ],
        temperature: 0.7,
    });

    return new Promise((resolve, reject) => {
        const req = https.request(
            OPENROUTER_URL,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(body),
                    'Authorization': `Bearer ${apiKey}`,
                    'HTTP-Referer': 'http://localhost:5000',
                    'X-Title': 'WanderWise',
                },
            },
            (res) => {
                let data = '';
                res.on('data', (chunk) => {
                    data += chunk;
                });
                res.on('end', () => {
                    if (res.statusCode && res.statusCode >= 400) {
                        let message = `OpenRouter request failed with status ${res.statusCode}`;
                        try {
                            const parsed = JSON.parse(data);
                            message = parsed?.error?.message || message;
                        } catch (error) {
                            message = data || message;
                        }
                        reject(new Error(message));
                        return;
                    }

                    try {
                        const parsed = JSON.parse(data);
                        const responseText = parsed?.choices?.[0]?.message?.content || '';

                        if (!responseText) {
                            reject(new Error('No response content from free provider'));
                            return;
                        }

                        const cleaned = responseText.replace(/```json|```/g, '').trim();
                        const json = JSON.parse(cleaned);
                        resolve(json);
                    } catch (error) {
                        reject(new Error('Invalid JSON returned by the free provider'));
                    }
                });
            }
        );

        req.on('error', (error) => {
            reject(new Error(`Free provider request failed: ${error.message}`));
        });

        req.write(body);
        req.end();
    });
};
