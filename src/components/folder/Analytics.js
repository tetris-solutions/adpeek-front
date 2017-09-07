import Message from '@tetris/front-server/Message'
import PropTypes from 'prop-types'
import React from 'react'
import Page from '../Page'
import SubHeader from '../SubHeader'
import {Card, Content, Header} from '../Card'

const AnalyticsFolder = ({folder}) => (
  <div>
    <SubHeader/>
    <Page>
      <Card>
        <Header>
          <Message name={folder.name}>analyticsFolderTitle</Message>
        </Header>
        <Content>
          <Message tag='p'>
            analyticsFolderDescription
          </Message>

          {folder.ga_segment && (
            <p style={{textAlign: 'right'}}>
              <strong>
                {folder.ga_segment.name}
              </strong>
              <br/>
              <em>
                {folder.ga_segment.definition}
              </em>
            </p>)}
        </Content>
      </Card>
    </Page>
  </div>
)

AnalyticsFolder.displayName = 'Analytics-Folder'
AnalyticsFolder.propTypes = {
  folder: PropTypes.object
}

export default AnalyticsFolder
