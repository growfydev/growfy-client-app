import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useAuth } from '../context/AuthContext';
import dayjs from 'dayjs';
import Modal from 'react-modal';
import { useApi } from '../context/ApiContext';
import toast from 'react-hot-toast';

Modal.setAppElement('#root');

function Calendario() {
  const { currentProfile } = useAuth();
  const { postsCurrentProfile, getAllPostProfile, createPost } = useApi();

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [formData, setFormData] = useState<any>({
    provider: '',
    typePost: '',
    content: {},
    unix: ''
  });
  const [events, setEvents] = useState([]);
  const [eventDetails, setEventDetails] = useState<any>(null);
  const [modalEventIsOpen, setModalEventIsOpen] = useState(false);

  // Colores por proveedor
  const providerColors: Record<string, string> = {
    FACEBOOK: '#1877F2',
    INSTAGRAM: '#E1306C',
    TWITTER: '#1DA1F2',
    PINTEREST: '#BD081C',
  };

  const providerMap: Record<string, number> = {
    FACEBOOK: 1,
    INSTAGRAM: 2,
    TWITTER: 3,
    PINTEREST: 4,
  };

  const typePostMap: Record<string, number> = {
    text: 1,
    image: 2,
    message: 3,
  };

  useEffect(() => {
    if (currentProfile?.id) {
      getAllPostProfile(currentProfile.id);
    }
  }, [currentProfile]);

  useEffect(() => {
    if (postsCurrentProfile?.length) {
      const mappedEvents = postsCurrentProfile.map((post: any) => {
        const providerName = post.ProviderPostType.provider.name.toUpperCase();
        const typePost = post.ProviderPostType.posttype.name;

        let title = 'Sin título';
        if (typePost === 'message') {
          title = post.fields.message || 'Mensaje sin contenido';
        } else if (typePost === 'image') {
          title = post.fields.caption || 'Imagen sin descripción';
        } else if (typePost === 'text') {
          title = post.fields.title || 'Texto sin título';
        }

        return {
          id: post.id,
          title,
          date: dayjs.unix(post.task.unix).format('YYYY-MM-DDTHH:mm:ss'),
          backgroundColor: providerColors[providerName] || '#CCCCCC',
          extendedProps: { ...post },
        };
      });
      setEvents(mappedEvents);
    } else {
      setEvents([])
    }
  }, [postsCurrentProfile]);

  const manejarClicEvento = (arg: any) => {
    setEventDetails(arg.event.extendedProps);
    setModalEventIsOpen(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name.startsWith('content.')) {
      const contentKey = name.split('.')[1];
      setFormData((prev: any) => ({
        ...prev,
        content: { ...prev.content, [contentKey]: value },
      }));
    } else {
      setFormData((prev: any) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const providerId = providerMap[formData.provider];
    const typePostId = typePostMap[formData.typePost];
    const unixTimestamp = formData.unix ? dayjs(formData.unix).unix() : null;

    if (!providerId || !typePostId) {
      toast.error('Proveedor o Tipo de Publicación no válido.');
      return;
    }

    try {
      await createPost(currentProfile.id, {
        content: formData.content,
        provider: providerId,
        typePost: typePostId,
        unix: unixTimestamp,
      });
      setModalIsOpen(false);
      setFormData({
        provider: '',
        typePost: '',
        content: {},
        unix: undefined,
      });
      getAllPostProfile(currentProfile.id);
    } catch (error) {
      console.error('Error creando publicación:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">
          Calendario - {currentProfile?.name}
        </h1>
        <button
          onClick={() => setModalIsOpen(true)}
          className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition duration-200"
        >
          Programar Publicación
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        {modalIsOpen || modalEventIsOpen ? null : (
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={events}
            eventClick={manejarClicEvento}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,dayGridWeek,dayGridDay',
            }}
            height="auto"
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
          />
        )}
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto"
        overlayClassName="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      >
        <h2 className="text-xl font-bold mb-4">Crear Publicación</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Proveedor</label>
            <select
              name="provider"
              value={formData.provider}
              onChange={handleFormChange}
              className="w-full border px-4 py-2 rounded-lg"
              required
            >
              <option value="">Seleccionar</option>
              <option value="INSTAGRAM">Instagram</option>
              <option value="FACEBOOK">Facebook</option>
              <option value="TWITTER">Twitter</option>
              <option value="LINKEDIN">LinkedIn</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Tipo de Publicación</label>
            <select
              name="typePost"
              value={formData.typePost}
              onChange={handleFormChange}
              className="w-full border px-4 py-2 rounded-lg"
              required
            >
              <option value="">Seleccionar</option>
              <option value="image">Imagen</option>
              <option value="message">Mensaje</option>
              <option value="text">Texto</option>
            </select>
          </div>

          {formData.typePost === 'image' && (
            <>
              <div className="mb-4">
                <label className="block text-gray-700">URL de Imagen</label>
                <input
                  type="text"
                  name="content.imgUrl"
                  onChange={handleFormChange}
                  value={formData.content.imgUrl || ''}
                  className="w-full border px-4 py-2 rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Descripción</label>
                <input
                  type="text"
                  name="content.caption"
                  onChange={handleFormChange}
                  value={formData.content.caption || ''}
                  className="w-full border px-4 py-2 rounded-lg"
                />
              </div>
            </>
          )}

          {formData.typePost === 'message' && (
            <div className="mb-4">
              <label className="block text-gray-700">Mensaje</label>
              <textarea
                name="content.message"
                onChange={handleFormChange}
                value={formData.content.message || ''}
                className="w-full border px-4 py-2 rounded-lg"
                required
              />
            </div>
          )}

          {formData.typePost === 'text' && (
            <>
              <div className="mb-4">
                <label className="block text-gray-700">Título</label>
                <input
                  type="text"
                  name="content.title"
                  onChange={handleFormChange}
                  value={formData.content.title || ''}
                  className="w-full border px-4 py-2 rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Contenido</label>
                <textarea
                  name="content.content"
                  onChange={handleFormChange}
                  value={formData.content.content || ''}
                  className="w-full border px-4 py-2 rounded-lg"
                  required
                />
              </div>
            </>
          )}

          <input
            className='w-full border px-4 py-2 rounded-lg mb-5'
            type="datetime-local"
            name="unix"
            value={formData.unix || ''}
            onChange={handleFormChange}
          />

          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Guardar
          </button>
        </form>
      </Modal>

      {/* Modal para detalles del evento */}
      <Modal
        isOpen={modalEventIsOpen}
        onRequestClose={() => setModalEventIsOpen(false)}
        className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto z-50 relative"
        overlayClassName="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      >
        {eventDetails ? (
          <div>
            <h2 className="text-xl font-bold mb-4">Detalles del Evento</h2>
            <p>
              <strong>Proveedor:</strong> {eventDetails.ProviderPostType.provider.name}
            </p>
            <p>
              <strong>Tipo de Publicación:</strong>{' '}
              {eventDetails.ProviderPostType.posttype.name}
            </p>
            {eventDetails.ProviderPostType.posttype.name === 'image' && (
              <>
                <p>
                  <strong>Imagen:</strong>{' '}
                  <a
                    href={eventDetails.fields.imgUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    Ver Imagen
                  </a>
                </p>
                <p>
                  <strong>Descripción:</strong> {eventDetails.fields.caption}
                </p>
              </>
            )}
            {eventDetails.ProviderPostType.posttype.name === 'message' && (
              <p>
                <strong>Mensaje:</strong> {eventDetails.fields.message}
              </p>
            )}
            {eventDetails.ProviderPostType.posttype.name === 'text' && (
              <>
                <p>
                  <strong>Título:</strong> {eventDetails.fields.title}
                </p>
                <p>
                  <strong>Contenido:</strong> {eventDetails.fields.content}
                </p>
              </>
            )}
          </div>
        ) : (
          <p>Cargando datos...</p>
        )}
      </Modal>
    </div>
  );
}

export default Calendario;
