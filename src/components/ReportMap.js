// src/components/ReportMap.js
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './ReportList.css'; // Importa el archivo de estilo


const esMovil = /Mobi|Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(navigator.userAgent);


// Función para crear íconos personalizados por urgencia
const createCustomIcon = (color) => {
  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

// Íconos predefinidos por urgencia
const urgencyIcons = {
  'Alta': createCustomIcon('red'),
  'Media': createCustomIcon('orange'),
  'Baja': createCustomIcon('yellow'),
};

const iconoPersona = new L.Icon({
  iconUrl: '/Personita.png',
  iconSize: [60, 70],
  iconAnchor: [16, 32],
  popupAnchor: [13, -31],
});
const LocationSelector = ({ setUbicacion }) => {
  useMapEvents({
    click(e) {
      const coords = `${e.latlng.lat.toFixed(5)}, ${e.latlng.lng.toFixed(5)}`;
      setUbicacion(coords);
    }
  });
  return null;
};

const ReportMap = ({ reportes, marcadorTemporal, setUbicacion }) => {
  const [posicionUsuario, setPosicionUsuario] = useState();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosicionUsuario([pos.coords.latitude, pos.coords.longitude]);
        },
        () => {
          console.warn('No se pudo obtener la ubicación del usuario.');
        }
      );
    }
  }, []);

  const posiciones = reportes
    .map(r => {
      const partes = r.ubicacion.split(',');
      const lat = parseFloat(partes[0]);
      const lng = parseFloat(partes[1]);
      if (!isNaN(lat) && !isNaN(lng)) {
        return { ...r, lat, lng };
      }
      return null;
    })
    .filter(r => r);

return (
    <div className="statistics-panel">
      <h2 className="titulo">Mapa de Reportes</h2>
        <div className="contenedor-prioridades">
          <p><strong className="alta">Alta</strong></p>
          <p><strong className="media">Media</strong></p>
          <p><strong className="baja">Baja</strong></p>
        </div>

      {posicionUsuario ? (
        <MapContainer
          center={posicionUsuario}
          zoom={15}
          style={{
            height: esMovil ? '400px' : '500px',
            width: '100%',
            borderRadius: '10px',
            display: 'block',
            maxWidth: '100%',
            margin: '0 auto'
          }}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {setUbicacion && <LocationSelector setUbicacion={setUbicacion} />}

          <Marker position={posicionUsuario} icon={iconoPersona}>
            <Popup>Estás aquí</Popup>
          </Marker>

          {posiciones.map((r) => (
            <Marker 
              key={r.id} 
              position={[r.lat, r.lng]} 
              icon={urgencyIcons[r.urgencia] || urgencyIcons.default}
            >
              <Popup>
                <div className="space-y-1">
                  <div className={`font-bold`} style={{ color: getUrgencyColor(r.urgencia) }}>
                    {r.tipo} ({r.urgencia})
                  </div>
                  <div style={{ fontSize: '14px' }}>{r.descripcion}</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>
                    {new Date(r.fecha).toLocaleDateString()}
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: '500', color: r.estado === 'Resuelto' ? '#38a169' : '#d97706' }}>
                    {r.estado}
                  </div>

                  {r.archivo && (
                    <div style={{ marginTop: '8px' }}>
                      <img src={r.archivo} alt="Evidencia" style={{ width: '100%', maxWidth: '250px', borderRadius: '6px' }} />
                    </div>
                  )}
                </div>
              </Popup>

            </Marker>
          ))}

          {marcadorTemporal && (
            <Marker position={marcadorTemporal} icon={urgencyIcons.default}>
              <Popup>Ubicación seleccionada</Popup>
            </Marker>
          )}
        </MapContainer>
      ) : (
        <p className="text-center text-gray-500">Obteniendo ubicación del usuario...</p>
      )}
    </div>
  );
};

// Función auxiliar para colores de texto según urgencia
const getUrgencyColor = (urgencia) => {
  switch(urgencia) {
    case 'Alta': return 'red';
    case 'Media': return 'orange';
    case 'Baja': return 'yellow';
  }
};

export default ReportMap;


// src/App.js (sin cambios necesarios aquí)
