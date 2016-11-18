import assign from 'lodash/assign'
import debounce from 'lodash/debounce'
import pick from 'lodash/pick'
import React from 'react'
import moduleType from '../../../propTypes/report-module'
import reportEntityType from '../../../propTypes/report-entity'
import reportParamsType from '../../../propTypes/report-params'
import ModuleCard from './Card'
import {deleteModuleAction} from '../../../actions/delete-module'
import {loadReportModuleResultAction} from '../../../actions/load-report-module-result'
import {updateModuleAction} from '../../../actions/update-module'
import Editor from './Editor/Controller'
import Modal from 'tetris-iso/Modal'
import DeleteButton from '../../DeleteButton'
import isEmpty from 'lodash/isEmpty'

const {PropTypes} = React
const reportContext = ['report', 'reportParams', 'entities', 'changeDateRange', 'entity', 'attributes', 'module', 'activeOnly', 'toggleActiveOnly']

const ModuleController = React.createClass({
  displayName: 'Module-Controller',
  propTypes: {
    editable: PropTypes.bool,
    module: moduleType.isRequired,
    attributes: PropTypes.object.isRequired,
    entity: reportEntityType.isRequired
  },
  contextTypes: {
    tree: PropTypes.object,
    params: PropTypes.object,
    messages: PropTypes.object,
    reportParams: reportParamsType.isRequired
  },
  childContextTypes: {
    entity: reportEntityType,
    attributes: PropTypes.object,
    module: PropTypes.object
  },
  getChildContext () {
    return {
      entity: this.props.entity,
      attributes: this.props.attributes,
      module: this.props.module
    }
  },
  getInitialState () {
    return {
      editMode: (
        Boolean(this.props.editable) &&
        isEmpty(this.props.module.metrics)
      )
    }
  },
  componentDidMount () {
    this.fetchResult = debounce(this.startResultLoadingAction, 1000)
    this.fetchResult(this.getChartQuery())
  },
  componentDidUpdate () {
    this.fetchResult(this.getChartQuery())
  },
  startResultLoadingAction (query) {
    if (!query) return

    loadReportModuleResultAction(
      this.context.tree,
      this.context.params,
      this.props.module.id,
      query,
      this.props.attributes)
  },
  getChartQuery () {
    const {reportParams} = this.context
    const {module, entity} = this.props
    const filters = assign({}, module.filters)

    return assign({filters, entity: entity.id},
      pick(module, 'dimensions', 'metrics'),
      pick(reportParams, 'from', 'to', 'accounts')
    )
  },
  remove () {
    deleteModuleAction(
      this.context.tree,
      this.context.params,
      this.props.module.id
    )
  },
  save (moduleChanges, persistChanges) {
    updateModuleAction(
      this.context.tree,
      this.context.params,
      this.props.module.id,
      moduleChanges,
      persistChanges
    )
  },
  openModal () {
    this.setState({editMode: true})
  },
  closeModal () {
    this.setState({editMode: false})
  },
  render () {
    const {module: {name}, editable} = this.props

    return (
      <ModuleCard>
        <div className='mdl-card__menu'>
          {editable ? (
            <button className='mdl-button mdl-button--icon' onClick={this.openModal}>
              <i className='material-icons'>create</i>
            </button>) : null}

          {editable ? (
            <DeleteButton
              className='mdl-button mdl-button--icon'
              onClick={this.remove}
              entityName={name || this.context.messages.untitledModule}>
              <i className='material-icons'>clear</i>
            </DeleteButton>) : null}
        </div>

        {this.state.editMode && (
          <Modal size='huge' provide={reportContext}>
            <Editor save={this.save} close={this.closeModal}/>
          </Modal>
        )}

      </ModuleCard>
    )
  }
})

export default ModuleController
