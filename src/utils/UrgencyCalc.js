// utils/urgencyCalc.js
export const getUrgencyByType = (tipo) => {
  const urgencyMap = {
    'Derrumbe': 'Alta',
    'Inundación': 'Alta', 
    'Bache': 'Media',
    'Alcantarilla tapada': 'Media',
    'Iluminación': 'Baja',
    'Accidente': 'Alta',
    'Semáforo': 'Alta',
    'Aceras': 'Media',
    'Señal de Tránsito': 'Media',
    'Desagüe': 'Media',
    'Pintura Vial': 'Baja',
    'Otro': 'Media'
  };
  return urgencyMap[tipo] || 'Media'; // Valor por defecto
};
