import React from 'react'
import AdGroup from './AdGroup'
import map from 'lodash/map'
import csjs from 'csjs'
import {styled} from './mixins/styled'
import size from 'lodash/size'

const isBrowser = typeof window !== 'undefined'
const style = csjs`
.wrapper {
  overflow: auto;
}
.grid {
  display: flex;
}
.column {
  flex: 1;
  overflow: hidden;
  padding: 10px 10px 0 10px;
}`

const {PropTypes} = React

/**
 * fits scrollable wrapper in screen
 * @param {HTMLDivElement} wrapper div
 * @return {undefined}
 */
function fitWrapper (wrapper) {
  const rect = wrapper.getBoundingClientRect()
  wrapper.style.height = (window.innerHeight - rect.top - 20) + 'px'
}

export const AdGroups = React.createClass({
  displayName: '-AdGroups',
  mixins: [styled(style)],
  propTypes: {
    adGroups: PropTypes.array
  },
  componentWillUnmount () {
    this.dead = true
  },
  componentDidMount () {
    fitWrapper(this.refs.wrapper)
  },
  render () {
    const {adGroups} = this.props
    const gridStyle = {}

    if (isBrowser) {
      gridStyle.width = (size(adGroups) * 300) + 20
    }

    return (
      <section className='mdl-grid'>
        <div className='mdl-cell mdl-cell--12-col'>
          <div ref='wrapper' className={`${style.wrapper}`}>
            <div className={`${style.grid}`} ref='grid' style={gridStyle}>
              {map(adGroups, adGroup => (
                <div key={adGroup.id} className={`${style.column}`}>
                  <AdGroup {...adGroup}/>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }
})

export default AdGroups
