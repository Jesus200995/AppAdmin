import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { patchLeafletIcon } from './leafletIconFix'
import { useQuery } from '@tanstack/react-query'
import { getMapUsers } from '../../app/api'

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN as string

export default function MapaPage() {
  const mapRef = useRef<L.Map | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [ready, setReady] = useState(false)

  const [role, setRole] = useState<string | undefined>(undefined)
  const [superiorId, setSuperiorId] = useState<string>('')

  const { data: users } = useQuery({
    queryKey: ['map', 'users', role, superiorId],
    queryFn: () => getMapUsers({ role, superiorId: superiorId || undefined }),
    enabled: !!ready
  })

  useEffect(() => {
    patchLeafletIcon()

    if (!containerRef.current) return
    if (mapRef.current) return

    const map = L.map(containerRef.current, {
      center: [23.6345, -102.5528], // MX
      zoom: 5,
      zoomControl: true,
      attributionControl: true,
    })
    mapRef.current = map

    // === Mapbox styles ===
    const commonOpts: L.TileLayerOptions = {
      tileSize: 512,
      zoomOffset: -1,
      attribution:
        '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © ' +
        '<a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> ' +
        '— <a href="https://www.mapbox.com/map-feedback/">Improve this map</a>',
      accessToken: MAPBOX_TOKEN,
    } as any

    const streets = L.tileLayer(
      `https://api.mapbox.com/styles/v1/mapbox/streets-v12/tiles/{z}/{x}/{y}?access_token=${MAPBOX_TOKEN}`,
      commonOpts
    )

    const satellite = L.tileLayer(
      `https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v12/tiles/{z}/{x}/{y}?access_token=${MAPBOX_TOKEN}`,
      commonOpts
    )

    streets.addTo(map)

    // Control para alternar estilos
    L.control.layers(
      { Streets: streets, Satellite: satellite },
      undefined,
      { collapsed: false }
    ).addTo(map)

    // Marcador de ejemplo
    L.marker([19.4326, -99.1332]).addTo(map).bindPopup('<b>CDMX</b>')

    setReady(true)
    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])

  // Geolocalización
  useEffect(() => {
    if (!ready || !mapRef.current) return
    if (!('geolocation' in navigator)) return

    const map = mapRef.current
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        const user = [latitude, longitude] as L.LatLngExpression
        L.circle(user, { radius: 50 }).addTo(map)
        map.setView(user, 14, { animate: true })
      },
      () => {},
      { enableHighAccuracy: true, timeout: 5000 }
    )
  }, [ready])

  // Dibuja marcadores cuando cambia users
  useEffect(() => {
    if (!ready || !mapRef.current || !users) return
    const map = mapRef.current

    // Limpia capa anterior: usa un layerGroup local
    const layer = L.layerGroup().addTo(map)

    users.forEach((u, idx) => {
      // Simulación: dispersa puntos cerca del centro (cámbialo por coords reales cuando las tengas)
      const lat = 19.4326 + Math.sin(idx) * 0.5
      const lng = -99.1332 + Math.cos(idx) * 0.5
      L.marker([lat, lng]).addTo(layer).bindPopup(`<b>${u.nombre}</b><br/>${u.role}<br/>${u.email}`)
    })

    // limpieza al refrescar
    return () => { layer.remove() }
  }, [users, ready])

  return (
    <section style={{ height: 'calc(100dvh - 120px)', display: 'grid', gridTemplateRows: 'auto 1fr', gap: 8 }}>
      <div>
        <h2>Mapa</h2>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 8 }}>
          <select value={role || ''} onChange={e => setRole(e.target.value || undefined)}>
            <option value="">Todos los roles</option>
            <option value="COORD_TERRITORIAL">COORD_TERRITORIAL</option>
            <option value="TERRITORIAL">TERRITORIAL</option>
            <option value="FACILITADOR">FACILITADOR</option>
            <option value="TECNICO_PROD">TECNICO_PROD</option>
            <option value="TECNICO_SOC">TECNICO_SOC</option>
            <option value="ADMIN">ADMIN</option>
          </select>
          <input
            placeholder="Filtrar por superiorId (opcional)"
            value={superiorId} onChange={e => setSuperiorId(e.target.value)}
            style={{ flex: 1 }}
          />
        </div>
      </div>

      <div
        ref={containerRef}
        style={{
          height: '100%',
          border: '1px solid #e5e7eb',
          borderRadius: 8,
          overflow: 'hidden',
        }}
      />
    </section>
  )
}
