import csjs from 'csjs'

export const style = csjs`
.list {
  height: 400px;
  overflow-y: auto;
}
.actions {
  margin-top: 1em;
  text-align: right;
}
.actions button:not(:last-child) {
  margin-right: .5em;
}
.actions button:first-child {
  float: left;
}
.thinForm {
  min-height: 300px;
  max-width: 400px; 
  margin: 0 auto;
}`
