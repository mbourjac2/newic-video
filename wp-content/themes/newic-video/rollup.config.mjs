import terser from '@rollup/plugin-terser';

export default {
  input: 'src/js/index.js',
  output: [
    {
      file: 'static/bundle.min.js',
      format: 'es',
      plugins: [terser()],
    },
  ],
};
