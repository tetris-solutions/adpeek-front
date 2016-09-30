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
  let tableCell = td

  const hasIcons = tableCell
      .querySelectorAll('.material-icons')
      .length > 0

  if (hasIcons) {
    tableCell = tableCell.cloneNode(true)
    const icons = tableCell.querySelectorAll('.material-icons')
    for (let i = 0; i < icons.length; i++) {
      icons[i].parentElement.removeChild(icons[i])
    }
  }

  const content = {
    align: includes(tableCell.className, 'non-numeric') ? 'left' : 'right',
    text: trim(tableCell.innerText)
  }
  const img = tableCell.querySelector('img')
  const title = tableCell.querySelector('strong')
  const anchor = tableCell.querySelector('a')

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
    content.link = anchor.href
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
 * serializes modules
 * @param {Array} modules the modules to be exported
 * @param {Boolean} [forceTableExport] whether modules ought to be exported as table regardless of type
 * @return {*|Promise|Promise.<Array>} a promise that resolves to the array of serialized modules
 */
export function serializeReportModules (modules, forceTableExport = false) {
  const {Highcharts} = window
  const HDownload = Highcharts.downloadURL
  const exportedModules = []
  const unhack = () => {
    Highcharts.downloadURL = HDownload
  }

  const exportChart = ({id, name, el}) => new Promise(resolve => {
    const highChart = el.querySelector('div[data-highcharts-chart]')

    function exportHC () {
      // hack highcharts download method
      Highcharts.downloadURL = img => resolve({name, img})
      highChart.HCharts.exportChartLocal()
    }

    function exportTable () {
      /**
       *
       * @type {HTMLTableElement}
       */
      const table = el.querySelector('table')
      const module = {
        name,
        headers: [],
        rows: []
      }

      if (table.tHead.rows.length > 1) {
        module.headers = serializeTr(table.tHead.rows[1])

        /**
         *
         * @type {HTMLTableSectionElement}
         */
        const tbody = table.tBodies[0]

        for (let i = 0; i < tbody.rows.length; i++) {
          module.rows.push(serializeTr(tbody.rows[i]))
        }
      }

      resolve(module)
    }

    function renderAsTableThenExport () {
      el.querySelector('div[data-interface]')
        .renderAsTable()
        .then(exportTable)
    }

    if (!highChart) {
      exportTable()
    } else if (forceTableExport) {
      renderAsTableThenExport()
    } else {
      exportHC()
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
