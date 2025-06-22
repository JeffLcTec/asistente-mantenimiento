import React, { useState } from 'react';
import Modal from 'react-modal';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './CommentPanel.css'; // Importa el archivo de estilo

const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const CommentPanel = ({ reportes, comentarios, onAddComment }) => {
  const [texto, setTexto] = useState('');
  const [respuesta, setRespuesta] = useState('');
  const [reporteActivo, setReporteActivo] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [ubicacionMapa, setUbicacionMapa] = useState(null);
  const [comentarioActivo, setComentarioActivo] = useState(null); // Para manejar el comentario al que se va a responder
  const [verRespuestas, setVerRespuestas] = useState({}); // Maneja la visibilidad de respuestas por comentario

  // Estados para los filtros
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroUbicacion, setFiltroUbicacion] = useState('');
  
  // Obtener tipos únicos para el dropdown
  const tiposUnicos = [...new Set(reportes.map(r => r.tipo))];
  
  // Obtener ubicaciones únicas para el dropdown
  const ubicacionesUnicas = [...new Set(reportes.map(r => r.ciudad))];

  // Función para filtrar los reportes
  const reportesFiltrados = reportes.filter(reporte => {
    const cumpleTipo = !filtroTipo || reporte.tipo === filtroTipo;
    const cumpleUbicacion = !filtroUbicacion || reporte.ciudad === filtroUbicacion;
    return cumpleTipo && cumpleUbicacion;
  });

  const abrirMapa = (ubicacion) => {
    const partes = ubicacion.split(',').map(Number);
    if (partes.length === 2) {
      setUbicacionMapa(partes);
      setModalAbierto(true);
    }
  };

   const handleRespuesta = (comentarioId) => {
    if (respuesta.trim()) {
      onAddComment(reporteActivo, respuesta, true, comentarioId);
      setRespuesta('');
      setComentarioActivo(null);
    }
  };


  // Función para manejar la visibilidad de las respuestas
  const toggleRespuestas = (comentarioId) => {
    setVerRespuestas((prev) => ({
      ...prev,
      [comentarioId]: !prev[comentarioId],
    }));
  };
  const renderComentario = (comentario, nivel = 0) => {
    // Asegurarnos de que respuestas es un array
    const respuestas = Array.isArray(comentario.respuestas) ? comentario.respuestas : [];
    


    return (
      <li key={comentario.id} className="comment-item" style={{ marginLeft: `${nivel * 2}rem` }}>
        <div className="comment-content">
          <p><strong>{comentario.usuario}</strong>: {comentario.texto}</p>
          <p className="comment-date">{comentario.fecha}</p>
          <div className="comment-actions">
            <button
              onClick={() => setComentarioActivo(comentario.id)}
              className="reply-button"
            >
              Responder
            </button>
            {respuestas.length > 0 && (
              <button
                onClick={() => toggleRespuestas(comentario.id)}
                className="reply-button"
              >
                {verRespuestas[comentario.id] ? 
                  'Ocultar respuestas' : 
                  `Ver respuestas (${respuestas.length})`
                }
              </button>
            )}
          </div>
  {/* Formulario para responder a ESTE comentario específico */}
        {comentarioActivo === comentario.id && (
          <div className="reply-form" style={{ marginLeft: '1rem' }}>
            <input
              type="text"
              placeholder="Escribe tu respuesta..."
              value={respuesta}
              onChange={(e) => setRespuesta(e.target.value)}
              className="input-comment"
            />
            <button
              onClick={() => {
                if (respuesta.trim()) {
                  onAddComment(reporteActivo, respuesta, true, comentario.id);
                  setRespuesta('');
                  setComentarioActivo(null);
                }
              }}
              className="button-blue"
            >
              Enviar Respuesta
            </button>
          </div>
        )}
      </div>
      
      {/* Mostrar respuestas si están expandidas */}
      {verRespuestas[comentario.id] && respuestas.length > 0 && (
        <ul className="reply-list">
          {respuestas.map(resp => renderComentario(resp, nivel + 1))}
        </ul>
      )}
    </li>
  );
};
    return (
    <div className="statistics-panel">
      <h2 className="titulo">Comentarios por Reporte</h2>

    {/* Controles de Filtrado */}
    <div className="filtros ">
          <select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Todos los tipos</option>
            {tiposUnicos.map(tipo => (
              <option key={tipo} value={tipo}>{tipo}</option>
            ))}
          </select>
     
          <select
            value={filtroUbicacion}
            onChange={(e) => setFiltroUbicacion(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Todas las ubicaciones</option>
            {ubicacionesUnicas.map(ciudad => (
              <option key={ciudad} value={ciudad}>{ciudad}</option>
            ))}
          </select>
      
      
      {/* Botón para limpiar filtros */}
      {(filtroTipo || filtroUbicacion) && (
        <button
          onClick={() => {
            setFiltroTipo('');
            setFiltroUbicacion('');
          }}
          className="limpia-filtros"
        >
          Limpiar Filtros
        </button>
      )}
    </div>
    
    {/* Lista de Reportes (ahora usando reportesFiltrados) */}
    <div className="flex flex-col gap-2">
      {reportesFiltrados.map((r) => {
          // Asegurarnos de que siempre tenemos un array de comentarios
          const comentariosDelReporte = comentarios[r.id] || [];
          
          return (
            <div key={r.id} className="comment-container">
              <div className="comment-header">
                <span className="font-bold text-lg">{r.tipo} en {r.ciudad}</span>
                <div className="flex gap-2">
                  <button onClick={() => abrirMapa(r.ubicacion)} className="button-blue">
                    Ver ubicación
                  </button>
                  <button
                    onClick={() => setReporteActivo(reporteActivo === r.id ? null : r.id)}
                    className="button-blue"
                  >
                    {reporteActivo === r.id ? 'Ocultar comentarios' : 'Ver comentarios'}
                  </button>
                </div>
              </div>
              
              {reporteActivo === r.id && (
                <div className="mt-2">
                  {/* Lista de comentarios principales */}
                  <ul className="mb-2 list-disc pl-4">
                    {comentariosDelReporte.map(comentario => renderComentario(comentario, 0))}
                  </ul>
                  
                  {/* Formulario para nuevo comentario principal */}
                  <div className="flex gap-2 mt-2">
                    <input
                      type="text"
                      placeholder="Escribe un comentario..."
                      value={texto}
                      onChange={(e) => setTexto(e.target.value)}
                      className="input-comment"
                    />
                    <button
                      onClick={() => {
                        if (texto.trim()) {
                          onAddComment(r.id, texto);
                          setTexto('');
                        }
                      }}
                      className="button-blue"
                    >
                      Añadir Comentario
                    </button>
                  </div>
                      
                </div>
              )}
            </div>
          );
        })}
      </div>

      

      {/* MODAL DE MAPA */}
      <Modal
        isOpen={modalAbierto}
        onRequestClose={() => setModalAbierto(false)}
        contentLabel="Ubicación del Reporte"
        className="bg-white p-4 rounded shadow-lg max-w-2xl mx-auto mt-20"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        {ubicacionMapa && (
          <MapContainer
            center={ubicacionMapa}
            zoom={16}
            style={{
              height: '600px',
              width: '600px',
              margin: '0 auto',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 0 10px rgba(0,0,0,0.2)'
            }}
          >
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={ubicacionMapa} icon={markerIcon}>
              <Popup>Ubicación del reporte</Popup>
            </Marker>
          </MapContainer>
        )}
        <div className="text-right mt-4">
          <button
            onClick={() => setModalAbierto(false)}
            className="button-blue"
          >
            Cerrar
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default CommentPanel;