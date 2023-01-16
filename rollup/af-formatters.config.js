export default {
    input: {
        'afb-formatters': 'node_modules/@aemforms/af-formatters/lib/esm/index.js'
    },
    output: {
      dir : 'src/libs',
      format: 'es',
      entryFileNames: '[name].js'
    }
  };