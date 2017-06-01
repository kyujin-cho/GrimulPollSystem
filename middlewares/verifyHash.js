import SHA256 from './SHA256'

export function generateHash(id) {
  return SHA256(
    Math.random() * (10 ** 8).toString() 
  + id.slice((id.length() - 1) / 2)
  + Math.random() * (10 ** 8).toString()
  + id.slice(0, (id.length() - 1) / 2)
  )
}