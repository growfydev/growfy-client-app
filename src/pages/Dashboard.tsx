import { useState } from 'react';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Calendar as CalendarIcon,
  BarChart2,
  LogOut,
  ChevronDown,
  Plus,
  UserPlus,
} from 'lucide-react';
import Statistics from '../components/Statistics';
import Calendar from '../components/Calendar';
import Modal from '../components/Modal';
import { useApi } from '../context/ApiContext';
import toast from 'react-hot-toast';

function Dashboard() {
  const { logout, currentProfile, switchProfile, profiles } = useAuth();
  const { createProfile, inviteUser } = useApi();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNewProfileOpen, setIsNewProfileOpen] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('TEAM_MEMBER');

  const roleDictionary: { [key: string]: string } = {
    TEAM_MEMBER: 'Miembro del equipo',
    ANALYST: 'Analista',
    EDITOR: 'Editor',
    MANAGER: 'Gerente',
    CONTENT_CREATOR: 'Creador de contenido',
    CLIENT: 'Cliente',
    GUEST: 'Invitado',
  };

  const handleLogout = () => {
    logout();
    toast.success('Sesión cerrada correctamente');
    navigate('/login');
  };

  const handleCreateProfile = async () => {
    if (!newProfileName) {
      toast.error('El nombre del perfil es obligatorio');
      return;
    };
    await createProfile(newProfileName);
    setNewProfileName('');
    setIsNewProfileOpen(false);
  };

  const handleInviteUser = async () => {
    if (!inviteEmail) {
      toast.error('La dirección de correo electrónico es obligatoria');
      return;
    };

    if (!currentProfile?.id) {
      toast.error('Debes seleccionar un perfil');
      return;
    }

    await inviteUser(inviteEmail, currentProfile?.id, inviteRole);
    setInviteEmail('');
    setInviteRole('TEAM_MEMBER');
    setIsInviteOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Barra lateral */}
      <div className="w-64 bg-white border-r border-gray-200">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-black mb-6">Growfy</h1>
          <div className="space-y-2">
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="w-full flex items-center justify-between px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <span className="font-medium text-black">{currentProfile?.name || 'Sin perfil'}</span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>

              {isProfileOpen && (
                <div className="absolute w-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  {profiles.map((profile: any) => (
                    <button
                      key={profile.id}
                      onClick={() => {
                        switchProfile(profile);
                        setIsProfileOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 text-black"
                    >
                      {profile.name || 'Perfil sin nombre'}
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      setIsNewProfileOpen(true);
                      setIsProfileOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 text-gray-600 flex items-center gap-2 border-t border-gray-200"
                  >
                    <Plus className="w-4 h-4" />
                    Crear nuevo perfil
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => setIsInviteOpen(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              Invitar miembro
            </button>
          </div>
        </div>

        <nav className="mt-6">
          <NavLink
            to="statistics"
            className={({ isActive }) =>
              `flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 ${isActive ? 'bg-gray-100 text-black' : ''}`
            }
          >
            <BarChart2 className="w-5 h-5 mr-3" />
            Estadísticas
          </NavLink>
          <NavLink
            to="calendar"
            className={({ isActive }) =>
              `flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 ${isActive ? 'bg-gray-100 text-black' : ''}`
            }
          >
            <CalendarIcon className="w-5 h-5 mr-3" />
            Calendario
          </NavLink>
        </nav>

        <div className="absolute bottom-0 w-64 p-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Cerrar sesión
          </button>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <Routes>
            <Route path="/" element={<Statistics />} />
            <Route path="statistics" element={<Statistics />} />
            <Route path="calendar" element={<Calendar />} />
          </Routes>
        </div>
      </div>

      {/* Modal para nuevo perfil */}
      <Modal
        isOpen={isNewProfileOpen}
        onClose={() => setIsNewProfileOpen(false)}
        title="Crear nuevo perfil"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del perfil
            </label>
            <input
              type="text"
              value={newProfileName}
              onChange={(e) => setNewProfileName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
              placeholder="Introduce el nombre del perfil"
            />
          </div>
          <button
            onClick={handleCreateProfile}
            className="w-full bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Crear perfil
          </button>
        </div>
      </Modal>

      {/* Modal para invitar a un usuario */}
      <Modal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        title="Invitar a un miembro del equipo"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dirección de correo electrónico
            </label>
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
              placeholder="Introduce la dirección de correo electrónico"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rol
            </label>
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black appearance-none bg-white"
            >
              {Object.entries(roleDictionary).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handleInviteUser}
            className="w-full bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Enviar invitación
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default Dashboard;
