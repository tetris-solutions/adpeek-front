import React from 'react'
import csjs from 'csjs'
import Message from 'tetris-iso/Message'
import DateRangeButton from '../../DateRange'
import Lists from './Lists'
import Size from './Size'
import Filters from './Filters'
import Preview from './Preview'
import {Tabs, Tab} from '../../../Tabs'
import {styled} from '../../../mixins/styled'

const style = csjs`
.leftCol {
  height: calc(80vh + 40px);
  overflow-y: auto;
}
.rightButtons {
  float: right;
  margin-right: 1em
}`
const {PropTypes} = React

const Editor = React.createClass({
  displayName: 'Editor',
  mixins: [styled(style)],
  contextTypes: {
    draft: PropTypes.object.isRequired,
    messages: PropTypes.object.isRequired
  },
  propTypes: {
    isInvalid: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    save: PropTypes.func.isRequired,
    cancel: PropTypes.func.isRequired
  },
  render () {
    const {isLoading, isInvalid, save, cancel} = this.props
    const {messages, draft, update} = this.context

    return (
      <div>
        <form className='mdl-grid'>
          <div className={`mdl-cell mdl-cell--3-col ${style.leftCol}`}>
            <Lists />
          </div>
          <div className='mdl-cell mdl-cell--9-col'>
            <Tabs>
              <Tab id='module-content' title={messages.moduleContent}>
                <Preview />
              </Tab>
              <Tab id='module-size' title={messages.moduleSize}>
                <br/>
                <Size />
              </Tab>
              <Tab id='module-filters' title={messages.filterModuleResult}>
                <Filters />
              </Tab>
            </Tabs>
          </div>
        </form>

        <a className='mdl-button' onClick={cancel}>
          <Message>cancel</Message>
        </a>

        <button disabled={isInvalid} type='button' className='mdl-button' onClick={update}>
          <Message>save</Message>
        </button>

        <span className={`${style.rightButtons}`}>
          {isInvalid ? (
            <em className='mdl-color-text--red-A700'>
              <Message entity={draft.entity.name}>invalidModuleConfig</Message>
            </em>
          ) : (
            <button disabled={isLoading} type='button' className='mdl-button' onClick={save}>
              <Message>update</Message>
            </button>
          )}

          <DateRangeButton className='mdl-button'/>
        </span>
      </div>
    )
  }
})

export default Editor
