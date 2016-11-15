import csjs from 'csjs'
import includes from 'lodash/includes'
import map from 'lodash/map'
import React from 'react'
import {styledFnComponent} from '../../../higher-order/styled-fn-component'
import AttributeItem from './AttributeItem'

const style = csjs`
.list {
  padding: 0;
  margin: 0;
  list-style: none;
}`

const {PropTypes} = React

const AttributeList = ({attributes, selectedAttributes, isIdSelected, remove, add}) => (
  <div>
    <ul className={`${style.list}`}>
      {map(attributes, item => {
        const isSelected = includes(selectedAttributes, item.id)

        return (
          <AttributeItem
            {...item}
            selected={isSelected}
            toggle={isSelected ? remove : add}
            key={item.id}/>
        )
      })}
    </ul>
  </div>
)

AttributeList.displayName = 'Attribute-List'
AttributeList.propTypes = {
  attributes: PropTypes.array.isRequired,
  selectedAttributes: PropTypes.array.isRequired,
  isIdSelected: PropTypes.bool,
  remove: PropTypes.func.isRequired,
  add: PropTypes.func.isRequired
}

export default styledFnComponent(AttributeList, style)
