import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { useAuth } from '../context/AuthContext';

const data = [
  { name: 'Lun', posts: 4, engagement: 320 },
  { name: 'Mar', posts: 6, engagement: 480 },
  { name: 'Mié', posts: 8, engagement: 750 },
  { name: 'Jue', posts: 5, engagement: 420 },
  { name: 'Vie', posts: 7, engagement: 680 },
  { name: 'Sáb', posts: 3, engagement: 280 },
  { name: 'Dom', posts: 2, engagement: 190 },
];

function Statistics() {
  const { currentProfile } = useAuth();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">
          Analíticas - {currentProfile?.name}
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Rendimiento de Publicaciones</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="posts" fill="#000000" name="Publicaciones" />
                <Bar dataKey="engagement" fill="#666666" name="Interacción" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Tendencia de Interacción</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="engagement"
                  stroke="#000000"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-gray-500 text-sm">Total de Publicaciones</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">35</p>
          <span className="text-black text-sm">↑ 12% respecto a la semana pasada</span>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-gray-500 text-sm">Tasa de Interacción</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">4.8%</p>
          <span className="text-black text-sm">↑ 0.5% respecto a la semana pasada</span>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-gray-500 text-sm">Publicaciones Programadas</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">12</p>
          <span className="text-black text-sm">Próximos 7 días</span>
        </div>
      </div>
    </div>
  );
}

export default Statistics;
