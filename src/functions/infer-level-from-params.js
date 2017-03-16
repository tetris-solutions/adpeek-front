export function inferLevelFromParams (params) {
  let level = 'company'

  if (params.folder) {
    level = 'folder'
  } else if (params.workspace) {
    level = 'workspace'
  }

  return level
}

export const inferLevelFromProps = ({params}) => inferLevelFromParams(params)
