import React from 'react'
import {styledFnComponent} from '../../higher-order/styled-fn-component'
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

Video.propTypes = {
  id: React.PropTypes.string.isRequired,
  name: React.PropTypes.string.isRequired,
  duration: React.PropTypes.string.isRequired,
  previewMode: React.PropTypes.bool,
  setPreviewMode: React.PropTypes.func
}

export default withState('previewMode', 'setPreviewMode', false)(styledFnComponent(Video, style))
