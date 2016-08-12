import toArray from 'lodash/toArray'
import {blobToDataUrl} from './blob-to-data-url'

/**
 * serializes a array of report module
 * @param {HTMLDivElement} gridDiv report grid el
 * @returns {Promise.<Array.<Object>>} promise that resolves to a series of files
 */
export function exportReportGrid (gridDiv) {
  const {URL} = window
  const modules = toArray(gridDiv.querySelectorAll('div[data-report-module]'))
  const createURL = URL.createObjectURL
  const exportedModules = []

  /**
   * export chart
   * @param {HTMLDivElement} moduleEl module div el
   * @returns {undefined}
   */
  const exportChart = moduleEl => new Promise(resolve => {
    URL.createObjectURL = createURL

    const highChart = moduleEl.querySelector('div[data-highcharts-chart]')

    if (highChart) {
      URL.createObjectURL = blob => {
        blobToDataUrl(blob)
          .then(img => resolve({img, moduleEl}))

        return createURL.call(URL, blob)
      }

      highChart.HCharts.exportChartLocal()
    } else {
      /**
       *
       * @type {HTMLTableElement}
       */
      const table = moduleEl.querySelector('table')

      resolve({
        html: table.outerHTML,
        moduleEl
      })
    }
  })

  let promise = Promise.resolve()

  modules.forEach(el => {
    promise = promise.then(() => exportChart(el))
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
