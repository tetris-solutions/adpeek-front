import React from 'react'
import PropTypes from 'prop-types'
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

export class Channel extends React.Component {
  static displayName = 'Channel'

  static propTypes = {
    id: PropTypes.string,
    channel: PropTypes.object
  }

  static contextTypes = {
    tree: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired
  }

  componentDidMount () {
    if (!this.props.channel) {
      this.load()
    }
  }

  load = () => {
    const {tree, params} = this.context

    loadFolderChannelAction(tree, params, this.props.id)
  }

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
}

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
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  duration: PropTypes.string.isRequired,
  previewMode: PropTypes.bool,
  setPreviewMode: PropTypes.func
}

export default withState('previewMode', 'setPreviewMode', false)(styledFnComponent(Video, style))
