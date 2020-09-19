import resolve from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';

const config = {
  input: 'src/reducer.ts',
  output: [{
    file: 'dist/reducer.cjs.js',
    format: 'cjs',
  }, {
    file: 'dist/reducer.umd.js',
    format: 'umd',
    name: 'recast',
    globals: {
      'react': 'React',
      'lodash-es': '_',
    },
  }, {
    file: 'dist/reducer.es.js',
    format: 'es',
  }],
  external: ['react', 'lodash-es'],
  plugins: [
    resolve({
      extensions: ['.ts', '.tsx']
    }),
    typescript(),
  ],
};

export default config;
