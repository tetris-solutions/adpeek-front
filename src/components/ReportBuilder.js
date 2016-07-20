import React from 'react'
import Message from '@tetris/front-server/lib/components/intl/Message'
import moment from 'moment'
import ReportDateRange from './ReportDateRange'
import map from 'lodash/map'
import Module from './ReportModule'
import uuid from 'uuid'
import assign from 'lodash/assign'

const {PropTypes} = React
const getNewModule = () => ({
  id: uuid.v4(),
  type: null,
  dimensions: [],
  filter: {
    id: []
  }
})

const ReportBuilder = React.createClass({
  displayName: 'Report-Builder',
  propTypes: {
    entity: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      list: PropTypes.array
    }).isRequired
  },
  getInitialState () {
    return {
      startDate: moment().startOf('week').subtract(7, 'days'),
      endDate: moment().startOf('week').subtract(1, 'days'),
      modules: [getNewModule()]
    }
  },
  onChangeRange ({startDate, endDate}) {
    this.setState({startDate, endDate})
  },
  addNewModule () {
    this.setState({
      modules: this.state.modules.concat([getNewModule()])
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
          {map(modules, m => (
            <div key={m.id} className='mdl-cell mdl-cell--4-col'>
              <Module
                {...m}
                editable
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
