export const blobToDataUrl = blob => new Promise(resolve => {
  const f = new window.FileReader()
  f.onload = e => resolve(e.target.result)
  f.readAsDataURL(blob)
})
