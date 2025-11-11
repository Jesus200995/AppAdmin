import { useQuery } from '@tanstack/react-query'
import { getOverviewMetrics } from '../app/api'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

export default function Kpis() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['metrics', 'overview'],
    queryFn: getOverviewMetrics,
    refetchOnWindowFocus: false
  })

  if (isLoading) return <div>Cargando KPIs…</div>
  if (error || !data) return <div>Error al cargar métricas</div>

  const roleData = Object.entries(data.byRole).map(([role, count]) => ({ role, count }))
  const topData = data.topSup.map(s => ({ nombre: s.nombre, subalternos: s._count.subalternos }))

  return (
    <section style={{ display: 'grid', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 12 }}>
        <Card title="Pendientes de aprobación" value={data.pending} />
        {roleData.map(r => <Card key={r.role} title={`Total ${r.role}`} value={r.count} />)}
      </div>

      <div style={{ display: 'grid', gap: 12 }}>
        <h3>Usuarios por rol</h3>
        <div style={{ height: 240, border: '1px solid #e5e7eb', borderRadius: 8, padding: 8 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={roleData}>
              <XAxis dataKey="role" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ display: 'grid', gap: 12 }}>
        <h3>Top 10 superiores con más subalternos</h3>
        <div style={{ height: 240, border: '1px solid #e5e7eb', borderRadius: 8, padding: 8 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topData}>
              <XAxis dataKey="nombre" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="subalternos" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  )
}

function Card({ title, value }: { title: string; value: number }) {
  return (
    <div style={{
      border: '1px solid #e5e7eb', borderRadius: 8, padding: 12,
      display: 'grid', gap: 4
    }}>
      <div style={{ opacity: .7 }}>{title}</div>
      <div style={{ fontSize: 24, fontWeight: 700 }}>{value}</div>
    </div>
  )
}
