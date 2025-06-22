// src/utils/location.js
import { useMapEvents } from 'react-leaflet';
import L from 'leaflet';


// Icono personalizado para reportes existentes
const iconoReporte = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30]
});

// Función para obtener el cantón y ciudad desde coordenadas usando Nominatim
export const obtenerDireccionDesdeCoordenadas = async (lat, lng) => {
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
    const data = await response.json();
    return {
      canton: data?.address?.county || 'Desconocido',
      ciudad: data?.address?.town || data?.address?.city || data?.address?.village || 'Desconocida'
    };
  } catch (error) {
    console.error('Error obteniendo la dirección:', error);
    return { canton: 'Desconocido', ciudad: 'Desconocida' };
  }
};

// Componente Leaflet que detecta clic en el mapa y actualiza ubicación + municipalidad + ciudad
export const LocationPickerConMunicipio = ({ setUbicacionActual, setMunicipalidad, setCiudad, tipoSeleccionado, reportes,inicio }) => {
  const map = useMapEvents({
    click: async (e) => {
      const lat = e.latlng.lat.toFixed(5);
      const lng = e.latlng.lng.toFixed(5);
      const coords = `${lat}, ${lng}`;
      setUbicacionActual(coords);

      const direccion = await obtenerDireccionDesdeCoordenadas(lat, lng);
      setMunicipalidad(`Municipalidad de ${direccion.canton}`);
      if (setCiudad) setCiudad(direccion.ciudad);
    },
  });

  // Mostrar todos los marcadores del mismo tipo de reporte
  if (reportes && tipoSeleccionado && !inicio) {
    // Limpiar marcadores existentes
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker && layer.options.icon === iconoReporte) {
        map.removeLayer(layer);
      }
    });
    reportes.forEach((r) => {
      if (r.tipo === tipoSeleccionado && r.ubicacion) {
        const [lat, lng] = r.ubicacion.split(',').map(Number);
        if (!isNaN(lat) && !isNaN(lng)) {
          const marker = L.marker([lat, lng], { icon: iconoReporte });
          let contenidoPopup = `<strong>${r.tipo}</strong><br>${r.descripcion}`;

          // Si hay imagen y es una URL válida o un objeto File
          if (r.archivo && typeof r.archivo === 'string') {
            contenidoPopup += `<br><img src="${r.archivo}" alt="imagen reporte" style="width:100%; border-radius:8px; margin-top:6px;" />`;
          } else if (r.archivo instanceof File) {
            const url = URL.createObjectURL(r.archivo);
            contenidoPopup += `<br><img src="${url}" alt="imagen reporte" style="width:100%; border-radius:8px; margin-top:6px;" />`;
          }

          marker.bindPopup(contenidoPopup);

          marker.addTo(map);
        }
      }
    });
  }

  return null;
};
