import cx from 'classnames'
import debounce from 'lodash/debounce'
import deburr from 'lodash/deburr'
import filter from 'lodash/filter'
import includes from 'lodash/includes'
import isEmpty from 'lodash/isEmpty'
import lowerCase from 'lodash/toLower'
import sortBy from 'lodash/sortBy'
import trim from 'lodash/trim'
import React from 'react'
import size from 'lodash/size'
import AttributesSelect from './AttributesSelect'
import EntityTree from './EntityTree'
import Input from '../../../Input'
import {Tabs, Tab} from '../../../Tabs'

const {PropTypes} = React
const clean = str => trim(lowerCase(deburr(str)))

const containsSearchvalue = searchValue =>
  ({name, headline, description}) => (
    includes(clean(name), searchValue) ||
    includes(clean(description), searchValue) ||
    includes(clean(headline), searchValue)
  )

const matching = (ls, searchValue) => searchValue
  ? filter(ls, containsSearchvalue(searchValue))
  : ls

const sorted = ls => sortBy(ls, 'name')

const Lists = React.createClass({
  displayName: 'Lists',
  propTypes: {},
  contextTypes: {
    messages: PropTypes.object,
    attributes: PropTypes.object,
    draft: PropTypes.object,
    addAttribute: PropTypes.func.isRequired,
    removeAttribute: PropTypes.func.isRequired
  },
  getInitialState () {
    return {searchValue: ''}
  },
  componentWillMount () {
    this.onChangeSearch = debounce(this.onChangeSearch, 300)
    this.updateLists(this.context)
  },
  componentWillReceiveProps (nextProps, nextContext) {
    if (nextContext.attributes !== this.context.attributes || nextContext.entity !== this.context.draft.entity) {
      this.updateLists(nextContext)
    }
  },
  updateLists ({draft: {entity}, attributes}, searchValue = this.state.searchValue) {
    attributes = sorted(matching(attributes, searchValue))

    const items = sorted(matching(entity.list, searchValue))
    const dimensions = filter(attributes, 'is_dimension')
    const metrics = filter(attributes, 'is_metric')

    this.setState({items, dimensions, metrics, searchValue})
  },
  onChangeSearch () {
    const input = this.refs.wrapper.querySelector('input[name="searchValue"]')
    this.updateLists(this.context, clean(input.value))
  },
  render () {
    const {draft: {module, entity}, addAttribute, removeAttribute} = this.context
    const selectedMetrics = module.metrics
    const selectedDimensions = module.dimensions
    const selectedIds = module.filters.id
    const {dimensions, metrics, items} = this.state
    const isIdSelected = size(selectedIds) === 1 || includes(selectedDimensions, 'id')
    const {messages} = this.context

    const entityClasses = cx('material-icons', isEmpty(selectedIds) && 'mdl-color-text--red-A700')
    const entityTitle = (
      <i className={entityClasses} title={entity.name}>list</i>
    )

    const metricClasses = cx('material-icons', isEmpty(selectedMetrics) && 'mdl-color-text--red-A700')
    const metricTitle = (
      <i className={metricClasses} title={messages.metrics}>trending_up</i>
    )

    const dimensionClasses = cx('material-icons', isEmpty(selectedDimensions) && 'mdl-color-text--red-A700')
    const dimensionTitle = (
      <i className={dimensionClasses} title={messages.dimensions}>view_column</i>
    )

    return (
      <div ref='wrapper'>
        <Input
          label='filter'
          name='searchValue'
          onChange={this.onChangeSearch}/>

        <Tabs onChangeTab={this.onChangeTab}>
          <Tab id='entity' title={entityTitle}>
            <br/>
            <EntityTree items={items}/>
          </Tab>

          <Tab id='metric' title={metricTitle}>
            <br/>
            <AttributesSelect
              add={addAttribute}
              remove={removeAttribute}
              attributes={metrics}
              isIdSelected={isIdSelected}
              selectedAttributes={selectedMetrics}/>
          </Tab>

          {module.type !== 'total' && (
            <Tab id='dimension' title={dimensionTitle}>
              <br/>
              <AttributesSelect
                add={addAttribute}
                remove={removeAttribute}
                attributes={dimensions}
                isIdSelected={isIdSelected}
                selectedAttributes={selectedDimensions}/>
            </Tab>)}
        </Tabs>
      </div>
    )
  }
})

export default Lists
