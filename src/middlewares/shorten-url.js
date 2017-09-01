import pick from 'lodash/pick'
import isEmpty from 'lodash/isEmpty'
import filter from 'lodash/filter'
import forEach from 'lodash/forEach'
import {getAliasesAction} from '../actions/load-aliases'

const aliased = [
  'company',
  'workspace',
  'folder',
  'campaign',
  'order',
  'report'
]

/**
 *
 * @param {String} id entity id
 * @return {Boolean} whether id is an uuid
 */
const isUuid = id => id.length === 36

export function shortenUrlMiddleware (req, res, next) {
  const UUIDs = filter(pick(req.params, aliased), isUuid)

  if (isEmpty(UUIDs)) {
    return next()
  }

  return getAliasesAction(res.locals.tree, UUIDs, req.authToken)
    .then(({data: aliases}) => {
      let url = req.url

      forEach(aliases, (alias, uuid) => {
        url = url.replace(uuid, alias)
      })

      res.redirect(url)
    })
    .catch(() => next())
}
