export const checkpoint = fn => () => {
  try {
    const result = fn()
    // eslint-disable-next-line no-debugger
    debugger
    return result
  } catch (e) {
    // eslint-disable-next-line no-debugger
    debugger
    throw e
  }
}
