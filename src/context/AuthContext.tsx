import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const URL = `${import.meta.env.VITE_API_URL}/auth`;

interface AuthContextType {
  user: any;
  isAuthenticated: boolean;
  currentProfile: any;
  login: (email: string, password: string) => void;
  logout: () => void;
  switchProfile: (profile: string) => void;
  register: (data: RegisterData) => Promise<void>;
  profiles: any;
  setProfiles: React.Dispatch<React.SetStateAction<any>>;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  nameProfile?: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentProfile, setCurrentProfile] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    if (accessToken && refreshToken) {
      axios
        .get(URL + '/me', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => {
          setUser(res.data.data.user);
          setCurrentProfile(res.data.data.user?.members[0]?.profile);
          setIsAuthenticated(true);
          setProfiles(res.data.data.user.members.map((member: any) => member.profile));
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await axios.post(URL + '/login', { email, password });
      const { accessToken, refreshToken } = res.data.data;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      const userRes = await axios.get(URL + '/me', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      setUser(userRes.data.data.user);
      setCurrentProfile(userRes.data.data.user?.members[0]?.profile);
      setProfiles(userRes.data.data.user.members.map((member: any) => member.profile));

      setIsAuthenticated(true);
      toast.success('Inicio de sesión exitoso');
    } catch (err) {
      console.error(err);
      toast.error('Error al iniciar sesión');
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setIsAuthenticated(false);
    setCurrentProfile(null);
    setUser(null);
  };

  const register = async (data: RegisterData) => {
    try {
      await axios.post(URL + '/register', data);
      toast.success('Usuario registrado exitosamente. Por favor inicia sesión.');
    } catch (err) {
      console.error(err);
      toast.error('Error al registrar usuario');
    }
  };

  const switchProfile = (profile: any) => {
    setCurrentProfile(profile);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        currentProfile,
        login,
        logout,
        switchProfile,
        register,
        user,
        profiles,
        setProfiles,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
