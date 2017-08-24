import assign from 'lodash/assign'
import isArray from 'lodash/isArray'
import isObject from 'lodash/isPlainObject'
import isString from 'lodash/isString'
import {randomString} from './random-string'
import findIndex from 'lodash/findIndex'
import forEach from 'lodash/forEach'
import includes from 'lodash/includes'
import startsWith from 'lodash/startsWith'
import endsWith from 'lodash/endsWith'
import global from 'global'

const validTypes = [
  'boolean',
  'string',
  'number',
  'object',
  'undefined'
]

const serializable = x => includes(validTypes, typeof x)

function dangerous (key) {
  return (
    startsWith(key, '$') ||
    startsWith(key, '@') ||
    (startsWith(key, '_') && !endsWith(key, '_'))
  )
}

const stash = global.commStash = {}
const timeouts = {}
const generateKey = () => `stash-${randomString()}-${randomString()}`
const stashed = key => isString(key) && stash.hasOwnProperty(key)

function createStashKey (item) {
  const id = findIndex(stash, stashItem => stashItem === item)

  if (stashed(id)) {
    clearTimeout(timeouts[id])
    return id
  }

  const key = generateKey()

  stash[key] = item

  return key
}

function discard (key) {
  timeouts[key] = setTimeout(() => {
    delete stash[key]
  }, 1000 * 30)
}

function setSafely (obj, key, val) {
  try {
    obj[key] = val
  } catch (e) {
    if (isArray(obj)) {
      obj = obj.concat()
      obj[key] = val
    } else {
      obj = assign({}, obj)
    }
    obj[key] = val
  }

  return obj
}

export function attachCallbacks (obj) {
  forEach(obj, (value, key) => {
    if (stashed(value)) {
      obj = setSafely(obj, key, stash[value])
      discard(value)
    } else if (isArray(value) || isObject(value)) {
      obj = setSafely(obj, key, attachCallbacks(value))
    }
  })

  return obj
}

export function detachCallbacks (obj) {
  forEach(obj, (value, key) => {
    if (!serializable(value) || dangerous(key)) {
      obj = setSafely(obj, key, createStashKey(value))
    } else if (value && isArray(value) || isObject(value)) {
      obj = setSafely(obj, key, detachCallbacks(value))
    }
  })

  return obj
}
