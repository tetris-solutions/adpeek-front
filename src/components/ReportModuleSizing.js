import React from 'react'
import map from 'lodash/map'
import {styled} from './mixins/styled'
import csjs from 'csjs'
import reportModuleType from '../propTypes/report-module'
import Message from '@tetris/front-server/lib/components/intl/Message'

const {PropTypes} = React
const style = csjs`
.grid {
  padding-top: 0;
  padding-bottom: 0;
}
.large {
  color: rgb(170, 170, 170);
  font-size: x-large;
  width: 100%;
}
.col extends .large {
  height: 2em;
  line-height: 3em;
  text-align: center;
}
.row extends .large {
  line-height: 3em;
  text-align: right;
}
.block extends .large {
  display: block;
  line-height: 3em;
  width: 94%;
  margin: auto;
  transition: transform .3s ease;
}
.block:hover {
  transform: scale(1.1);
}`
const availableColSizes = [[4, '1/3'], [6, '1/2'], [8, '2/3'], [12, '3/3']]
const availableRowSizes = [2, 3, 4, 5, 6]

const ReportModuleSizing = React.createClass({
  displayName: 'Module-Sizing',
  mixins: [styled(style)],
  propTypes: {
    module: reportModuleType,
    save: PropTypes.func,
    close: PropTypes.func
  },
  onSelect (cols, rows) {
    return e => {
      e.preventDefault()
      this.props.save({cols, rows})
    }
  },
  render () {
    const {module} = this.props
    const getColor = (col, row) => module.cols >= col && module.rows >= row
      ? 'mdl-color--blue-grey-500'
      : 'mdl-color--blue-grey-100'

    return (
      <div>
        <div className={`mdl-grid ${style.grid}`}>
          <div className='mdl-cell mdl-cell--2-col'/>
          {map(availableColSizes, ([cols, label]) =>
            <div key={cols} className='mdl-cell mdl-cell--2-col'>
              <div className={String(style.col)}>
                <small>
                  {label}
                </small>
              </div>
            </div>
          )}
        </div>
        {map(availableRowSizes, rows =>
          <div key={rows} className={`mdl-grid ${style.grid}`}>
            <div className='mdl-cell mdl-cell--2-col'>
              <div className={String(style.row)}>
                <small>
                  {rows * 100}px
                </small>
              </div>
            </div>
            {map(availableColSizes, ([cols, label]) =>
              <div key={cols} className={'mdl-cell mdl-cell--2-col'}>
                <a href='' onClick={this.onSelect(cols, rows)} className={`${getColor(cols, rows)} ${style.block}`}>
                  &zwnj;
                </a>
              </div>
            )}
          </div>
        )}

        <br/>

        <a className='mdl-button' onClick={this.props.close}>
          <Message>close</Message>
        </a>
      </div>
    )
  }
})

export default ReportModuleSizing
