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
.table {
  width: 100%;
}
.thinForm {
  min-height: 300px;
  max-width: 400px; 
  margin: 0 auto;
}
.loading {
  margin-top: 2em;
  font-style: italic;
}
.numberInputCell {
  width: 4em;
  float: right
}`
