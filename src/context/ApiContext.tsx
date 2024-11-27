import { createContext, useContext, useState, ReactNode } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const URL_API = `${import.meta.env.VITE_API_URL}`;

interface ApiContextProps {
    createProfile: (name: string) => Promise<void>;
    inviteUser: (email: string, profileId: number, role: string) => Promise<void>;
    getAllPostProfile: (profileId: string) => Promise<void>;
    loading: boolean;
    postsCurrentProfile: any;
    createPost: (profileId: string, postData: any) => Promise<void>;
}

const ApiContext = createContext<ApiContextProps | null>(null);

export const ApiProvider = ({ children }: { children: ReactNode }) => {
    const { setProfiles, profiles } = useAuth();
    const [loading, setLoading] = useState(false);
    const [postsCurrentProfile, setPostsCurrentProfile] = useState([]);

    // Crear perfil
    const createProfile = async (name: string) => {
        const accessToken = localStorage.getItem('accessToken');

        setLoading(true);
        try {
            const response = await axios.post(`${URL_API}/profiles`, { name },
                {
                    headers: { Authorization: `Bearer ${accessToken}` },
                }
            );
            const newProfile = response.data.data.profile;

            setProfiles([...profiles, newProfile]);

            toast.success('Perfil creado correctamente');
        } catch (error) {
            toast.error('Error creando perfil');
            console.error('Error creando perfil:', error);
        } finally {
            setLoading(false);
        }
    };

    // Invitar usuario
    const inviteUser = async (email: string, profileId: number, role: string) => {
        const accessToken = localStorage.getItem('accessToken');
        setLoading(true);
        try {
            await axios.post(`${URL_API}/profiles/${profileId}/invite`, { email, role }, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            toast.success('Usuario invitado correctamente');
        } catch (error) {
            toast.error('Error invitando usuario');
            console.error('Error invitando usuario:', error);
        } finally {
            setLoading(false);
        }
    };

    //Obtener los posts de un perfil
    const getAllPostProfile = async (profileId: string) => {
        const accessToken = localStorage.getItem('accessToken');
        try {
            await axios.get(`${URL_API}/posts/${profileId}/posts`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            }).then((res) => {
                setPostsCurrentProfile(res.data.data.posts)
            }).catch((err) => {
                console.error(err);
            });
        } catch (error) {
            toast.error('Error al obtener publicaciones');
            console.error('Error invitando usuario:', error);
        }
    }

    const createPost = async (profileId: string, postData: any) => {
        const accessToken = localStorage.getItem('accessToken');
        setLoading(true);
        try {
            await axios.post(`${URL_API}/posts/${profileId}/create`, postData, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            toast.success('Publicación creada correctamente');
        } catch (error) {
            toast.error('Error al crear publicación');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };


    return (
        <ApiContext.Provider value={{ createProfile, inviteUser, getAllPostProfile, loading, postsCurrentProfile, createPost }}>
            {children}
        </ApiContext.Provider>
    );
};

export const useApi = () => {
    const context = useContext(ApiContext);
    if (!context) throw new Error('useApi debe ser usado dentro de un ApiProvider');
    return context;
};
