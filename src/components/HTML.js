import React from 'react'

export const HTML = ({documentTitle = 'Tetris Solutions', payload, children}) => (
  <html>
    <head>

      <meta charSet='UTF-8'/>
      <title>{documentTitle}</title>
      <link rel='stylesheet' href='https://fonts.googleapis.com/icon?family=Material+Icons'/>
      <link rel='stylesheet' href='https://code.getmdl.io/1.1.3/material.blue_grey-indigo.min.css'/>
      <link rel='stylesheet' href='https://cdn.rawgit.com/daneden/animate.css/master/animate.css'/>
      <link rel='stylesheet' href='//cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/css/toastr.min.css'/>

      <script
        id='state-injection'
        dangerouslySetInnerHTML={{__html: `var backendPayload = ${JSON.stringify(payload)}`}}/>

      <script src='https://code.getmdl.io/1.1.3/material.min.js' defer/>
      <script src='/js/client.js' defer/>

    </head>
    <body>

      <div id='app' dangerouslySetInnerHTML={{__html: children}}/>

    </body>
  </html>
)

const {PropTypes} = React

HTML.propTypes = {
  documentTitle: PropTypes.string,
  payload: PropTypes.object,
  children: PropTypes.node
}

export default HTML
