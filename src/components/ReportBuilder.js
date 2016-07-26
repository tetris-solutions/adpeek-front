import React from 'react'
import Message from '@tetris/front-server/lib/components/intl/Message'
import moment from 'moment'
import ReportDateRange from './ReportDateRange'
import map from 'lodash/map'
import Module from './ReportModule'
import uuid from 'uuid'
import assign from 'lodash/assign'
import size from 'lodash/size'

const {PropTypes} = React

const ReportBuilder = React.createClass({
  displayName: 'Report-Builder',
  propTypes: {
    reportParams: PropTypes.shape({
      ad_account: PropTypes.string,
      plaftorm: PropTypes.string,
      tetris_account: PropTypes.string
    }),
    entity: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      list: PropTypes.array
    }).isRequired
  },
  contextTypes: {
    messages: PropTypes.object
  },
  getInitialState () {
    return {
      startDate: moment().startOf('week').subtract(7, 'days'),
      endDate: moment().startOf('week').subtract(1, 'days')
    }
  },
  componentWillMount () {
    this.setState({
      modules: [this.getNewModule()]
    })
  },
  getNewModule () {
    const {messages} = this.context

    return {
      id: uuid.v4(),
      type: 'line',
      name: messages.module + ' ' + (size(this.state.modules) + 1),
      metrics: [],
      dimensions: [],
      filters: {
        id: []
      }
    }
  },
  onChangeRange ({startDate, endDate}) {
    this.setState({startDate, endDate})
  },
  addNewModule () {
    this.setState({
      modules: this.state.modules.concat([this.getNewModule()])
    })
  },
  updateModule (id, updatedModule) {
    this.setState({
      modules: this.state.modules
        .map(m => m.id === id
          ? assign({}, m, updatedModule)
          : m)
    })
  },
  removeModule (id) {
    this.setState({
      modules: this.state.modules.filter(m => m.id !== id)
    })
  },
  render () {
    const {modules, startDate, endDate} = this.state
    const reportParams = assign({
      from: startDate.format('YYYY-MM-DD'),
      to: endDate.format('YYYY-MM-DD')
    }, this.props.reportParams)

    return (
      <div>
        <header className='mdl-layout__header'>
          <div className='mdl-layout__header-row mdl-color--blue-grey-500'>
            <ReportDateRange
              onChange={this.onChangeRange}
              startDate={startDate}
              endDate={endDate}/>

            <div className='mdl-layout-spacer'/>

            <button className='mdl-button mdl-color-text--grey-100' onClick={this.addNewModule}>
              <Message>newModule</Message>
            </button>
          </div>
        </header>
        <div className='mdl-grid'>
          {map(modules, module => (
            <div key={module.id} className='mdl-cell mdl-cell--4-col'>
              <Module
                module={module}
                editable
                reportParams={reportParams}
                entity={this.props.entity}
                update={this.updateModule}
                remove={this.removeModule}/>
            </div>
          ))}

        </div>
      </div>
    )
  }
})

export default ReportBuilder
