import React from 'react'
import {Tabs, Tab} from './Tabs'
import Form from './ReportModuleForm'

const {PropTypes} = React

function ReportModuleEdit (props, {messages: {moduleContent, moduleSize}}) {
  return (
    <Tabs>
      <Tab id='module-content' title={moduleContent}>
        <Form {...props}/>
      </Tab>
      <Tab id='module-size' title={moduleSize}>
        <div>
          <h3>NOPE</h3>
          <img src='http://vignette1.wikia.nocookie.net/meme/images/8/8e/Nope.jpg/revision/latest?cb=20110913050049'/>
        </div>
      </Tab>
    </Tabs>
  )
}

ReportModuleEdit.contextTypes = {
  messages: PropTypes.object
}

export default ReportModuleEdit
