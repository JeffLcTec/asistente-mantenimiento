// src/App.js
import React, { useState, useEffect } from 'react';
import ReportForm from './components/ReportForm';
import ReportList from './components/ReportList';
import ReportMap from './components/ReportMap';
import StatisticsPanel from './components/StatisticsPanel';
import CommentPanel from './components/CommentPanel';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css'; // Asegurate de importar tu CSS

const App = () => {
  const [seccionActiva, setSeccionActiva] = useState('formulario');

  const [reportes, setReportes] = useState(() => {
    const almacenados = localStorage.getItem('reportes');
    return almacenados ? JSON.parse(almacenados) : [];
  });
  const [ubicacionActual, setUbicacionActual] = useState('');
  
 const [comentarios, setComentarios] = useState(() => {
  const almacenados = localStorage.getItem('comentarios');
  try {
    const parsed = almacenados ? JSON.parse(almacenados) : {};
    // Asegurar que cada comentario tenga respuestas como array
    Object.keys(parsed).forEach(reporteId => {
      parsed[reporteId] = parsed[reporteId].map(comentario => ({
        ...comentario,
        respuestas: Array.isArray(comentario.respuestas) ? comentario.respuestas : []
      }));
    });
    return parsed;
  } catch (e) {
    return {};
  }
});

  const [cantones, setCantones] = useState([]);

  useEffect(() => {
    localStorage.setItem('reportes', JSON.stringify(reportes));
    
  }, [reportes]);

  useEffect(() => {
    localStorage.setItem('comentarios', JSON.stringify(comentarios));
  }, [comentarios]);

useEffect(() => {
  const cantonesDisponibles = [...new Set(reportes.map(r => r.asignadoA))];
  setCantones(cantonesDisponibles);
}, [reportes]);

  const handleNewReport = (nuevoReporte) => {
    setReportes([...reportes, nuevoReporte]);
  };


const handleUrgencyChange = (id, nuevaUrgencia) => {
  // Actualiza el estado o llama a tu API para cambiar la urgencia
  setReportes(reportes.map(reporte => 
    reporte.id === id ? {...reporte, urgencia: nuevaUrgencia} : reporte
  ));
  toast.info(`La urgencia del reporte ${id} fue actualizada a "${nuevaUrgencia}"`);
};

  const handleStatusChange = (id, nuevoEstado) => {
    const actualizados = reportes.map(r =>
      r.id === id ? { ...r, estado: nuevoEstado } : r
    );
    setReportes(actualizados);
    toast.info(`El estado del reporte ${id} fue actualizado a "${nuevoEstado}"`);
  };
const handleAddComment = (reporteId, texto, esRespuesta = false, comentarioPadreId = null) => {
  const nuevoComentario = {
    id: Date.now(),
    usuario: "Usuario",
    texto,
    fecha: new Date().toLocaleString(),
    respuestas: []
  };

  const agregarRespuestaRecursivo = (comentarios) => {
    return comentarios.map(comentario => {
      // Caso base: encontramos el comentario padre
      if (comentario.id === comentarioPadreId) {
        return {
          ...comentario,
          respuestas: [...comentario.respuestas, nuevoComentario]
        };
      }

      // Caso recursivo: buscar en las respuestas
      if (comentario.respuestas && comentario.respuestas.length > 0) {
        return {
          ...comentario,
          respuestas: agregarRespuestaRecursivo(comentario.respuestas)
        };
      }

      return comentario;
    });
  };


  setComentarios((prevComentarios) => {
    // Si es un comentario principal
    if (!esRespuesta) {
      return {
        ...prevComentarios,
        [reporteId]: [...(prevComentarios[reporteId] || []), nuevoComentario]
      };
    }
    
    // Respuesta a cualquier nivel
    return {
      ...prevComentarios,
      [reporteId]: agregarRespuestaRecursivo(prevComentarios[reporteId] || [])
    };
  });
};

  return (
    <div className="app-container">
      <h1 className="titulo">Asistente de Mantenimiento de Obra Pública</h1>

      <div className="menu">
        
        <button onClick={() => setSeccionActiva('formulario')}>Formulario</button>
        <button onClick={() => setSeccionActiva('lista')}>Lista</button>
        <button onClick={() => setSeccionActiva('mapa')}>Mapa</button>
        <button onClick={() => setSeccionActiva('estadisticas')}>Estadísticas</button>
        <button onClick={() => setSeccionActiva('comentarios')}>Comentarios</button>
      </div>

      <div className="contenido">
        {seccionActiva === 'formulario' && (
          <ReportForm
            onReportSubmit={handleNewReport}
            reportes={reportes}
            ubicacionActual={ubicacionActual}
            setUbicacionActual={setUbicacionActual}
          />
        )}
        {seccionActiva === 'lista' && (
          <ReportList reportes={reportes}
                      cantones={cantones}
                      onStatusChange={handleStatusChange}
                      onUrgencyChange={handleUrgencyChange}
                    />

        )}
        {seccionActiva === 'mapa' && (
          <ReportMap reportes={reportes} />
        )}
        {seccionActiva === 'estadisticas' && (
          <StatisticsPanel reportes={reportes} />
        )}
        {seccionActiva === 'comentarios' && (
          <CommentPanel
            reportes={reportes}
            comentarios={comentarios}
            onAddComment={handleAddComment}
          />
        )}
      </div>

      <ToastContainer position="bottom-right" autoClose={3000} />
      <button
  onClick={() => {
    localStorage.clear();
    window.location.reload(); // opcional: recarga para aplicar cambios
  }}
  className="bg-red-600 text-white px-4 py-2 rounded mt-4"
>
  Limpiar Datos
</button>

    </div>
  );
};

export default App;
