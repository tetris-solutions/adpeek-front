import React from 'react'
import {Link} from 'react-router'
import csjs from 'csjs'

const {PropTypes} = React
const style = csjs`
.header {
  text-align: center;
  width: 100%;
  overflow: hidden;
}
.icon {
  margin-top: .3em;
  font-size: 56px;
  text-indent: 1.6em;
}`

export const FolderAside = React.createClass({
  displayName: 'Folder-Aside',
  propTypes: {
    params: PropTypes.shape({
      company: PropTypes.string,
      workspace: PropTypes.string
    })
  },
  contextTypes: {
    insertCss: PropTypes.func,
    folder: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string
    })
  },
  render () {
    const {params: {company, workspace}} = this.props
    const {folder, insertCss} = this.context

    if (!folder) return null

    insertCss(style)
    return (
      <header className={style.header}>
        <i className={`material-icons ${style.icon}`}>folder open</i>
        <h5>{folder.name}</h5>
        <Link className='mdl-button' to={`/company/${company}/workspace/${workspace}/folder/${folder.id}/edit`}>
          Edit
        </Link>
      </header>
    )
  }
})

export default FolderAside
