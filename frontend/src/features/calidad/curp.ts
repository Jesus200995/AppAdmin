const ENTIDADES = [
  'AS','BC','BS','CC','CL','CM','CS','CH','DF','DG','GT','GR','HG','JC','MC','MN',
  'MS','NT','NL','OC','PL','QT','QR','SP','SL','SR','TC','TS','TL','VZ','YN','ZS','NE'
] as const

export function isValidCURP(curp: string) {
  const c = curp.toUpperCase().trim()
  if (!/^[A-Z]{4}\d{6}[HM][A-Z]{2}[B-DF-HJ-NP-TV-Z]{3}[0-9A-Z]\d$/.test(c)) return false
  const ent = c.slice(11, 13)
  return (ENTIDADES as readonly string[]).includes(ent)
}
