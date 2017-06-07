import React from 'react'
import PropTypes from 'prop-types'
import AdGroup from './AdGroup'
import map from 'lodash/map'
import csjs from 'csjs'
import {styledComponent} from '../higher-order/styled'
import size from 'lodash/size'

const isBrowser = typeof window !== 'undefined'
const style = csjs`
.wrapper {
  overflow: auto;
  background: white
}
.grid {
  display: flex;
}
.column {
  flex: 1;
  overflow: hidden;
  padding: 10px 10px 0 10px;
}`

/**
 * fits scrollable wrapper in screen
 * @param {HTMLDivElement} wrapper div
 * @return {undefined}
 */
function fitWrapper (wrapper) {
  const rect = wrapper.getBoundingClientRect()
  wrapper.style.height = (window.innerHeight - rect.top - 20) + 'px'
}

class AdGroups extends React.PureComponent {
  static displayName = 'AdGroups'

  static propTypes = {
    adGroups: PropTypes.array,
    createAdGroup: PropTypes.func
  }

  static defaultProps = {
    adGroups: []
  }

  componentDidMount () {
    fitWrapper(this.refs.wrapper)

    window.event$.on('create::adgroup', this.createAdGroup)
  }

  componentWillUnmount () {
    window.event$.off('create::adgroup', this.createAdGroup)
  }

  createAdGroup = () => {
    this.props.createAdGroup()

    setTimeout(() => {
      const container = this.refs.wrapper

      container.scrollLeft = container.scrollWidth - container.clientWidth
    }, 500)
  }

  render () {
    const {adGroups} = this.props
    const gridStyle = {}

    if (isBrowser) {
      gridStyle.width = (size(adGroups) * 300) + 20
    }

    return (
      <section className='mdl-grid'>
        <div className='mdl-cell mdl-cell--12-col'>
          <div ref='wrapper' className={style.wrapper}>
            <div className={style.grid} ref='grid' style={gridStyle}>
              {map(adGroups, ({id}) => (
                <div key={id} className={style.column}>
                  <AdGroup params={{adGroup: id}}/>
                </div>))}
            </div>
          </div>
        </div>
      </section>
    )
  }
}

export default styledComponent(AdGroups, style)
