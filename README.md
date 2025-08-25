
# Asistente de Mantenimiento de Obra Pública

Aplicación web para reportar daños o problemas en las calles, como baches, semáforos, alcantarillas, etc.
Permite que cualquier persona seleccione una ubicación en el mapa, suba una foto, deje un comentario, y envíe el reporte a la municipalidad correspondiente.

URL: [asistente-mantenimiento.vercel.app](https://asistente-mantenimiento.vercel.app/)
---

## 🛠 Funcionalidades principales

* Mapa interactivo donde se marcan averías o situaciones en la vía pública.
* Formulario para crear reportes con ubicación, tipo de daño, urgencia y descripción.
* Subida de imágenes y reconocimiento de voz para dictar el reporte.
* Panel de estadísticas básicas sobre los reportes realizados.
* Sección de comentarios tipo foro para cada reporte.

---

## 🧱 Tecnologías utilizadas

* **React**: estructura de toda la interfaz.
* **Leaflet (react-leaflet)**: para el mapa y ubicación interactiva.
* **React Toastify**: notificaciones simples.
* **Framer Motion**: animaciones entre secciones.
* **FontAwesome Icons (react-icons)**: íconos visuales en botones.


---

## 🚀 Cómo ejecutar el proyecto

1. Clonar el repositorio:

   ```bash
   https://github.com/JeffLcTec/asistente-mantenimiento.git
   cd asistente-mantenimiento
   ```

2. Instalar dependencias:

   ```bash
   npm install
   ```

3. Ejecutar en modo desarrollo:

   ```bash
   npm start
   ```

---

## 📁 Estructura general del frontend

```
src/
├── components/
│   ├── ReportForm.js       # Formulario para crear reportes
│   ├── ReportList.js       # Lista de reportes existentes
│   ├── ReportMap.js        # Mapa principal con marcadores
│   ├── StatisticsPanel.js  # Panel de estadísticas
│   └── CommentPanel.js     # Foro de comentarios por reporte
├── utils/
│   ├── location.js         # Funciones para calcular municipio
│   ├── geolib.js           # Cálculo de distancias
│   └── UrgencyCalc.js      # Urgencia automática según tipo
├── App.js
└── index.js
```

---

## 📌 Notas

* Se recomienda ejecutar el frontend en una red local segura (HTTPS o localhost) para que funcione correctamente la geolocalización.
* Las imágenes se suben a un servicio externo (ej. Cloudinary).

---

## 📝 Licencia

Código abierto bajo licencia MIT. Usalo, modificalo y mejoralo como gustés.


