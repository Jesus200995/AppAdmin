import AdminTools from './AdminTools'
import BuscarCURP from '../features/calidad/BuscarCURP'
import ImportUsers from '../features/calidad/ImportUsers'

export default function DashboardPage() {
  return (
    <section style={{ display: 'grid', gap: 32 }}>
      <div>
        <h2>Dashboard</h2>
        <p>Base para KPIs, métricas y notificaciones.</p>
      </div>
      <BuscarCURP />
      <AdminTools />
      <ImportUsers />
    </section>
  )
}

