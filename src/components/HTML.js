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

const revSuffix = process.env.BUILD_PROD ? `.${revision.short()}` : ''
const hardCodedStyle = `
.react-resizable-handle {
  z-index: 3;
}`

const HTML = ({payload, children, css}) => (
  <html>
    <head>
      <meta charSet='UTF-8'/>
      <meta name='viewport' content='width=device-width, initial-scale=1'/>

      {Helmet
        .rewind()
        .title.toComponent()}

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

      <style dangerouslySetInnerHTML={{__html: paceCss}}/>
      <style id='style-injection' dangerouslySetInnerHTML={{__html: css}}/>
      <style dangerouslySetInnerHTML={{__html: hardCodedStyle}}/>

      {gTMScript}
      <script src='https://cdn.rawgit.com/HubSpot/pace/v1.0.0/pace.min.js' async/>
      <script src='https://code.getmdl.io/1.3.0/material.min.js' defer/>
      <script
        id='state-injection'
        dangerouslySetInnerHTML={{__html: `var backendPayload = ${JSON.stringify(payload)}`}}/>
      <script src={`/js/client${revSuffix}.manifest.js`} defer/>
      <script src={`/js/client${revSuffix}.vendor.js`} defer/>
      <script src={`/js/client${revSuffix}.main.js`} defer/>
    </head>
    <body>
      <div id='app' dangerouslySetInnerHTML={{__html: children}}/>

      {gTMIFrame}
    </body>
  </html>
)

HTML.propTypes = {
  css: React.PropTypes.string,
  payload: React.PropTypes.object,
  children: React.PropTypes.node
}

export default HTML
