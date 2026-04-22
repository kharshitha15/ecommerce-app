import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        if (token && savedUser) {
            try {
                const decoded = jwtDecode(token);
                if (decoded.exp * 1000 < Date.now()) {
                    logout();
                } else {
                    const userData = JSON.parse(savedUser);
                    setUser(userData);
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                }
            } catch (err) {
                logout();
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const res = await axios.post('/api/v1/auth/login', { email, password });
            // Backend wraps response in ApiResponse, so data is in res.data.data
            const { token, firstName, lastName, role, email: userEmail } = res.data.data;
            
            localStorage.setItem('token', token);
            const userData = { email: userEmail, firstName, lastName, role };
            localStorage.setItem('user', JSON.stringify(userData));
            
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setUser(userData);
            return res.data;
        } catch (error) {
            const message = error.response?.data?.message || "Login failed. Please check your credentials.";
            throw new Error(message);
        }
    };

    const register = async (firstName, lastName, email, password) => {
        try {
            const res = await axios.post('/api/v1/auth/register', { firstName, lastName, email, password });
            // Backend wraps response in ApiResponse, so data is in res.data.data
            const { token, firstName: fName, lastName: lName, role, email: uEmail } = res.data.data;
            
            localStorage.setItem('token', token);
            const userData = { email: uEmail, firstName: fName, lastName: lName, role };
            localStorage.setItem('user', JSON.stringify(userData));
            
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setUser(userData);
            return res.data;
        } catch (error) {
            const message = error.response?.data?.message || "Registration failed. Please try again.";
            throw new Error(message);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
