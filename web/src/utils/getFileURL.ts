export const getFileURL = (filename?: string): string | undefined => {
  if (!filename) return undefined
  const apiURL = import.meta.env.API_URL || 'http://localhost:8000'
  return `${apiURL}/api/files/${filename}`
}
