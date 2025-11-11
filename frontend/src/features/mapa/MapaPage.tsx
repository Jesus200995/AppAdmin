import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { patchLeafletIcon } from './leafletIconFix'

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN as string

export default function MapaPage() {
  const mapRef = useRef<L.Map | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [ready, setReady] = useState(false)

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

  return (
    <section style={{ height: 'calc(100dvh - 120px)' }}>
      <h2>Mapa</h2>
      <p>Leaflet + Mapbox (streets/satellite). Usa tu token desde .env.local.</p>
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
