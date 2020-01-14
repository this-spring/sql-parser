import { uglify } from 'rollup-plugin-uglify';
import typescript from 'rollup-plugin-typescript2';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs'  

export default {
    input: 'src/lib/index.js',
    output: {
        file: `dist/SQLParser.min.js`,
        format: 'umd',
        name: 'SQLParser',
        sourceMap: false,
    },
    plugins: [
        resolve(),
        uglify(),
        commonjs({}),
        typescript({
            tsconfig: './tsconfig.json',
            verbosity: 3,
        }),
    ],
};