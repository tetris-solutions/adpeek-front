import isEmpty from 'lodash/isEmpty'
import Message from 'intl-messageformat'
import {isValidReportQuery} from './is-valid-report-query'
import log from 'loglevel'

export function getEmptyModuleMessage ({messages, locales, type, result, isLoading, query, entity}) {
  if (entity.isLoading) {
    return new Message(messages.loadingEntity, locales)
      .format({
        name: entity.name
      })
  }

  if (!query) {
    return messages.loadingModuleConfig
  }

  if (!isValidReportQuery(type, query)) {
    log.debug('invalid module config', arguments[0])
    return messages.invalidModuleLabel
  }

  if (isLoading) {
    return messages.loadingModuleResult
  }

  if (isEmpty(result)) {
    return messages.emptyReportResult
  }
}
