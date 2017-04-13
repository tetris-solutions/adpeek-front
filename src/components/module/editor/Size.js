import csjs from 'csjs'
import map from 'lodash/map'
import React from 'react'
import PropTypes from 'prop-types'
import {styledComponent} from '../../higher-order/styled'

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

class EditSize extends React.Component {
  static displayName = 'Edit-Size'

  static contextTypes = {
    draft: PropTypes.object.isRequired,
    change: PropTypes.func.isRequired
  }

  onSelect = (cols, rows) => {
    return e => {
      e.preventDefault()
      this.context.change({cols, rows})
    }
  }

  render () {
    const {draft: {module: {cols, rows}}} = this.context
    const getColor = (currentCol, currentRows) => cols >= currentCol && rows >= currentRows
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
              </div>)}
          </div>)}
      </div>
    )
  }
}

export default styledComponent(EditSize, style)
