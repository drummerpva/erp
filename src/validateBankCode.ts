export const validateBankCode = (code: string): boolean => {
  if (!code) return false
  if (code.length !== 3) return false
  if (code.replace(/\D/g, '').length !== 3) return false
  return true
}
