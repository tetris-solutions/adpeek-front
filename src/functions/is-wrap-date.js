import isObject from 'lodash/isObject'

export const isWrapDate = x => isObject(x) && x && x.dateFormat
