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
    'lodash.isequal',
    "mobx",
    "mobx-react"
  ],
  plugins: [
    nodeResolve(),
    postcss({ extract: './style.css' }),
    copy({
      targets: [
        { src: 'node_modules/@types/react-sortable-tree/index.d.ts', dest: './dist' },
        { src: 'node_modules/@types/react-sortable-tree/utils', dest: './dist' },
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
