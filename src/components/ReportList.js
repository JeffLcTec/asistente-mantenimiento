import React, { useState } from 'react';
import './ReportList.css'; // Importa el archivo de estilo

const ReportList = ({ reportes, onStatusChange, cantones, onUrgencyChange, onImageUpload }) => {
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroCanton, setFiltroCanton] = useState('');
  const [estadoSeleccionado, setEstadoSeleccionado] = useState('');

  const estados = ['Recibido', 'En Proceso', 'Resuelto'];
   const reportesFiltrados = reportes.filter(r => {
    const zonaOk = filtroCanton === '' || r.asignadoA === filtroCanton;
    const tipoOk = filtroTipo === '' || r.tipo === filtroTipo;
    const estadoOk = estadoSeleccionado === '' || r.estado === estadoSeleccionado;
    return zonaOk && tipoOk && estadoOk;
  });

const [selectedImages, setSelectedImages] = useState({});
const handleImageChange = (reportId, e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        setSelectedImages(prev => ({
          ...prev,
          [reportId]: event.target.result
        }));
        
        // Si tienes una función para manejar la subida al backend
        if (onImageUpload) {
          onImageUpload(reportId, file);
        }
      };
      
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (reportId) => {
    setSelectedImages(prev => {
      const newState = {...prev};
      delete newState[reportId];
      return newState;
    });
  };


  return (
    <div className="statistics-panel">
      <h2 className="titulo">Reportes Existentes</h2>

      <div className="filtros">
        <select value={filtroCanton} onChange={(e) => setFiltroCanton(e.target.value)}>
          <option value="">Todos los cantones</option>
          {cantones.map((canton, i) => <option key={i} value={canton}>{canton}</option>)}
        </select>

        <select value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)}>

         <option value="">Todos los tipos</option>
          <option>Bache</option>
          <option>Semáforo</option>
          <option>Aceras</option>
          <option>Señal de Tránsito</option>
          <option>Desagüe</option>
          <option>Pintura Vial</option>
        </select>

        <select value={estadoSeleccionado} onChange={(e) => setEstadoSeleccionado(e.target.value)}>
          <option value="">Todos los estados</option>
          {estados.map((est, i) => <option key={i} value={est}>{est}</option>)}
        </select>

              {/* Botón para limpiar filtros */}
      {(filtroTipo || filtroCanton || estadoSeleccionado) && (
        <button
          onClick={() => {
            setFiltroTipo('');
            setFiltroCanton('');
            setEstadoSeleccionado('');
          }}
          className="limpia-filtros"
        >
          Limpiar Filtros
        </button>
      )}
      </div>

      

      {reportesFiltrados.length === 0 ? (
        <p className="no-reportes">No hay reportes para esos filtros.</p>
      ) : (
        <ul className="report-list">
          {reportesFiltrados.map((r) => (
            <li key={r.id} className="comment-container">
              <p><strong>Urgencia</strong> {r.urgencia}</p>
              <p><strong>Tipo</strong> {r.tipo}</p>
              <p><strong>Descripción</strong> {r.descripcion}</p>
              <p><strong>Ubicación</strong> {r.ciudad}</p>
              <p><strong>Asignado a</strong> {r.asignadoA || 'No asignado'}</p>
              <p><strong>Estado</strong> {r.estado}</p>
              <p><strong>Fecha</strong> {new Date(r.fecha).toLocaleString()}</p>

               <div className="select-row">  {/* Nuevo contenedor */}
                 <div className="select-group">
                   <p><strong>Estado</strong></p>
                 
              <select
                value={r.estado}
                onChange={(e) => onStatusChange(r.id, e.target.value)}
                className="filtros select"
              >
                <option>Recibido</option>
                <option>En Proceso</option>
                <option>Resuelto</option>
              </select>
            </div>

             <div className="select-group">
              <p><strong>Urgencia</strong></p>
                <select
                  value={r.urgencia}
                  onChange={(e) => onUrgencyChange(r.id, e.target.value)}
                  className="filtros select"
                >
                  <option>Baja</option>
                  <option>Media</option>
                  <option>Alta</option>
                </select>
                  </div>     

          <div className="image-section">
            <div className="image-preview">
              {selectedImages[r.id] ? (
                <>
                  <img 
                    src={selectedImages[r.id]} 
                    alt="Preview" 
                    className="report-image"
                  />
                  <button 
                    onClick={() => removeImage(r.id)}
                    className="remove-image-btn"
                  >
                    ×
                  </button>
                </>
              ) : r.imagenUrl ? (
                <img 
                  src={r.imagenUrl} 
                  alt="Reporte" 
                  className="report-image"
                />
              ) : (
                <p>No hay imagen</p>
              )}
            </div>
            
            <label className="image-upload-btn">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(r.id, e)}
                style={{ display: 'none' }}
              />
              {selectedImages[r.id] || r.imagenUrl ? 'Cambiar imagen' : 'Agregar imagen'}
            </label>
          </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ReportList;
