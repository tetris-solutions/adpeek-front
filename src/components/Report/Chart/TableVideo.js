import React from 'react'
import {styledFnComponent} from '../../higher-order/styled-fn-component'
import {loadFolderChannelAction} from '../../../actions/load-folder-channel'
import csjs from 'csjs'
import {withState} from 'recompose'
import Modal from 'tetris-iso/Modal'
import floor from 'lodash/floor'

const style = csjs`
.video > figcaption {
  display: block;
  margin-bottom: .4em;
  font-weight: 500;
  font-family: "Roboto","Helvetica","Arial",sans-serif;
}
.video > img {
  cursor: pointer;
}`

export const Channel = React.createClass({
  displayName: 'Channel',
  propTypes: {
    id: React.PropTypes.string,
    channel: React.PropTypes.object
  },
  contextTypes: {
    tree: React.PropTypes.object.isRequired,
    params: React.PropTypes.object.isRequired
  },
  componentDidMount () {
    if (!this.props.channel) {
      this.load()
    }
  },
  load () {
    const {tree, params} = this.context

    loadFolderChannelAction(tree, params, this.props.id)
  },
  render () {
    if (!this.props.channel) {
      return <span>{this.props.id}</span>
    }

    const {channel: {title, description}} = this.props

    return (
      <div>
        <strong>{title}</strong>
        <br/>
        <small>{description}</small>
      </div>
    )
  }
})

function Video ({id, name, duration, previewMode, setPreviewMode}) {
  return (
    <figure className={`${style.video}`} onClick={() => setPreviewMode(!previewMode)}>
      <img src={`http://img.youtube.com/vi/${id}/mqdefault.jpg`}/>

      <figcaption>
        {name}
      </figcaption>

      {previewMode && (
        <Modal onEscPress={() => setPreviewMode(false)}>
          <iframe
            width={750}
            height={floor(750 * (9 / 16))}
            frameBorder={0}
            src={`https://www.youtube.com/embed/${id}`}
            allowFullScreen/>
        </Modal>)}
    </figure>
  )
}

Video.displayName = 'Video'
Video.propTypes = {
  id: React.PropTypes.string.isRequired,
  name: React.PropTypes.string.isRequired,
  duration: React.PropTypes.string.isRequired,
  previewMode: React.PropTypes.bool,
  setPreviewMode: React.PropTypes.func
}

export default withState('previewMode', 'setPreviewMode', false)(styledFnComponent(Video, style))
