import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('wanderwise-token');
        if (!token) {
            setLoading(false);
            return;
        }

        axios.get('/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => {
                setUser(res.data.user);
            })
            .catch(() => {
                localStorage.removeItem('wanderwise-token');
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const login = async (email, password) => {
        const response = await axios.post('/api/auth/login', { email, password });
        localStorage.setItem('wanderwise-token', response.data.token);
        setUser(response.data.user);
        return response.data;
    };

    const register = async (name, email, password) => {
        const response = await axios.post('/api/auth/register', { name, email, password });
        localStorage.setItem('wanderwise-token', response.data.token);
        setUser(response.data.user);
        return response.data;
    };

    const logout = () => {
        localStorage.removeItem('wanderwise-token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
