import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import replace from '@rollup/plugin-replace';
import { string } from 'rollup-plugin-string';

const banner = `/*!
 * Ally Widget v1.0.3
 * Released under the MIT License
 */`;

const sharedPlugins = [
  string({ include: '**/*.css' }),
  nodeResolve()
];

// IIFE builds (CDN / <script> tag) — auto-init ON
const iifeConfig = {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/ally-widget.js',
      format: 'iife',
      name: 'AllyWidget',
      banner
    },
    {
      file: 'dist/ally-widget.min.js',
      format: 'iife',
      name: 'AllyWidget',
      sourcemap: true,
      banner,
      plugins: [terser()]
    }
  ],
  plugins: [
    replace({ __ALLY_AUTO_INIT__: 'true', preventAssignment: true }),
    ...sharedPlugins
  ]
};

// ESM + CJS builds (bundlers / Node) — auto-init OFF
const moduleConfig = {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/ally-widget.esm.js',
      format: 'esm',
      banner
    },
    {
      file: 'dist/ally-widget.cjs.js',
      format: 'cjs',
      exports: 'default',
      banner
    }
  ],
  plugins: [
    replace({ __ALLY_AUTO_INIT__: 'false', preventAssignment: true }),
    ...sharedPlugins
  ]
};

export default [iifeConfig, moduleConfig];
