import React from 'react'
import PropTypes from 'prop-types'
import CreateAdwordsCampaign from './Adwords'
import NotImplemented from '../../NotImplemented'

const isAdwords = ({folder: {account: {platform}}}) => platform === 'adwords'

const CreateCampaign = props =>
  isAdwords(props)
    ? <CreateAdwordsCampaign {...props}/>
    : <NotImplemented/>

CreateCampaign.displayName = 'Create-Campaign'
CreateCampaign.propTypes = {
  folder: PropTypes.object.isRequired
}

export default CreateCampaign
