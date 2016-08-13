import toArray from 'lodash/toArray'

export const blobToDataUrl = blob => new Promise(resolve => {
  const f = new window.FileReader()
  f.onload = e => resolve(e.target.result)
  f.readAsDataURL(blob)
})

/**
 * get cell text content
 * @param {HTMLTableCellElement} td table cell
 * @return {String} the cell content
 */
function serializeTableCell (td) {
  const el = td.querySelector('span') || td
  return el.innerText
}

/**
 * reads array of strings from <tr>
 * @param {HTMLTableRowElement} tr table row
 * @return {Array.<String>} array of cell string
 */
function serializeTr (tr) {
  return toArray(tr.cells).map(serializeTableCell)
}

/**
 * serializes a array of report module
 * @param {Array} modules module list
 * @returns {Promise.<Array.<Object>>} promise that resolves to a series of files
 */
export function exportReportModules (modules) {
  const {URL} = window
  const createURL = URL.createObjectURL
  const exportedModules = []

  const exportChart = ({id, name, el, rows, cols}) => new Promise(resolve => {
    URL.createObjectURL = createURL

    const highChart = el.querySelector('div[data-highcharts-chart]')

    if (highChart) {
      URL.createObjectURL = blob => {
        blobToDataUrl(blob)
          .then(img => resolve({cols, rows, img}))

        return createURL.call(URL, blob)
      }

      highChart.HCharts.exportChartLocal()
    } else {
      /**
       *
       * @type {HTMLTableElement}
       */
      const table = el.querySelector('table')

      const serializedTable = {
        title: name,
        head: [],
        body: []
      }

      if (table.tHead.rows.length > 1) {
        serializedTable.head = serializeTr(table.tHead.rows[1])

        /**
         *
         * @type {HTMLTableSectionElement}
         */
        const tbody = table.tBodies[0]

        for (let i = 0; i < tbody.rows.length; i++) {
          serializedTable.body.push(serializeTr(tbody.rows[i]))
        }
      }

      resolve({cols, rows, table: serializedTable})
    }
  })

  let promise = Promise.resolve()

  modules.forEach(m => {
    promise = promise.then(() => exportChart(m))
      .then(i => exportedModules.push(i))
  })

  return promise.then(() => {
    URL.createObjectURL = createURL
    return exportedModules
  }, err => {
    URL.createObjectURL = createURL
    throw err
  })
}
