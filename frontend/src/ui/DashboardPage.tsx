import AdminTools from './AdminTools'
import BuscarCURP from '../features/calidad/BuscarCURP'
import ImportUsers from '../features/calidad/ImportUsers'
import Kpis from './Kpis'

export default function DashboardPage() {
  return (
    <section style={{ display: 'grid', gap: 32 }}>
      <div>
        <h2>Dashboard</h2>
        <p>KPIs, métricas, búsqueda de usuarios e importación masiva.</p>
      </div>
      <Kpis />
      <BuscarCURP />
      <AdminTools />
      <ImportUsers />
    </section>
  )
}

