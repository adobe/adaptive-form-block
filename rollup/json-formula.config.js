import cleanup from 'rollup-plugin-cleanup';
import license from 'rollup-plugin-license';
import path from 'path'
const directory = 'node_modules/@adobe/json-formula'

export default {
    input: {
        'json-formula': path.join(directory, 'src/json-formula.js')
    },
    plugins: [
      cleanup(),
      license({
        banner: {
          content : {
            file: path.join(directory, 'LICENSE'),
            encoding: 'utf-8',
          }
        },
      }),
    ],
    output: {
      dir : 'src/libs',
      format: 'es',
      entryFileNames: '[name].js'
    }
  };