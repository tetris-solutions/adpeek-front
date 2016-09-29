import React from 'react'
import Helmet from 'react-helmet'
import revision from 'git-rev-sync'

const paceCss = `
.pace {
  -webkit-pointer-events: none;
  pointer-events: none;

  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
}

.pace-inactive {
  display: none;
}

.pace .pace-progress {
  background: #7fcc7e;
  position: fixed;
  z-index: 2000;
  top: 0;
  right: 100%;
  width: 100%;
  height: 2px;
}`

export const HTML = ({documentTitle = 'Tetris Solutions', payload, children, css}) => {
  const heads = Helmet.rewind()

  return (
    <html>
      <head>

        <meta charSet='UTF-8'/>
        <meta name='viewport' content='width=device-width, initial-scale=1'/>
        {heads.title.toComponent()}
        <link rel='stylesheet' href='https://fonts.googleapis.com/css?family=Roboto:300,400,500,700' type='text/css'/>
        <link rel='stylesheet' href='https://fonts.googleapis.com/icon?family=Material+Icons'/>
        <link rel='stylesheet' href='https://code.getmdl.io/1.2.0/material.indigo-pink.min.css'/>
        <link rel='stylesheet' href='/css/mdl-selectfield.min.css'/>
        <link rel='stylesheet' href='/css/animate.min.css'/>
        <link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/css/toastr.min.css'/>
        <script src='https://cdn.rawgit.com/HubSpot/pace/v1.0.0/pace.min.js' async/>
        <style dangerouslySetInnerHTML={{__html: paceCss}}/>
        <style id='style-injection' dangerouslySetInnerHTML={{__html: css}}/>
        <script src='https://code.getmdl.io/1.2.0/material.min.js' defer/>
        <script
          id='state-injection'
          dangerouslySetInnerHTML={{__html: `var backendPayload = ${JSON.stringify(payload)}`}}/>
        <script src={process.env.BUILD_PROD ? `/js/client.${revision.short()}.js` : '/js/client.js'} defer/>
      </head>
      <body>

        <div id='app' dangerouslySetInnerHTML={{__html: children}}/>

      </body>
    </html>
  )
}

const {PropTypes} = React

HTML.propTypes = {
  css: PropTypes.string,
  documentTitle: PropTypes.string,
  payload: PropTypes.object,
  children: PropTypes.node
}

export default HTML
