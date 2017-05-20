import React from 'react'
import PropTypes from 'prop-types'
import Message from 'tetris-iso/Message'
import Modal from 'tetris-iso/Modal'
import csjs from 'csjs'
import {styledComponent} from '../../higher-order/styled'
import {Button} from '../../Button'
// import Location from './Location'
import Proximity from './Proximity'
import isNumber from 'lodash/isNumber'

const style = csjs`
.item {
  cursor: pointer;
  transition: background-color .5s ease;
}
.item:hover {
  background-color: rgba(0, 0, 0, 0.2)
}
.actions {
  text-align: right;
}
.actions button:first-child {
  float: left;
}`

const SelectType = ({location, proximity}) => (
  <ul className='mdl-list'>
    <li className={`mdl-list__item ${style.item}`} onClick={location}>
      <span className='mdl-list__item-primary-content'>
        <i className='material-icons mdl-list__item-icon'>location_on</i>
        <Message>locationCriteria</Message>
      </span>
    </li>
    <li className={`mdl-list__item ${style.item}`} onClick={proximity}>
      <span className='mdl-list__item-primary-content'>
        <i className='material-icons mdl-list__item-icon'>location_city</i>
        <Message>proximityCriteria</Message>
      </span>
    </li>
  </ul>
)

SelectType.displayName = 'Select-Type'
SelectType.propTypes = {
  location: PropTypes.func.isRequired,
  proximity: PropTypes.func.isRequired
}

class CreateGeoCriteria extends React.PureComponent {
  static displayName = 'Create-Geo-Criteria'

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    save: PropTypes.func.isRequired,
    cancel: PropTypes.func.isRequired
  }

  state = {
    type: null
  }

  selectLocation = () => {
    this.setState({
      draft: true,
      type: 'LOCATION',
      unit: 'KILOMETERS',
      radius: 5
    })
  }

  selectProximity = () => {
    this.setState({
      id: Math.random().toString(36).substr(2),
      draft: true,
      type: 'PROXIMITY',
      unit: 'KILOMETERS',
      radius: 5
    })
  }

  update = (changes) => {
    this.setState(changes)
  }

  close = () => {
    this.props.save(this.state)
  }

  render () {
    const {lat, lng, type, name} = this.state

    let size
    let content

    switch (type) {
      case 'LOCATION':
        size = 'small'
        content = <h5>bad</h5>
        break
      case 'PROXIMITY':
        size = 'large'
        content = (
          <Proximity
            {...this.state}
            close={this.props.save}
            update={this.update}/>
        )
        break
      default:
        size = 'small'
        content = (
          <SelectType
            location={this.selectLocation}
            proximity={this.selectProximity}/>
        )
    }

    return (
      <Modal size={size} minHeight={0}>
        {content}

        <div className={style.actions}>
          <Button className='mdl-button mdl-button--raised' onClick={this.props.cancel}>
            <Message>cancel</Message>
          </Button>

          {name || (isNumber(lat) && (isNumber(lng))) ? (
            <Button className='mdl-button mdl-button--raised' onClick={this.close}>
              <Message>save</Message>
            </Button>) : null}
        </div>

      </Modal>
    )
  }
}

export default styledComponent(CreateGeoCriteria, style)
