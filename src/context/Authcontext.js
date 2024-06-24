import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "token";
export const API_URL = "https://playbuddy-3198da0e5cb7.herokuapp.com";
const AuthContext = createContext({});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    token: null,
    authenticated: null,
    username: null,
    user_id: null,
    email: null,
    profile_picture: null,
  });

  const register = async (username, email, password, bio, location, games, platforms, skill_level, profile_picture) => {
    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('bio', bio);
      formData.append('location', location);
      formData.append('games', games);
      formData.append('platforms', platforms);
      formData.append('skill_level', skill_level);

      if (profile_picture) {
        formData.append('profile_picture', {
          uri: profile_picture.uri,
          type: profile_picture.type,
          name: profile_picture.name,
        });
      } else {
        console.error('Profile picture is missing'); 
      }

      formData._parts.forEach(part => console.log(`${part[0]}: ${part[1]}`));

      const response = await axios.post(`${API_URL}/api/register`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
        },
      });

      console.log('Registration Response:', response.data); // Log the response for debugging
      return response.data;
    } catch (error) {
      handleError(error);
      return Promise.reject(error);
    }
  };

  const login = async (usernameOrEmail, password) => {
    try {
      console.log('Login:', { usernameOrEmail, password });

      const formData = new FormData();
      formData.append('usernameOrEmail', usernameOrEmail);
      formData.append('password', password);

      const response = await axios.post(`${API_URL}/api/login`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.headers['content-type'].includes('application/json')) {
        console.log(response.data);
        const { token, username, user_id, email, profile_picture } = response.data;

        setAuthState({
          token,
          authenticated: true,
          username,
          user_id,
          email,
          profile_picture,
        });
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        await SecureStore.setItemAsync(TOKEN_KEY, token);
        await SecureStore.setItemAsync('username', username);
        await SecureStore.setItemAsync('user_id', user_id.toString());
        await SecureStore.setItemAsync('email', email);
        await SecureStore.setItemAsync('profile_picture', profile_picture);

        return response.data;
      } else {
        throw new Error('Unexpected response format');
      }
    } catch (error) {
      handleError(error);
      return Promise.reject(error);
    }
  };

  const logout = async () => {
    try {
      // Clear the authentication state
      setAuthState({
        token: null,
        authenticated: false,
        username: null,
        user_id: null,
        email: null,
        profile_picture: null,
      });
      delete axios.defaults.headers.common['Authorization'];

      // Remove token and other user data from secure storage
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await SecureStore.deleteItemAsync('username');
      await SecureStore.deleteItemAsync('user_id');
      await SecureStore.deleteItemAsync('email');
      await SecureStore.deleteItemAsync('profile_picture');
    } catch (error) {
      console.error('Logout Error:', error.message);
      return Promise.reject(error);
    }
  };

  useEffect(() => {
    const loadToken = async () => {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const username = await SecureStore.getItemAsync('username');
        const user_id = await SecureStore.getItemAsync('user_id');
        const email = await SecureStore.getItemAsync('email');
        const profile_picture = await SecureStore.getItemAsync('profile_picture');
        setAuthState({
          token,
          authenticated: true,
          username,
          user_id: parseInt(user_id, 10),
          email,
          profile_picture,
        });
      }
    };
    loadToken();
  }, []);

  const handleError = (error) => {
    if (error.response) {
      console.error('Server Error:', error.response.data);
    } else if (error.request) {
      console.error('Network Error:', error.request);
    } else {
      console.error('Error:', error.message);
    }
  };

  const value = {
    authState,
    setAuthState, // Provide setAuthState in the context value
    onRegister: register,
    onLogin: login,
    onLogout: logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
