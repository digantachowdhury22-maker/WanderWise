import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import './App.css';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import CreateTrip from './pages/CreateTrip.jsx';
import NotFound from './pages/NotFound.jsx';
import TripDetails from './pages/TripDetails.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

function HomePage() {
  return (
    <div className="app-shell">
      <header className="hero-card">
        <div className="hero-content">
          <p className="eyebrow">AI Trip Planner</p>
          <h1>Plan your perfect trip with intelligence and ease.</h1>
          <p className="hero-text">
            WanderWise helps travelers generate personalized itineraries, budget plans,
            hotel ideas, dining suggestions, and travel tips in one place.
          </p>
          <div className="hero-actions">
            <Link className="primary-btn" to="/register">Get Started</Link>
            <a className="secondary-btn" href="#features">Explore Features</a>
          </div>
        </div>
      </header>

      <main>
        <section id="features" className="section-card">
          <h2>Why WanderWise stands out</h2>
          <div className="feature-grid">
            {['AI Itinerary', 'Smart Budget Planning', 'Hotel Suggestions', 'Restaurant Picks'].map((item) => (
              <div key={item} className="feature-card">
                <h3>{item}</h3>
                <p>Every plan is designed to feel practical, easy to follow, and ready for real travel.</p>
              </div>
            ))}
          </div>
        </section>

        <section id="how-it-works" className="section-card">
          <h2>How it works</h2>
          <div className="steps-grid">
            <div className="step-card">
              <span>1</span>
              <h3>Share your travel goals</h3>
              <p>Enter your destination, dates, budget, and interests.</p>
            </div>
            <div className="step-card">
              <span>2</span>
              <h3>Let AI create the plan</h3>
              <p>Receive a structured itinerary with hotels, restaurants, and attractions.</p>
            </div>
            <div className="step-card">
              <span>3</span>
              <h3>Save and enjoy</h3>
              <p>Keep your trips organized and revisit them whenever you need.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <nav className="top-nav">
        <Link to="/" className="nav-brand">WanderWise</Link>
        <div className="nav-links">
          <Link to="/">Home</Link>
          {user ? <Link to="/dashboard">Dashboard</Link> : <Link to="/login">Login</Link>}
          {!user && <Link to="/register">Register</Link>}
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <Register />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/create-trip" element={<ProtectedRoute><CreateTrip /></ProtectedRoute>} />
        <Route path="/trip/:id" element={<ProtectedRoute><TripDetails /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
