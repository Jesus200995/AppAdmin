import L from 'leaflet'

export function patchLeafletIcon() {
  try {
    const DefaultIcon = (L.Icon.Default as any)
    DefaultIcon.prototype.options.iconUrl = new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href
    DefaultIcon.prototype.options.iconRetinaUrl = new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href
    DefaultIcon.prototype.options.shadowUrl = new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href
  } catch (e) {
    // no-op: useful during SSR or if leaflet assets not found
    // console.warn('leafletIconFix failed', e)
  }
}
