import json from 'rollup-plugin-json'
import babel from 'rollup-plugin-babel'
import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs/src/index'
import uglify from 'rollup-plugin-uglify'
import nodeGlobals from 'rollup-plugin-node-globals'

export default {
  entry: 'src/client.js',
  format: 'iife',
  plugins: [
    json(),
    babel({
      exclude: 'node_modules/**',
      presets: ['es2015-rollup', 'react']
    }),
    nodeResolve({
      jsnext: true,
      main: true
    }),
    commonjs(),
    nodeGlobals(),
    uglify()
  ],
  dest: 'public/js/client.js'
}
