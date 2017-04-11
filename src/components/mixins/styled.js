import PropTypes from 'prop-types'

export function styled (style) {
  return {
    contextTypes: {
      insertCss: PropTypes.func
    },
    componentWillMount () {
      this.context.insertCss(style)
    }
  }
}
