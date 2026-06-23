import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import { string } from 'rollup-plugin-string';

const banner = `/*!
 * Ally Widget v1.0.0
 * Released under the MIT License
 */`;

export default {
  input: 'src/index.js',
  output: [
    // IIFE for <script> tag / CDN (unminified)
    {
      file: 'dist/ally-widget.js',
      format: 'iife',
      name: 'AllyWidget',
      banner
    },
    // IIFE minified — use this for CDN link
    {
      file: 'dist/ally-widget.min.js',
      format: 'iife',
      name: 'AllyWidget',
      sourcemap: true,
      banner,
      plugins: [terser()]
    },
    // ESM — for Vite / webpack bundlers
    {
      file: 'dist/ally-widget.esm.js',
      format: 'esm',
      banner
    },
    // CJS — for Node / SSR / older bundlers
    {
      file: 'dist/ally-widget.cjs.js',
      format: 'cjs',
      exports: 'default',
      banner
    }
  ],
  plugins: [
    string({ include: '**/*.css' }),
    nodeResolve()
  ]
};
