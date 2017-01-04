import debounce from 'lodash/debounce'
import map from 'lodash/map'
import uniq from 'lodash/uniq'
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
import filter from 'lodash/filter'
import includes from 'lodash/includes'
import {Button} from '../../Button'
import Comments from './Comments'
import CroppedResultDialog from './CroppedResultDialog'
import TextMessage from 'intl-messageformat'
import DescriptionDialog from './DescriptionDialog'

const reportContext = [
  'report',
  'reportParams',
  'entities',
  'changeDateRange',
  'entity',
  'attributes',
  'module',
  'activeOnly',
  'toggleActiveOnly',
  'getUsedAccounts'
]

const getAccountKeyFromId = id => id.substr(0, id.lastIndexOf(':'))

const ModuleController = React.createClass({
  displayName: 'Module-Controller',
  propTypes: {
    params: React.PropTypes.object.isRequired,
    dispatch: React.PropTypes.func.isRequired,
    editable: React.PropTypes.bool,
    clone: React.PropTypes.func.isRequired,
    module: moduleType.isRequired,
    attributes: React.PropTypes.object.isRequired,
    entity: reportEntityType.isRequired,
    editMode: React.PropTypes.bool.isRequired
  },
  contextTypes: {
    messages: React.PropTypes.object.isRequired,
    locales: React.PropTypes.string.isRequired,
    report: React.PropTypes.object.isRequired,
    reportParams: reportParamsType.isRequired
  },
  childContextTypes: {
    entity: reportEntityType,
    attributes: React.PropTypes.object,
    module: React.PropTypes.object,
    getUsedAccounts: React.PropTypes.func
  },
  getChildContext () {
    return {
      entity: this.props.entity,
      attributes: this.props.attributes,
      module: this.props.module,
      getUsedAccounts: this.getUsedAccounts
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
  componentWillReceiveProps (nextProps) {
    if (nextProps.editMode && !this.props.editMode) {
      this.openModal()
    }
  },
  componentDidUpdate () {
    this.fetchResult(this.getChartQuery())
  },
  startResultLoadingAction (query) {
    if (!query) return

    const {params, dispatch, module, attributes} = this.props

    return dispatch(loadReportModuleResultAction, params, module.id, query, attributes)
  },
  getChartQuery () {
    const {reportParams} = this.context
    const {module, entity} = this.props

    return {
      metrics: module.metrics,
      dimensions: module.dimensions,
      sort: module.sort,
      to: reportParams.to,
      from: reportParams.from,
      accounts: this.getUsedAccounts(module.filters.id),
      filters: module.filters,
      entity: entity.id
    }
  },
  getUsedAccounts (ids) {
    const {report: {platform}, reportParams: {accounts}} = this.context

    if (platform) {
      return accounts
    }

    const usedAccountKeys = uniq(map(ids, getAccountKeyFromId))

    return filter(accounts, ({id}) => includes(usedAccountKeys, id))
  },
  remove () {
    const {params, dispatch, module} = this.props

    return dispatch(deleteModuleAction, params, module.id)
  },
  save (moduleChanges, persistChanges) {
    const {params, dispatch, module} = this.props

    return dispatch(updateModuleAction, params, module.id, moduleChanges, persistChanges)
  },
  clone () {
    const {module} = this.props
    const {messages: {copyOfName}, locales} = this.context
    const name = new TextMessage(copyOfName, locales).format({name: module.name})

    this.props.clone(module.id, name)
  },
  openModal () {
    this.setState({editMode: true})
  },
  closeModal () {
    this.setState({editMode: false})
  },
  render () {
    const {params, dispatch, module, editable} = this.props
    const {messages: {untitledModule: defaultName, cloneModule: cloneLabel}} = this.context

    return (
      <ModuleCard>
        <div className='mdl-card__menu'>
          {module.cropped &&
          <CroppedResultDialog
            size={module.cropped.size}
            module={module.name}/>}

          {module.description && <DescriptionDialog module={module}/>}

          <Comments {...{dispatch, module, params}}/>

          {editable &&

          <Button className='mdl-button mdl-button--icon' title={cloneLabel} onClick={this.clone}>
            <i className='material-icons'>content_copy</i>
          </Button>}

          {editable &&

          <Button className='mdl-button mdl-button--icon' onClick={this.openModal}>
            <i className='material-icons'>create</i>
          </Button>}

          {editable &&

          <DeleteButton
            className='mdl-button mdl-button--icon'
            onClick={this.remove}
            entityName={module.name || defaultName}>
            <i className='material-icons'>clear</i>
          </DeleteButton>}
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
