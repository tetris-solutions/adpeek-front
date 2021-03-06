import React from 'react'
import PropTypes from 'prop-types'
import Modal from '@tetris/front-server/Modal'
import Message from '@tetris/front-server/Message'
import {styledComponent} from '../../../higher-order/styled'
import csjs from 'csjs'
import bind from 'lodash/bind'
import AppPresets from './AppPresets'
import CallPresets from './CallPresets'

const style = csjs`
.blocks {
  display: table;
}
.block {
  display: table-cell;
  cursor: pointer;
  padding: 1em;
  border: 1px solid rgb(230, 230, 230);
  width: 1%;
}
.icon {
  display: block;
  text-align: center;
  font-size: 100px;
  margin-bottom: 20px;
}`

const presetsComponent = {
  app: AppPresets,
  call: CallPresets
}

const Block = ({type, icon, onClick}) => (
  <div className={`${style.block} mdl-color-text--grey-800`} onClick={bind(onClick, null, type)}>
    <i className={`${style.icon} material-icons mdl-color-text--grey-600`}>
      {icon}
    </i>

    <h5>
      <Message>{`${type}ConversionTrackerTitle`}</Message>
    </h5>

    <p>
      <Message>{`${type}ConversionTrackerDescription`}</Message>
    </p>
  </div>
)

Block.displayName = 'Block'
Block.propTypes = {
  onClick: PropTypes.func.isRequired,
  type: PropTypes.oneOf(['app', 'website', 'call']).isRequired,
  icon: PropTypes.string.isRequired
}

class Presets extends React.Component {
  static displayName = 'Conversion-Presets'
  static propTypes = {
    save: PropTypes.func
  }

  state = {
    type: null
  }

  pick = type => {
    if (type === 'website') {
      this.props.save({ConversionTrackerType: 'AdWordsConversionTracker'})
    } else {
      this.setState({type})
    }
  }

  unset = () => {
    this.setState({type: null})
  }

  render () {
    const PresetsComponent = presetsComponent[this.state.type]

    return (
      <div className='mdl-grid'>
        <div className='mdl-cell mdl-cell--12-col'>
          <h6>
            <Message>conversionTypeSelectorTitle</Message>
          </h6>

          <section className={style.blocks}>
            <Block type='website' icon='web' onClick={this.pick}/>
            <Block type='app' icon='phone_iphone' onClick={this.pick}/>
            <Block type='call' icon='call' onClick={this.pick}/>
          </section>
        </div>

        {PresetsComponent ? (
          <Modal size='small' onEscPress={this.unset}>
            <PresetsComponent
              cancel={this.unset}
              save={this.props.save}/>
          </Modal>
        ) : null}
      </div>
    )
  }
}

export default styledComponent(Presets, style)
