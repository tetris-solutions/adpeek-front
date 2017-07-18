import React from 'react'
import PropTypes from 'prop-types'
import Modal from 'tetris-iso/Modal'
import Message from 'tetris-iso/Message'
import {Button} from '../../../Button'
import {style} from '../style'
import {styledComponent} from '../../../higher-order/styled'
import CreateConversionTracker from './Form'
import map from 'lodash/map'
import camelCase from 'lodash/camelCase'
import PresetsSelector from './PresetsSelector'

class EditLocations extends React.PureComponent {
  static displayName = 'Edit-Locations'

  static propTypes = {
    cancel: PropTypes.func,
    reload: PropTypes.func,
    campaign: PropTypes.object,
    onSubmit: PropTypes.func,
    params: PropTypes.object,
    dispatch: PropTypes.func
  }

  static contextTypes = {
    messages: PropTypes.object
  }

  state = {
    openModal: false,
    presets: null
  }

  openModal = () => {
    this.setState({
      openModal: true
    })
  }

  closeModal = () => {
    this.setState({
      presets: null,
      openModal: false
    })
  }

  onCreate = () => {
    return this.props.reload()
      .then(this.closeModal)
  }

  setConversionPresets = presets => {
    this.setState({presets})
  }

  render () {
    const {presets, openModal} = this.state

    return (
      <div>
        <div className='mdl-grid'>
          <div className='mdl-cell mdl-cell--12-col'>
            <div className={style.list}>
              <table className={`mdl-data-table ${style.table}`}>
                <thead>
                  <tr>
                    <th className='mdl-data-table__cell--non-numeric'>
                      <Message>nameLabel</Message>
                    </th>
                    <th className='mdl-data-table__cell--non-numeric'>
                      <Message>conversionCategoryLabel</Message>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {map(this.props.campaign.details.conversionTracker,
                    ({id, name, category}) => (
                      <tr key={id}>
                        <td className='mdl-data-table__cell--non-numeric'>
                          {name}
                        </td>
                        <td className='mdl-data-table__cell--non-numeric'>
                          {this.context.messages[`${camelCase(category)}Conversion`]}
                        </td>
                      </tr>))}
                </tbody>
              </table>
            </div>
          </div>

          {openModal && (
            <Modal size='medium' onEscPress={this.cancelCreation}>
              {presets ? (
                <CreateConversionTracker
                  {...this.props}
                  {...presets}
                  cancel={this.cancelCreation}
                  onSubmit={this.onCreate}/>
              ) : (
                <PresetsSelector
                  save={this.setConversionPresets}/>
              )}
            </Modal>)}
        </div>
        <div className={style.actions}>
          <Button className='mdl-button mdl-button--raised' onClick={this.props.cancel}>
            <Message>close</Message>
          </Button>

          <Button className='mdl-button mdl-button--raised' onClick={this.openModal}>
            <Message>newConversionTracker</Message>
          </Button>
        </div>
      </div>
    )
  }
}

export default styledComponent(EditLocations, style)
