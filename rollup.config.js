import nodeResolve from 'rollup-plugin-node-resolve';
import copy from 'rollup-plugin-copy'
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import postcss from 'rollup-plugin-postcss';

import pkg from './package.json';

export default {
  input: './src/index.js',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      exports: 'named',
    },
    {
      file: pkg.module,
      format: 'esm',
      exports: 'named',
    },
  ],
  external: [
    'react',
    'react-dom',
    'react-dnd',
    'prop-types',
    'react-dnd-html5-backend',
    'frontend-collective-react-dnd-scrollzone',
    'react-virtualized',
    'lodash.isequal'
  ],
  plugins: [
    nodeResolve(),
    postcss({ extract: './style.css' }),
    copy({
      targets: [
        { src: 'src/index.d.ts', dest: './dist' },
        { src: 'src/utils/tree-data-utils.d.ts', dest: './dist/utils' },
        { src: 'src/utils/default-handlers.d.ts', dest: './dist/utils' },
      ]
    }),
    commonjs({
      include: 'node_modules/**',
    }),
    babel({
      exclude: 'node_modules/**',
    }),
  ],
};
