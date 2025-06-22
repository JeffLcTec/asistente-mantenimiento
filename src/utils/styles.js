import { StyleSheet } from '@react-pdf/renderer';

// Estilos para el PDF (debe estar fuera del componente StatisticsPanel)
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica'
  },
  header: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  section: {
    marginBottom: 10
  },
  table: {
    display: 'table',
    width: 'auto',
    marginTop: 20
  },
  tableRow: {
    flexDirection: 'row'
  },
  tableCell: {
    padding: 5,
    border: '1px solid #000',
    width: '50%'
  }
});


// Asegúrate de exportar los estilos
export default styles;  // <-- Esta línea es crucial