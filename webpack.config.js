'use strict';

const webpack = require('webpack');
const path = require('path');

const getPlugins = (env) => {
    const plugins = [];
    if (env === 'production') {
        plugins.push(new webpack.optimize.UglifyJsPlugin());
    }
    return plugins
};

const getFileName = (env) => (`react-listenable-frame.${env === 'production' ? 'prod' : 'dev'}.js`);

module.exports = env => ({
    plugins: getPlugins(env),
    entry: [
        'es6-set/implement',
        'es6-map/implement',
        path.join(__dirname, 'src', 'index.ts'),
    ],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loaders: [
                    {
                        loader: 'ts-loader',
                        options: {
                            configFile: path.join(__dirname, 'tsconfig.webpack.json'),
                        },
                    },
                ],
                exclude: [/node_modules/],
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: getFileName(env),
        path: path.join(__dirname, 'dist'),
        library: 'ReactListenableIFrame',
        libraryExport: 'default',
    },
    externals: {
        'react': 'React',
        'react-dom': 'ReactDOM',
        'recompose': 'Recompose',
        'with-privates': 'withPrivates',
    }
});
