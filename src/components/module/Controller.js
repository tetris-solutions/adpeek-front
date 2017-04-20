import debounce from 'lodash/debounce'
import map from 'lodash/map'
import uniq from 'lodash/uniq'
import React from 'react'
import PropTypes from 'prop-types'
import moduleType from '../../propTypes/report-module'
import reportEntityType from '../../propTypes/report-entity'
import reportParamsType from '../../propTypes/report-params'
import ModuleCard from './Card'
import {deleteModuleAction} from '../../actions/delete-module'
import {loadReportModuleResultAction} from '../../actions/load-report-module-result'
import {updateModuleAction} from '../../actions/update-module'
import Editor from './editor/Controller'
import Modal from 'tetris-iso/Modal'
import DeleteButton from '../DeleteButton'
import isEmpty from 'lodash/isEmpty'
import filter from 'lodash/filter'
import includes from 'lodash/includes'
import {Button} from '../Button'
import Comments from './Comments'
import CroppedResultDialog from './CroppedResultDialog'
import TextMessage from 'intl-messageformat'
import DescriptionDialog from './DescriptionDialog'
import log from 'loglevel'

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

class ModuleController extends React.Component {
  static displayName = 'Module-Controller'

  static propTypes = {
    loadEntity: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    editable: PropTypes.bool,
    clone: PropTypes.func.isRequired,
    module: moduleType.isRequired,
    attributes: PropTypes.object.isRequired,
    entity: reportEntityType.isRequired,
    editMode: PropTypes.bool.isRequired
  }

  static contextTypes = {
    messages: PropTypes.object.isRequired,
    locales: PropTypes.string.isRequired,
    report: PropTypes.object.isRequired,
    reportParams: reportParamsType.isRequired
  }

  static childContextTypes = {
    entity: reportEntityType,
    attributes: PropTypes.object,
    module: PropTypes.object,
    getUsedAccounts: PropTypes.func
  }

  state = {
    editMode: (
      Boolean(this.props.editable) &&
      isEmpty(this.props.module.metrics)
    )
  }

  getChildContext () {
    return {
      entity: this.props.entity,
      attributes: this.props.attributes,
      module: this.props.module,
      getUsedAccounts: this.getUsedAccounts
    }
  }

  componentDidMount () {
    this.fetchResult = debounce(this.startResultLoadingAction, 1000)
    this.fetchResult(this.getChartQuery())
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.editMode && !this.props.editMode) {
      this.openModal()
    }
  }

  componentDidUpdate () {
    this.fetchResult(this.getChartQuery())
  }

  startResultLoadingAction = (query) => {
    if (!query) {
      return
    }

    const {params, dispatch, module, attributes} = this.props

    return dispatch(loadReportModuleResultAction, params, module.id, query, attributes)
  }

  getChartQuery = () => {
    const {reportParams} = this.context
    const {module, entity} = this.props

    const query = {
      metrics: module.metrics,
      dimensions: module.dimensions,
      sort: module.sort,
      to: reportParams.to,
      from: reportParams.from,
      accounts: this.getUsedAccounts(module.filters.id),
      filters: module.filters,
      entity: entity.id
    }

    const $query = JSON.stringify(query)

    if ($query !== this.$query) {
      this.$query = $query
      this.rawQuery = query
      log.info(`${module.name} has a new query`)
    } else {
      log.debug(`${module.name} skipped a query change`)
    }

    return this.rawQuery
  }

  getUsedAccounts = (ids) => {
    const {report: {platform}, reportParams: {accounts}} = this.context

    if (platform === this.$platform && accounts === this.$accounts) {
      log.debug(`${this.props.module.name} skipped account change`)
      return this.$usedAccounts
    }

    log.info(`${this.props.module.name} is updating accounts`)

    this.$platform = platform
    this.$accounts = accounts

    if (platform) {
      this.$usedAccounts = accounts
    } else {
      const usedAccountKeys = uniq(map(ids, getAccountKeyFromId))
      this.$usedAccounts = filter(accounts, ({id}) => includes(usedAccountKeys, id))
    }

    return this.$usedAccounts
  }

  remove = () => {
    const {params, dispatch, module} = this.props

    return dispatch(deleteModuleAction, params, module.id)
  }

  save = (moduleChanges, persistChanges) => {
    const {params, dispatch, module} = this.props

    return dispatch(updateModuleAction, params, module.id, moduleChanges, persistChanges)
  }

  clone = () => {
    const {module} = this.props
    const {messages: {copyOfName}, locales} = this.context
    const name = new TextMessage(copyOfName, locales).format({name: module.name})

    this.props.clone(module.id, name)
  }

  openModal = () => {
    this.setState({editMode: true})
  }

  closeModal = () => {
    this.setState({editMode: false})
  }

  render () {
    const {params, dispatch, module, editable, loadEntity} = this.props
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
            <Editor loadEntity={loadEntity} save={this.save} close={this.closeModal}/>
          </Modal>
        )}

      </ModuleCard>
    )
  }
}

export default ModuleController
