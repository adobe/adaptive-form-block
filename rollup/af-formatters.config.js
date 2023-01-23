import cleanup from 'rollup-plugin-cleanup';
import license from 'rollup-plugin-license';
import path from 'path'
const directory = 'node_modules/@aemforms/af-formatters'

export default {
    input: {
        'afb-formatters': path.join(directory, 'lib/esm/index.js')
    },
    plugins: [
      cleanup({
        comments: 'none'
      }),
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