export const getFileURL = (filename: string): string => {
  const apiURL = import.meta.env.API_URL || 'http://localhost:8000'
  return `${apiURL}/api/files/${filename}`
}
