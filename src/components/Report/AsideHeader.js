import React from 'react'
import NameInput from './NameInput'
import replace from 'lodash/replace'
import {Name} from '../Navigation'

const withLineBreaks = str => replace(str, /\n/g, '<br/>')
const blockStyle = {fontSize: '10pt', margin: '0 2em'}

const ReportAsideHeader = props => {
  if (props.inEditMode) {
    return <NameInput {...props}/>
  }

  const {report: {name, description}} = props

  return (
    <div>
      <Name>{name}</Name>

      {description && (
        <blockquote
          style={blockStyle}
          dangerouslySetInnerHTML={{__html: withLineBreaks(description)}}/>)}
      <hr/>
    </div>
  )
}

ReportAsideHeader.displayName = 'Report-Aside-Header'
ReportAsideHeader.propTypes = {
  report: React.PropTypes.object.isRequired,
  inEditMode: React.PropTypes.bool
}

export default ReportAsideHeader
