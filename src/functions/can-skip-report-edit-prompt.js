export function canSkipReportEditPrompt () {
  if (typeof window === 'undefined') return false

  try {
    return Boolean(window.localStorage.skipReportEditPrompt)
  } catch (e) {
    return false
  }
}
