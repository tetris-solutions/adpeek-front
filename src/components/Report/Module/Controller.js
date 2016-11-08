import assign from 'lodash/assign'
import debounce from 'lodash/debounce'
import pick from 'lodash/pick'
import React from 'react'
import moduleType from '../../../propTypes/report-module'
import reportEntityType from '../../../propTypes/report-entity'
import reportMetaDataType from '../../../propTypes/report-meta-data'
import reportParamsType from '../../../propTypes/report-params'
import ReportModule from '../../ReportModule'
import {deleteModuleAction} from '../../../actions/delete-module'
import {loadReportModuleResultAction} from '../../../actions/load-report-module-result'
import {updateModuleAction} from '../../../actions/update-module'
import Editor from './Editor'
import Modal from 'tetris-iso/Modal'
import DeleteButton from '../../DeleteButton'
import isEmpty from 'lodash/isEmpty'

const {PropTypes} = React

const ReportModuleController = React.createClass({
  displayName: 'Report-Module-Controller',
  propTypes: {
    changeDateRange: PropTypes.func.isRequired,
    remove: PropTypes.func,
    update: PropTypes.func,
    module: moduleType.isRequired,
    editable: PropTypes.bool.isRequired,
    metaData: reportMetaDataType.isRequired,
    entity: reportEntityType.isRequired,
    entities: PropTypes.arrayOf(reportEntityType).isRequired,
    reportParams: reportParamsType.isRequired
  },
  contextTypes: {
    tree: PropTypes.object,
    params: PropTypes.object,
    messages: PropTypes.object
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
      this.props.metaData.attributes)
  },
  getChartQuery () {
    const {reportParams} = this.props
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
    const {module, editable, metaData, entities, entity, reportParams, changeDateRange} = this.props
    const update = editable ? this.save : undefined
    const remove = editable ? this.remove : undefined

    return (
      <ReportModule {...this.props} update={update} remove={remove}>
        <div className='mdl-card__menu'>
          {update && (
            <button className='mdl-button mdl-button--icon' onClick={this.openModal}>
              <i className='material-icons'>create</i>
            </button>)}

          {remove && (
            <DeleteButton
              className='mdl-button mdl-button--icon'
              onClick={remove}
              entityName={module.name || this.context.messages.untitledModule}>
              <i className='material-icons'>clear</i>
            </DeleteButton>)}
        </div>

        {this.state.editMode && (
          <Modal size='huge'>
            <Editor
              changeDateRange={changeDateRange}
              entities={entities}
              metaData={metaData}
              module={module}
              entity={entity}
              reportParams={reportParams}
              save={update}
              close={this.closeModal}/>
          </Modal>
        )}

      </ReportModule>
    )
  }
})

export default ReportModuleController
