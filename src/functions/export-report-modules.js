import toArray from 'lodash/toArray'
import includes from 'lodash/includes'
import trim from 'lodash/trim'
import startsWith from 'lodash/startsWith'

/**
 * get cell text content
 * @param {HTMLTableCellElement} td table cell
 * @return {Object} the cell content
 */
function serializeTableCell (td) {
  const content = {
    align: includes(td.className, 'non-numeric') ? 'left' : 'right',
    text: trim(td.innerText)
  }
  const img = td.querySelector('img')
  const title = td.querySelector('strong')
  const anchor = td.querySelector('a')

  if (img) {
    content.img = img.src
  }

  if (title) {
    content.title = trim(title.innerText)
    content.text = startsWith(content.text, content.title)
      ? trim(content.text.substr(content.title.length))
      : content.text
  }

  if (anchor) {
    content.link = {
      url: anchor.href,
      text: trim(anchor.innerText)
    }
  }

  return content
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
  const {Highcharts} = window
  const HDownload = Highcharts.downloadURL
  const exportedModules = []
  const unhack = () => {
    Highcharts.downloadURL = HDownload
  }

  const exportChart = ({id, name, el, rows, cols}) => new Promise(resolve => {
    const highChart = el.querySelector('div[data-highcharts-chart]')

    if (highChart) {
      // hack highcharts download method
      Highcharts.downloadURL = img => resolve({cols, rows, img})
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
    unhack()
    return exportedModules
  }, err => {
    unhack()
    throw err
  })
}
