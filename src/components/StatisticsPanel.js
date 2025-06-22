// src/components/StatisticsPanel.js
import React, { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PDFDownloadLink } from '@react-pdf/renderer';
import * as XLSX from 'xlsx';
import PDFDocumento from '../utils/PDFDocumento';
import './StatisticsPanel.css';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658'];

const StatisticsPanel = ({ reportes }) => {
  const [zonaSeleccionada, setZonaSeleccionada] = useState('');
  const [tipoSeleccionado, setTipoSeleccionado] = useState('');
  const [estadoSeleccionado, setEstadoSeleccionado] = useState('');
  const [email, setEmail] = useState('');

  const zonas = [...new Set(reportes.map(r => r.asignadoA))];
  const tipos = [...new Set(reportes.map(r => r.tipo))];
  const estados = ['Recibido', 'En Proceso', 'Resuelto'];

  const reportesFiltrados = reportes.filter(r => {
    const zonaOk = zonaSeleccionada === '' || r.asignadoA === zonaSeleccionada;
    const tipoOk = tipoSeleccionado === '' || r.tipo === tipoSeleccionado;
    const estadoOk = estadoSeleccionado === '' || r.estado === estadoSeleccionado;
    return zonaOk && tipoOk && estadoOk;
  });

  const porEstado = estados.map(estado => ({
    name: estado,
    value: reportesFiltrados.filter(r => r.estado === estado).length
  }));

  const porTipo = tipos.map(tipo => ({
    name: tipo,
    value: reportesFiltrados.filter(r => r.tipo === tipo).length
  }));

  const datosExportacion = {
    total: reportesFiltrados.length,
    recibidos: reportesFiltrados.filter(r => r.estado === 'Recibido').length,
    enProceso: reportesFiltrados.filter(r => r.estado === 'En Proceso').length,
    resueltos: reportesFiltrados.filter(r => r.estado === 'Resuelto').length,
    porEstado,
    porTipo
  };

  const simularEnvioCorreo = () => {
    toast.success(
      <div>
        <p>✉️ Correo simulado enviado a: {email || 'usuario@ejemplo.com'}</p>
        <small>En producción se enviaría el reporte completo</small>
      </div>,
      { autoClose: 4000 }
    );
  };

  const generarExcelSimulado = () => {
    const data = [
      { 'Tipo': 'Total', 'Cantidad': datosExportacion.total },
      { 'Tipo': 'Recibidos', 'Cantidad': datosExportacion.recibidos },
      { 'Tipo': 'En proceso', 'Cantidad': datosExportacion.enProceso },
      { 'Tipo': 'Resueltos', 'Cantidad': datosExportacion.resueltos }
    ];
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Estadísticas");
    XLSX.writeFile(wb, "reporte_estadistico.xlsx");
    toast.info('📊 Archivo Excel generado (simulación)');
  };

  return (
    <div className="statistics-panel">
      <h2 className="titulo">Estadísticas de Reportes</h2>

      <div className="filtros">
        <select value={zonaSeleccionada} onChange={(e) => setZonaSeleccionada(e.target.value)}>
          <option value="">Todas las zonas</option>
          {zonas.map((z, i) => <option key={i} value={z}>{z}</option>)}
        </select>

        <select value={tipoSeleccionado} onChange={(e) => setTipoSeleccionado(e.target.value)}>
          <option value="">Todos los tipos</option>
          {tipos.map((t, i) => <option key={i} value={t}>{t}</option>)}
        </select>

        <select value={estadoSeleccionado} onChange={(e) => setEstadoSeleccionado(e.target.value)}>
          <option value="">Todos los estados</option>
          {estados.map((est, i) => <option key={i} value={est}>{est}</option>)}
        </select>

                {/* Botón para limpiar filtros */}
      {(zonaSeleccionada || tipoSeleccionado || estadoSeleccionado) && (
        <button
          onClick={() => {
            setZonaSeleccionada('');
            setTipoSeleccionado('');
            setEstadoSeleccionado('');
          }}
          className="limpia-filtros"
        >
          Limpiar Filtros
        </button>
      )}

      </div>

      <div className="resumen">
        <h3>Resumen</h3>
        <p>Total reportes: {datosExportacion.total}</p>
        <p>Recibidos: {datosExportacion.recibidos}</p>
        <p>En proceso: {datosExportacion.enProceso}</p>
        <p>Resueltos: {datosExportacion.resueltos}</p>
      </div>

      <div className="graficos">
        <div>
          <h3>Por Estado</h3>
          <PieChart width={250} height={250}>
            <Pie data={porEstado} cx="50%" cy="50%" outerRadius={80} label dataKey="value">
              {porEstado.map((_, index) => (
                <Cell key={`cell-estado-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
        <div>
          <h3>Por Tipo</h3>
          <PieChart width={250} height={250}>
            <Pie data={porTipo} cx="50%" cy="50%" outerRadius={80} label dataKey="value">
              {porTipo.map((_, index) => (
                <Cell key={`cell-tipo-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      </div>

      <div className="exportacion">
        <h3>Exportar Reporte</h3>
        <PDFDownloadLink
          document={<PDFDocumento datos={datosExportacion} />}
          fileName="reporte_estadistico.pdf"
        >
          {({ loading }) => (
            <button disabled={loading}>
              {loading ? 'Generando PDF...' : 'Descargar PDF'}
            </button>
          )}
        </PDFDownloadLink>

        <button onClick={generarExcelSimulado}>Descargar Excel (Simulado)</button>

        <div className="envio-correo">
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={simularEnvioCorreo}>Enviar por correo (Simulado)</button>
        </div>
      </div>
    </div>
  );
};

export default StatisticsPanel;
