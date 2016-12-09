import React from 'react'
import Modal from 'tetris-iso/Modal'
import {contextualize} from '../higher-order/contextualize'
import {inferLevelFromParams} from '../../functions/infer-level-from-params'

const {PropTypes} = React

const List = ({mailings}) => (
  <pre>{JSON.stringify(mailings, null, 2)}</pre>
)

List.displayName = 'List'
List.propTypes = {
  mailings: PropTypes.array
}

const StandaloneMailingList = props => <List mailings={props[props.level].mailings}/>

StandaloneMailingList.displayName = 'Mailing-List'
StandaloneMailingList.propTypes = {
  level: PropTypes.string.isRequired
}

const ReportMailingList = ({report: {mailings}}) => (
  <div style={{display: 'none'}}>
    <Modal>
      <List mailings={mailings}/>
    </Modal>
  </div>
)

ReportMailingList.displayName = 'Report-Mailing-List'
ReportMailingList.propTypes = {
  report: PropTypes.shape({
    mailings: PropTypes.array
  })
}

const wired = {
  company: contextualize(StandaloneMailingList, 'company'),
  workspace: contextualize(StandaloneMailingList, 'workspace'),
  folder: contextualize(StandaloneMailingList, 'folder'),
  report: contextualize(ReportMailingList, 'report')
}

const Mailing = props => {
  const level = props.params.report
    ? 'report'
    : inferLevelFromParams(props.params)

  const Component = wired[level]

  return <Component {...props} level={level}/>
}

Mailing.displayName = 'Mailing'
Mailing.propTypes = {
  params: PropTypes.object
}

export default Mailing
