import React from 'react'

import Form from './ReportModuleEditForm'
import Sizing from './ReportModuleSizing'
import {Tabs, Tab} from './Tabs'

const {PropTypes} = React

function ReportModuleEdit (props, {messages: {moduleContent, moduleSize}}) {
  return (
    <Tabs>
      <Tab id='module-content' title={moduleContent}>
        <Form {...props}/>
      </Tab>
      <Tab id='module-size' title={moduleSize}>
        <Sizing {...props} />
      </Tab>
    </Tabs>
  )
}

ReportModuleEdit.contextTypes = {
  messages: PropTypes.object
}

export default ReportModuleEdit
