import React from 'react'
import PropTypes from 'prop-types'

const gTMSrc = `(function (w, d, s, l, i) {
  w[l] = w[l] || [];
  w[l].push({
    'gtm.start': new Date().getTime(), event: 'gtm.js'
  });
  var f = d.getElementsByTagName(s)[0],
    j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : '';
  j.async = true;
  j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
  f.parentNode.insertBefore(j, f);
})(window, document, 'script', 'dataLayer', '${process.env.GOOGLE_TAG_MANAGER_ID}');`

const gTMScript = process.env.NODE_ENV === 'production'
  ? <script dangerouslySetInnerHTML={{__html: gTMSrc}}/>
  : null

const gTMIFrame = process.env.NODE_ENV === 'production'
  ? (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${process.env.GOOGLE_TAG_MANAGER_ID}`}
        height='0' width='0'
        style={{display: 'none', visibility: 'hidden'}}/>
    </noscript>
  )
  : null

const revisionSuffix = process.env.DEV_SERVER ? '' : `.${require('../../package.json').version}`
const hardCodedStyle = `
.react-resizable-handle {
  z-index: 3;
}
.mdl-layout__header {
  display: flex !important;
}`

const HTML = ({payload, children, css, helmet}) => (
  <html>
    <head>
      <meta charSet='UTF-8'/>
      <meta name='viewport' content='width=device-width, initial-scale=1'/>

      {helmet.title.toComponent()}

      <link rel='shortcut icon' type='image/png' href='/img/favicon.png'/>
      <link rel='stylesheet' href='https://fonts.googleapis.com/css?family=Roboto:300,400,500,700' type='text/css'/>
      <link rel='stylesheet' href='https://fonts.googleapis.com/icon?family=Material+Icons'/>

      <link
        rel='stylesheet'
        href={`https://code.getmdl.io/1.3.0/material.${payload.debugMode ? 'brown-deep_purple' : 'blue-indigo'}.min.css`}/>

      <link rel='stylesheet' href='/css/mdl-selectfield.min.css'/>
      <link rel='stylesheet' href='/css/animate.min.css'/>
      <link rel='stylesheet' href='/css/react-grid-layout.css'/>
      <link rel='stylesheet' href='/css/react-resizable.css'/>
      <link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/css/toastr.min.css'/>

      <style id='style-injection' dangerouslySetInnerHTML={{__html: css}}/>
      <style dangerouslySetInnerHTML={{__html: hardCodedStyle}}/>

      {gTMScript}
      <script src='https://code.getmdl.io/1.3.0/material.min.js' defer/>
      <script
        id='state-injection'
        dangerouslySetInnerHTML={{__html: `var backendPayload = ${JSON.stringify(payload)}`}}/>
      <script src={`/js/client${revisionSuffix}.js`} defer/>
    </head>
    <body>
      <div id='app' dangerouslySetInnerHTML={{__html: children}}/>

      {gTMIFrame}
    </body>
  </html>
)

HTML.propTypes = {
  css: PropTypes.string,
  payload: PropTypes.object,
  children: PropTypes.node,
  helmet: PropTypes.object
}

export default HTML
