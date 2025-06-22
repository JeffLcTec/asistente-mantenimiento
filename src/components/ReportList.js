import React, { useState } from 'react';
import './ReportList.css'; // Importa el archivo de estilo

const ReportList = ({ reportes, onStatusChange, cantones }) => {
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
              <select
                value={r.estado}
                onChange={(e) => onStatusChange(r.id, e.target.value)}
                className="filtros select"
              >
                <option>Recibido</option>
                <option>En Proceso</option>
                <option>Resuelto</option>
              </select>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ReportList;
