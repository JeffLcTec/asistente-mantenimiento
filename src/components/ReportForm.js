
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { LocationPickerConMunicipio } from '../utils/location';
import { calcularDistancia } from '../utils/geolib';
import { getUrgencyByType } from '../utils/UrgencyCalc';
import './ReportForm.css';
import { FaMicrophone, FaMicrophoneSlash, FaCamera } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';



const esMovil = /Mobi|Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(navigator.userAgent);


const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34]
});

const iconoPersona = new L.Icon({
  iconUrl: '/Personita.png',
  iconSize: [60, 70],
  iconAnchor: [16, 32],
  popupAnchor: [13, -31],
});


const subirImagenACloudinary = async (archivo) => {
  const data = new FormData();
  data.append('file', archivo);
  data.append('upload_preset', 'Prototipo Requi');

  const res = await fetch('https://api.cloudinary.com/v1_1/dxjy81fmj/image/upload', {
    method: 'POST',
    body: data
  });

  const json = await res.json();
  return json.secure_url; // esta es la URL que guardarías en tu objeto reporte
};


const ReportForm = ({ onReportSubmit, reportes, ubicacionActual, setUbicacionActual }) => {

  const [subiendoImagen, setSubiendoImagen] = useState(false);

  const [ciudad, setCiudad] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [tipo, setTipo] = useState('Bache');
  const [archivo, setArchivo] = useState(null);
  const [municipalidad, setMunicipalidad] = useState('');
  const [posicionUsuario, setPosicionUsuario] = useState();
  const [urgencia, setUrgencia] = useState('Media');
  const [grabando, setGrabando] = useState(false);

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.lang = 'es-ES';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  const iniciarGrabacion = () => {
    if (!grabando) {
      recognition.start();
      setGrabando(true);
      toast.info('🎙️ Grabando... hablá claramente');
    } else {
      recognition.stop();
      setGrabando(false);
    }
  };

  recognition.onresult = (event) => {
    const texto = event.results[0][0].transcript;
    setDescripcion(prev => prev ? prev + ' ' + texto : texto);
    toast.success('📝 Texto agregado');
    setGrabando(false);
  };

  recognition.onerror = (event) => {
    toast.error('❌ Error al reconocer voz: ' + event.error);
    setGrabando(false);
  };

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

  useEffect(() => {
    const autoUrgencia = getUrgencyByType(tipo);
    setUrgencia(autoUrgencia);
  }, [tipo]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!ubicacionActual) {
      toast.error('Debe seleccionar una ubicación en el mapa.');
      return;
    }
    const [latNueva, lngNueva] = ubicacionActual.split(',').map(Number);
    const similares = reportes.filter(r => {
      const [lat, lng] = r.ubicacion.split(',').map(Number);
      const mismaCategoria = r.tipo === tipo;
      const distancia = calcularDistancia(latNueva, lngNueva, lat, lng);
      const noCerrado = r.estado !== 'Cerrado';
      return mismaCategoria && distancia < 200 && noCerrado;
    });
    if (similares.length > 0 && !window.confirm(`Hay ${similares.length} reportes similares cerca. ¿Desea continuar?`)) return;

    const nuevoReporte = {
      respuestas: [],
      id: Date.now(),
      descripcion,
      tipo,
      urgencia: urgencia || 'Media',
      ubicacion: ubicacionActual,
      ciudad: ciudad || 'Desconocida',
      archivo,
      asignadoA: municipalidad || 'No asignado',
      estado: 'Recibido',
      fecha: new Date().toISOString()
    };

    onReportSubmit(nuevoReporte);
    toast.success('Reporte enviado correctamente.');
    setDescripcion('');
    setTipo('Bache');
    setArchivo(null);
    setUbicacionActual('');
    setCiudad('');
    setMunicipalidad('');
  };

    return (
        <div className="report-grid-container">
          {!posicionUsuario ? (
            <>
              <div className="spinner" style={{ marginTop: '10px' }}>

              </div>
            </>
          ) : (
            <AnimatePresence mode= "wait">
              {!ubicacionActual ? (
            <motion.div
              key="solo-mapa"
              initial={{ width: '100%' }}
              animate={{ width: '100%' }}
              exit={{ width: '60%' }}
              transition={{ duration: 0.2 }}
              className="mapa-transicion"
            >

            <MapContainer
              center={posicionUsuario}
              zoom={18}
              style={{
                width: '100%',
                height: esMovil ? '400px' : '500px',
                borderRadius: '10px',
                maxWidth: '100%',
                margin: '0 auto'
              }}
            >
              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={posicionUsuario} icon={iconoPersona}>
                <Popup>Usted está aquí</Popup>
              </Marker>

              <LocationPickerConMunicipio
                setUbicacionActual={setUbicacionActual}
                setMunicipalidad={setMunicipalidad}
                setCiudad={setCiudad}
                tipoSeleccionado={tipo}
                reportes={reportes}
                inicio={true}
              />
              {ubicacionActual && (
                <Marker position={ubicacionActual.split(',').map(Number)} icon={markerIcon}>
                  <Popup>Ubicación seleccionada</Popup>
                </Marker>
              )}
            </MapContainer>
          </motion.div>
          ): (
            <>
            <motion.div
             key="mapa-con-formulario"
                initial={{ width: '100%' }}
                animate={{ width: esMovil ? '100%' : '500px' }}
                transition={{ duration: 0.6 }}
                className="mapa-transicion"
              >
            <MapContainer
                  center={ubicacionActual ? ubicacionActual.split(',').map(Number) : posicionUsuario}
                  zoom={18}
                  style={{ height: esMovil ? '200px' : '500px',
                    width: '100%',
                    borderRadius: '10px'}}
                >
              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={posicionUsuario} icon={iconoPersona}>
                <Popup>Usted está aquí</Popup>
              </Marker>

              {ubicacionActual && (
                <Marker position={ubicacionActual.split(',').map(Number)} icon={markerIcon}>
                  <Popup>Ubicación seleccionada</Popup>
                </Marker>
              )}
              <LocationPickerConMunicipio
                setUbicacionActual={setUbicacionActual}
                setMunicipalidad={setMunicipalidad}
                setCiudad={setCiudad}
                tipoSeleccionado={tipo}
                reportes={reportes}
                inicio={false}
              />
            </MapContainer>
          </motion.div>
          <motion.form
           key="formulario"
            onSubmit={handleSubmit}
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="formulario-transicion"
          >
                <textarea
                  value={descripcion}
                  style={{ width: '95%' }}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Describa el problema"
                  required
                  className="report-textarea"
              />
                   <button
                      type="button"
                      onClick={iniciarGrabacion}
                      className={`mic-button ${grabando ? 'grabando' : ''}`}
                      title={grabando ? "Detener grabación" : "Iniciar grabación"}
                    >
                      {grabando ? <FaMicrophoneSlash size={20} /> : <FaMicrophone size={20} />}
                    </button>

                    <select value={tipo} onChange={(e) => setTipo(e.target.value)} className="report-select">
                      <option>Derrumbe</option>
                      <option>Accidente</option>
                      <option>Inundación</option>
                      <option>Iluminación</option>
                      <option>Alcantarilla tapada</option>
                      <option>Bache</option>
                      <option>Semáforo</option>
                      <option>Aceras</option>
                      <option>Señal de Tránsito</option>
                      <option>Desagüe</option>
                      <option>Pintura Vial</option>
                      <option>Otro</option>
                    </select>

                    <select value={urgencia} onChange={(e) => setUrgencia(e.target.value)} className="report-select">
                      <option value="Alta">Alta</option>
                      <option value="Media">Media</option>
                      <option value="Baja">Baja</option>
                    </select>
                      {archivo && (
                      <img src={archivo} alt="Vista previa" style={{ maxWidth: '250px', height: '200px' }} />
                    )}

                    <div className="fila-botones">
                    <label htmlFor="foto" className="boton-saico" title="Tomar Foto">
                      <FaCamera size={20} />
                    </label>
                    {subiendoImagen && (
                        <div className="spinner" style={{ marginTop: '10px' }}></div>
                      )}

                    <input
                      id="foto"
                      type="file"
                      accept="image/*"
                      capture="environment"
                       onChange={async (e) => {
                          const archivo = e.target.files[0];
                          setSubiendoImagen(true); // 🔄 Mostrar spinner
                          try {
                            const url = await subirImagenACloudinary(archivo);
                            setArchivo(url); // ✅ Guardar la URL
                          } catch (err) {
                            toast.error('Error subiendo la imagen');
                          } finally {
                            setSubiendoImagen(false); // 🔚 Ocultar spinner
                          }
                        }}
                      style={{ display: 'none' }}
                    />

                    
                <button type="submit" className="boton-saico">Enviar</button>
                </div>
              </motion.form>
            </>
      )}
          </AnimatePresence>
        )}
    </div>
  );
};

export default ReportForm;
