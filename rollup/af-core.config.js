export default {
    external: ['@adobe/json-formula', '@aemforms/af-formatters'],
    input: {
        runtime: 'node_modules/@aemforms/af-core/lib/esm/FormInstance.js',
        events: 'node_modules/@aemforms/af-core/lib/esm/controller/Events.js',
    },
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