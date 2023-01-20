import path from 'path'
import cleanup from 'rollup-plugin-cleanup';
import license from 'rollup-plugin-license';
const directory = 'node_modules/@aemforms/af-core'
export default {
    external: ['@adobe/json-formula', '@aemforms/af-formatters'],
    input: {
        runtime: path.join(directory, 'lib/esm/FormInstance.js'),
        events: path.join(directory, 'lib/esm/controller/Events.js'),
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
      paths: {
        '@adobe/json-formula' : './json-formula.js',
        '@aemforms/af-formatters' : './afb-formatters.js'
      },
      entryFileNames: 'afb-[name].js'
    }
  };