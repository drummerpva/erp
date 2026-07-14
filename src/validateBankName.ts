export const validateBankName = (name: string): boolean => {
  if (!name) return false
  if (!name.match(/^.+\s.+$/)) return false
  return true
}
