import {reportToChartConfig} from '../functions/report-to-chart-config'

/* global self */

self.addEventListener('message', ({data: {id, payload}}) => {
  self.postMessage({id, result: reportToChartConfig(payload)})
})
