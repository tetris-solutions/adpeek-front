import React from 'react'
import debounce from 'lodash/debounce'
import {styled} from '../../../mixins/styled'
import csjs from 'csjs'

const style = csjs`
.text {
  width: 100%;
}
.text > textarea {
  height: 70vh;
}`

const Description = React.createClass({
  displayName: 'Description',
  mixins: [styled(style)],
  contextTypes: {
    draft: React.PropTypes.object.isRequired,
    change: React.PropTypes.func.isRequired,
    messages: React.PropTypes.object.isRequired
  },
  componentWillMount () {
    this.setState({
      description: this.savedDescription() || ''
    })
  },
  componentDidMount () {
    this.save = debounce(() => {
      this.context.change({
        description: this.state.description
      })
    }, 1000)
  },
  savedDescription () {
    return this.context.draft.module.description
  },
  onChange ({target: {value}}) {
    this.setState({
      description: value
    }, this.save)
  },
  render () {
    return (
      <div className='mdl-grid'>
        <div className='mdl-cell mdl-cell--12-col'>
          <div className='mdl-cell mdl-cell--12-col'>
            <div className={`mdl-textfield ${style.text}`}>
              <textarea
                placeholder={this.context.messages.moduleDescriptionPlaceholder}
                value={this.state.description}
                onChange={this.onChange}
                className='mdl-textfield__input'
                name='description'/>
            </div>
          </div>
        </div>
      </div>
    )
  }
})

export default Description
