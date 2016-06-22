import React from 'react'
import {branch} from 'baobab-react/higher-order'
import {loadUserCompaniesAction} from '@tetris/front-server/lib/actions/load-user-companies-action'
import map from 'lodash/map'
import Highcharts from './Highcharts'

function fmtPoint () {
  return (this.value / 1000) + 'k'
}

const {PropTypes} = React
const fakeSeries = [{
  id: 'adwords',
  name: 'Adwords',
  color: 'green',
  data: [null, null, null, null, null, 6, 11, 32, 110, 235, 369, 640,
    1005, 1436, 2063, 3057, 4618, 6444, 9822, 15468, 20434, 24126,
    27387, 29459, 31056, 31982, 32040, 31233, 29224, 27342, 26662,
    26956, 27912, 28999, 28965, 27826, 25579, 25722, 24826, 24605,
    24304, 23464, 23708, 24099, 24357, 24237, 24401, 24344, 23586,
    22380, 21004, 17287, 14747, 13076, 12555, 12144, 11009, 10950,
    10871, 10824, 10577, 10527, 10475, 10421, 10358, 10295, 10104]
}, {
  id: 'facebook',
  name: 'Facebook',
  data: [null, null, null, null, null, null, null, null, null, null,
    5, 25, 50, 120, 150, 200, 426, 660, 869, 1060, 1605, 2471, 3322,
    4238, 5221, 6129, 7089, 8339, 9399, 10538, 11643, 13092, 14478,
    15915, 17385, 19055, 21205, 23044, 25393, 27935, 30062, 32049,
    33952, 35804, 37431, 39197, 45000, 43000, 41000, 39000, 37000,
    35000, 33000, 31000, 29000, 27000, 25000, 24000, 23000, 22000,
    21000, 20000, 19000, 18000, 18000, 17000, 16000]
}]

const Home = React.createClass({
  propTypes: {
    user: PropTypes.shape({
      companies: PropTypes.array
    }),
    dispatch: PropTypes.func
  },
  componentWillMount () {
    const {user, dispatch} = this.props
    if (!user) return

    dispatch(loadUserCompaniesAction)
  },
  render () {
    const {user} = this.props
    let headerNav
    if (user) {
      headerNav = map(user.companies,
        ({id, name}) => (
          <a key={id} className='mdl-navigation__link' href={`/company/${id}`}>
            {name}
          </a>
        ))
    } else {
      const {FRONT_URL, ADPEEK_URL} = process.env
      headerNav = (
        <a className='mdl-navigation__link' href={`${FRONT_URL}/login?next=${ADPEEK_URL}`}>
          Login
        </a>
      )
    }

    return (
      <div className='mdl-layout mdl-layout--fixed-header'>
        <header className='mdl-layout__header'>
          <div className='mdl-layout__header-row mdl-color--blue-grey-500'>
            <span className='mdl-layout-title'>Adpeek</span>
            <div className='mdl-layout-spacer'/>
            <nav className='mdl-navigation mdl-layout--large-screen-only'>
              {headerNav}
            </nav>
          </div>
        </header>
        <main className='mdl-layout__content'>
          <div className='page-content'>

            <Highcharts style={{margin: '1em auto', width: '80%', height: '500px'}}>
              <credits enabled={false}/>
              <title>Adwords vs Facebook</title>
              <tooltip>
                <point-format>{'{series.name} produced <b>{point.y:,.0f}</b><br/>warheads in {point.x}'}</point-format>
              </tooltip>
              <y-axis>
                <title>Conversion rate</title>
                <labels formater={fmtPoint}/>
              </y-axis>

              <plot-options>
                <area pointStart={1940}>
                  <marker enabled symbol='circle' radius={2}>
                    <states>
                      <hover enabled/>
                    </states>
                  </marker>
                </area>
              </plot-options>

              {map(fakeSeries, ({id, name, data, color}, index) => (
                <area id={id} key={index} name={name} color={color}>
                  {map(data, (y, index) => (
                    <point index={index} y={y}/>
                  ))}
                </area>
              ))}

            </Highcharts>
          </div>
        </main>
        <div className='mdl-layout__obfuscator'/>
      </div>
    )
  }
})

export default branch({
  user: ['user']
}, Home)
