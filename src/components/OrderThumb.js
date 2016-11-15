import React from 'react'
import {Cap, Title, ThumbLink} from './ThumbLink'
import {prettyNumber} from '../functions/pretty-number'
import csjs from 'csjs'
import {styledFnComponent} from './higher-order/styled-fn-component'

const style = csjs`
.strong {
  display: inline;
  white-space: nowrap;
}
.info {
  font-size: smaller;
  color: grey;
  padding: 1em;
  padding-right: 0;
}
.info > i {
  transform: translateY(.3em);
  margin-right: .3em;
}`

const {PropTypes} = React
const dFormat = 'DD/MMM'

const Order = ({amount, start, end, company, workspace, folder, id, name, folder_name, workspace_name}, {moment, locales}) => (
  <ThumbLink to={`/company/${company}/workspace/${workspace}/folder/${folder}/order/${id}`} title={name}>
    <Cap>
      <strong className={`${style.strong}`}>
        {name}
      </strong>
      <br/>

      <small>
        {moment(start).format(dFormat)} - {moment(end).format(dFormat)}
      </small>
    </Cap>

    <div className={`${style.info}`}>
      <i className='material-icons'>folder</i>
      {folder_name}
      <br/>
      <i className='material-icons'>domain</i>
      {workspace_name}
    </div>

    <Title>
      {prettyNumber(amount, 'currency', locales)}
    </Title>
  </ThumbLink>
)

Order.displayName = 'Order'
Order.propTypes = {
  id: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  folder_name: PropTypes.string.isRequired,
  workspace_name: PropTypes.string.isRequired,
  start: PropTypes.string.isRequired,
  end: PropTypes.string.isRequired,
  workspace: PropTypes.string.isRequired,
  company: PropTypes.string.isRequired,
  folder: PropTypes.string.isRequired
}

Order.contextTypes = {
  moment: PropTypes.func.isRequired,
  locales: PropTypes.string.isRequired
}

export default styledFnComponent(Order, style)
