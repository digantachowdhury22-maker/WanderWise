# WanderWise

A simple AI-powered travel planner built with React, Express, MongoDB, and JWT authentication.

## MongoDB setup

### Option 1: MongoDB Atlas (recommended)
1. Create a free cluster at https://www.mongodb.com/atlas
2. Create a database user and allow network access from 0.0.0.0/0.0.0.0
3. Copy your connection string and set it in the `.env` file:

```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority
JWT_SECRET=your-secret-key
PORT=5000
```

### Option 2: Local MongoDB
If you have MongoDB installed locally, use:

```env
MONGO_URI=mongodb://127.0.0.1:27017/wanderwise
```

Then start the backend:

```bash
npm run dev
```
