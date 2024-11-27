import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { User, Lock, Phone } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

function CompleteRegistration() {

    const URL = `${import.meta.env.VITE_API_URL}/auth`;

    const [searchParams] = useSearchParams();
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const navigate = useNavigate();
    const email = searchParams.get('email');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await axios.post(`${URL}/complete-registration/${email}`, {
                name,
                password,
                phone,
            });
            toast.success('Registro completado exitosamente. Ahora puedes iniciar sesión.');
            navigate('/login');
        } catch (error) {
            console.error('Error al completar el registro:', error);
            toast.error('Ocurrió un error al completar el registro.');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-8">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-800">Completar registro</h2>
                    <p className="text-gray-600">Ingresa tu información para finalizar tu registro</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nombre completo
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                                placeholder="Ingresa tu nombre"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Teléfono (opcional)
                        </label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                                placeholder="Ingresa tu número de teléfono"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Contraseña
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                                placeholder="Crea una contraseña"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition duration-200"
                    >
                        Completar registro
                    </button>
                </form>
            </div>
        </div>
    );
}

export default CompleteRegistration;
