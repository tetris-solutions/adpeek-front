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
    openModal: false
  }

  toggleModal = () => {
    this.setState({openModal: !this.state.openModal})
  }

  onCreate = () => {
    return this.props.reload()
      .then(this.toggleModal)
  }

  render () {
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

          {this.state.openModal && (
            <Modal size='medium' onEscPress={this.toggleModal}>
              <CreateConversionTracker
                {...this.props}
                categories={['DEFAULT', 'PAGE_VIEW', 'PURCHASE', 'SIGNUP', 'LEAD']}
                cancel={this.toggleModal}
                onSubmit={this.onCreate}/>
            </Modal>)}
        </div>
        <div className={style.actions}>
          <Button className='mdl-button mdl-button--raised' onClick={this.props.cancel}>
            <Message>close</Message>
          </Button>

          <Button className='mdl-button mdl-button--raised' onClick={this.toggleModal}>
            <Message>newConversionTracker</Message>
          </Button>
        </div>
      </div>
    )
  }
}

export default styledComponent(EditLocations, style)
