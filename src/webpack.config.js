// esse arquivo é escrito em commonjs e js legado
// pra que o usuário possa rodar `webpack` normalmente da pasta src

var path = require('path')
var spawn = require('child_process').spawn
var dotenv = require('dotenv')

dotenv.config({
  path: path.resolve(__dirname, '..', '.env'),
  silent: true
})

var watchMode = !process.env.BUILD_PROD

if (watchMode) {
  var proc = spawn('npm', ['run', 'gulp'])

  proc.stdout.pipe(process.stdout)
  proc.stderr.pipe(process.stderr)
}

module.exports = watchMode
  ? require('./webpack.config.dev')
  : require('./webpack.config.prod')
