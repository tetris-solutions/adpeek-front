import toArray from 'lodash/toArray'
import includes from 'lodash/includes'
import trim from 'lodash/trim'
import startsWith from 'lodash/startsWith'
import isNumber from 'lodash/isNumber'
import assign from 'lodash/assign'

/**
 * get cell text content
 * @param {HTMLTableCellElement} td table cell
 * @param {String} type kind of export format
 * @return {Object} the cell content
 */
function serializeTableCell (td, type) {
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
  const hasNonNumericClass = includes(tableCell.className, 'non-numeric')

  const cell = {
    align: hasNonNumericClass ? 'left' : 'right',
    content: trim(tableCell.innerText)
  }

  if (type === 'xls') {
    const value = tableCell.dataset.raw
      ? JSON.parse(tableCell.dataset.raw)
      : trim(tableCell.innerText)

    assign(cell, {
      content: value,
      date: tableCell.dataset.date !== undefined,
      percentage: isNumber(value) && includes(tableCell.innerText, '%'),
      currency: isNumber(value) && includes(tableCell.innerText, '$')
    })
  }

  const img = tableCell.querySelector('img')
  const cellStrongElement = tableCell.querySelector('strong')
  const anchor = tableCell.querySelector('a')

  if (img) {
    cell.img = img.src
  }

  if (cellStrongElement) {
    cell.title = trim(tableCell.innerText)
    cell.content = startsWith(cell.content, cell.title)
      ? trim(cell.value.substr(cell.title.length))
      : cell.content
  }

  if (anchor) {
    cell.link = anchor.href
  }

  return cell
}

/**
 * reads array of strings from <tr>
 * @param {HTMLTableRowElement} tr table row
 * @param {String} type kind of export format
 * @return {Array.<String>} array of cell string
 */
function serializeTr (tr, type) {
  return toArray(tr.cells).map(el => serializeTableCell(el, type))
}
/**
 * serializes modules
 * @param {Array} modules the modules to be exported
 * @param {String} type kind of export format
 * @return {*|Promise|Promise.<Array>} a promise that resolves to the array of serialized modules
 */
export function serializeReportModules (modules, type) {
  const {Highcharts} = window
  const originalDownloadMethod = Highcharts.downloadURL
  const exportedModules = []

  function restoreOriginalDownloadMethod () {
    Highcharts.downloadURL = originalDownloadMethod
  }

  const exportChart = ({id, name, el}) =>
    new Promise(function resolveSerializedModule (resolve) {
      const isTable = el.querySelector('table')

      function exportHC () {
        const highChart = el.querySelector('div[data-highcharts-chart]')
        // hack highcharts download method
        Highcharts.downloadURL = img => resolve({name, img})
        highChart.HCharts.exportChartLocal()
      }

      function exportTable () {
        const table = el.querySelector('table')
        const module = {
          name,
          headers: [],
          rows: []
        }

        if (table.tHead.rows.length > 1) {
          module.headers = serializeTr(table.tHead.rows[1], type)

          /**
           *
           * @type {HTMLTableSectionElement}
           */
          const tbody = table.tBodies[0]

          for (let i = 0; i < tbody.rows.length; i++) {
            module.rows.push(serializeTr(tbody.rows[i], type))
          }
        }

        resolve(module)
      }

      function renderAsTableThenExport () {
        el.querySelector('div[data-interface]')
          .renderAsTable()
          .then(exportTable)
      }

      if (isTable) {
        exportTable()
      } else if (type === 'xls' || el.dataset.moduleType === 'total') {
        renderAsTableThenExport()
      } else {
        exportHC()
      }
    })

  let promise = Promise.resolve()

  function enqueueModuleSerialization (m) {
    promise = promise.then(() => exportChart(m))
      .then(i => exportedModules.push(i))
  }

  modules.forEach(enqueueModuleSerialization)

  return promise.then(function onSuccess () {
    restoreOriginalDownloadMethod()
    return exportedModules
  }, function onFailure (err) {
    restoreOriginalDownloadMethod()
    throw err
  })
}
