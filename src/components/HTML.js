import React from 'react'

export const HTML = ({documentTitle = 'Tetris Solutions', payload, children}) => (
  <html>
    <head>

      <meta charSet='UTF-8'/>
      <title>{documentTitle}</title>
      <link rel='stylesheet' href='http://fonts.googleapis.com/css?family=Roboto:300,400,500,700' type='text/css' />
      <link rel='stylesheet' href='https://fonts.googleapis.com/icon?family=Material+Icons'/>
      <link rel='stylesheet' href='https://code.getmdl.io/1.1.3/material.cyan-light_blue.min.css'/>
      <link rel='stylesheet' href='https://cdn.rawgit.com/daneden/animate.css/master/animate.css'/>
      <link rel='stylesheet' href='//cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/css/toastr.min.css'/>
      <link rel='stylesheet' href='/css/main.css'/>

      <script
        id='state-injection'
        dangerouslySetInnerHTML={{__html: `var backendPayload = ${JSON.stringify(payload)}`}}/>

      {/* <script src='https://code.getmdl.io/1.1.3/material.min.js' defer/>*/}
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
