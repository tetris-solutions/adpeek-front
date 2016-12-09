import React from 'react'

const {PropTypes} = React
const ranges = [
  'today',
  'yesterday',
  'last week',
  'last 30 days',
  'this month'
]

const MailingEdit = React.createClass({
  propTypes: {
    mailing: PropTypes.shape({
      id: PropTypes.string,
      date_range: PropTypes.oneOf(ranges),
      disabled: PropTypes.bool,
      schedule: PropTypes.shape({
        id: PropTypes.string,
        day_of_week: PropTypes.number,
        day_of_month: PropTypes.number,
        timestamp: PropTypes.string
      }),
      report: PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string
      }),
      workspace: PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string
      }),
      folder: PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string
      })
    })
  },
  render () {
    const {mailing} = this.props

    if (!mailing) {
      return (
        <p className='mdl-color--red mdl-color-text--white'>
          Not found!
        </p>
      )
    }

    return (
      <pre>
        {JSON.stringify(mailing, null, 2)}
      </pre>
    )
  }
})

export default MailingEdit
