import React from 'react'
import PropTypes from 'prop-types'
import Message from 'tetris-iso/Message'
import map from 'lodash/map'
import Form from '../../../Form'
import {Button, Submit} from '../../../Button'
import {style} from '../style'
import {styledComponent} from '../../../higher-order/styled'

class EditPlatform extends React.PureComponent {
  static displayName = 'Edit-Platform'

  static propTypes = {
    cancel: PropTypes.func,
    campaign: PropTypes.object,
    onSubmit: PropTypes.func,
    params: PropTypes.object,
    dispatch: PropTypes.func
  }

  state = {}

  save = () => {
  }

  render () {
    const {locations} = this.props.campaign.details

    return (
      <Form onSubmit={this.save}>
        <div className={style.list}>
          <table className={`mdl-data-table ${style.table}`}>
            <thead>
              <tr>
                <th className='mdl-data-table__cell--non-numeric'>
                  BusinessName
                </th>
                <th className='mdl-data-table__cell--non-numeric'>
                  AddressLine1
                </th>
                <th className='mdl-data-table__cell--non-numeric'>
                  City
                </th>
                <th>
                  PhoneNumber
                </th>
              </tr>
            </thead>
            <tbody>{map(locations, l =>
              <tr key={l.feedItemId}>
                <td className='mdl-data-table__cell--non-numeric'>
                  {l.businessName}
                </td>
                <td className='mdl-data-table__cell--non-numeric'>
                  {l.addressLine1}
                </td>
                <td className='mdl-data-table__cell--non-numeric'>
                  {l.city}
                </td>
                <td>
                  {l.phoneNumber}
                </td>
              </tr>)}
            </tbody>
          </table>
        </div>
        <div className={style.actions}>
          <Button className='mdl-button mdl-button--raised' onClick={this.props.cancel}>
            <Message>cancel</Message>
          </Button>

          <Submit className='mdl-button mdl-button--raised mdl-button--colored'>
            <Message>save</Message>
          </Submit>
        </div>
      </Form>
    )
  }
}

export default styledComponent(EditPlatform, style)
