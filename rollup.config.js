import resolve from '@rollup/plugin-node-resolve'
import common from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'

export default [{
    input: 'packages/vue/src/index.ts',
    output: [
        {
            sourceMap: false,
            file: './packages/vue/dist/vue.js',
            format: 'iife',
            name: 'Vue'
        }
    ],
    plugins: [
        typescript({
            sourceMap: true
        }),
        resolve(),
        common()
    ]
}]