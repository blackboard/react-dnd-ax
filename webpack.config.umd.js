var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var outputName = 'react-sortable-hoc-ax';
var plugins = {
    default: [
        new ExtractTextPlugin({
            filename: 'bundle.css',
            allChunks: true
        }),
    ],
    minify: [
        new ExtractTextPlugin({
            filename: 'bundle.css',
            allChunks: true
        }),
        new webpack.optimize.UglifyJsPlugin({
            beautify: false,
            comments: false,
            mangle: false
        }),
    ]
}

module.exports = function(env) {
    const minify = env.compress
    return {
        devtool: (minify) ? 'source-map' : false,
        entry: [
            './src/react-dnd-ax/index'
        ],
        output: {
            path: path.join(__dirname, 'dist/umd'),
            filename: (minify) ? outputName + '.min.js' : outputName + '.js',
            library: 'SortableHOC',
            libraryTarget: 'umd'
        },
        externals: {
            react: {
                commonjs: 'react',
                commonjs2: 'react',
                amd: 'react',
                root: 'React'
            },
            'react-dom': {
                commonjs: 'react-dom',
                commonjs2: 'react-dom',
                amd: 'react-dom',
                root: 'ReactDOM'
            }
        },
        plugins: (minify) ? plugins.minify : plugins.default,
        resolve: {
    		extensions: ['.js', '.jsx', '.scss']
        },
        module: {
            loaders: [
                {
                    test: /\.jsx?$/,
                    loaders: ['babel-loader'],
                    exclude: /node_modules/,
                },
                {
                    test: /(\.scss|\.css)$/,
                    loader: ExtractTextPlugin.extract({ fallback: 'style-loader', use: ['css-loader', 'sass-loader'] })
                },
            ]
        },
    }
}
