import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "token";
export const API_URL = "https://reqres.in";
const AuthContext = createContext({});

export const useAuth = () => {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    token: null,
    authenticated: null,
  });

  const register = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/api/register`, {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/api/login`, {
        email,
        password,
      });
      const  token  = response.data.token;
      setAuthState({ token, authenticated: true });
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      await SecureStore.setItemAsync(TOKEN_KEY, token);
      return response.data;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  const logout = async () => {
    try {
      setAuthState({ token: null, authenticated: false });
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  useEffect(() => {
    const loadToken = async () => {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      if (token) {
        setAuthState({ token, authenticated: true });
      }
      console.log(token);
    };
    loadToken();
  }, []);

  const value = {
    authState,
    onRegister: register,
    onLogin: login,
    onLogout: logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
