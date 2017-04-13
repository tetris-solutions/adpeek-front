import csjs from 'csjs'

export default csjs`
.sober {
  color: grey;
}
.platform {
  width: 24px;
  height: 24px;
}
.numbers {
  line-height: 24px;
  padding-left: .5em;
}
.label extends .sober {
  padding-left: .5em;
  padding-bottom: .5em;
}
.number extends .sober {
  margin: 0 .8em 0 .3em;
}
.rail {
  background-color: grey;
  overflow: hidden;
  border-radius: 3px;
  padding: 2px;
  margin-bottom: 1em;
}
.rail > div {
  border-radius: 3px;
  height: 4px;
}
.statsWrap {
  height: 140px;
  padding: 1em 0 5em .7em;
}
.stats {
  padding: 0 1em 0 .5em;
}
.numbers {
  display: block;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  font-size: small;
}
.numbers > strong {
  font-size: 105%;
}
.iconLabel {
  display: inline-block;
  transform: translateY(-.4em);
  padding-left: .3em;
}
.empty {
  text-align: center;
}
.empty h6 > small {
  font-size: .8em;
}`
