import React from 'react'
import {Tabs, Tab} from './Tabs'
import Form from './ReportModuleForm'
import Sizing from './ReportModuleSizing'

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
