// Formato CURP: 18 caracteres, regex con vocal/cons/fecha/sexo/entidad/homonimia/dígito verificador
// Nota: reglas simplificadas pero robustas; ajusta catálogo ENTIDAD si lo necesitas.
const ENTIDADES = [
  'AS','BC','BS','CC','CL','CM','CS','CH','DF','DG','GT','GR','HG','JC','MC','MN',
  'MS','NT','NL','OC','PL','QT','QR','SP','SL','SR','TC','TS','TL','VZ','YN','ZS','NE'
] as const

export function isValidCURP(curp: string): boolean {
  const c = curp.toUpperCase().trim()
  if (!/^[A-Z]{4}\d{6}[HM][A-Z]{2}[B-DF-HJ-NP-TV-Z]{3}[0-9A-Z]\d$/.test(c)) return false
  const ent = c.slice(11, 13)
  if (!ENTIDADES.includes(ent as any)) return false
  return true
}
