import React from 'react';
import { Document, Page, Text, View } from '@react-pdf/renderer';
import styles  from './styles.js';  // Importa los estilos locales

export const PDFDocumento = ({ datos }) => (

  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.header}>Reporte Estadístico</Text>
        
        <Text>Fecha: {new Date().toLocaleDateString()}</Text>
        
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Total reportes</Text>
            <Text style={styles.tableCell}>{datos.total}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Recibidos</Text>
            <Text style={styles.tableCell}>{datos.recibidos}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>En proceso</Text>
            <Text style={styles.tableCell}>{datos.enProceso}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Resueltos</Text>
            <Text style={styles.tableCell}>{datos.resueltos}</Text>
          </View>
        </View>

        <Text style={{ marginTop: 20 }}>Estadísticas por estado:</Text>
        {datos.porEstado.map((item, index) => (
          <Text key={index}>{item.name}: {item.value}</Text>
        ))}

        <Text style={{ marginTop: 15 }}>Estadísticas por tipo:</Text>
        {datos.porTipo.map((item, index) => (
          <Text key={index}>{item.name}: {item.value}</Text>
        ))}
      </View>
    </Page>
  </Document>
);
export default PDFDocumento;