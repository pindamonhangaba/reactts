var webpack = require('webpack');
var path = require('path');

// variables
var isProduction = process.argv.indexOf('-p') >= 0;
var sourcePath = path.join(__dirname, './src');
var outPath = path.join(__dirname, './dist');

// plugins
var HtmlWebpackPlugin = require('html-webpack-plugin');
var MiniCssExtractPlugin = require('mini-css-extract-plugin');
var WebpackCleanupPlugin = require('webpack-cleanup-plugin');
const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
    mode: (isProduction && 'production') || 'development',
    context: sourcePath,
    entry: {
        app: './main.tsx',
    },
    output: {
        path: outPath,
        filename: 'bundle.js',
        chunkFilename: '[chunkhash].js',
        publicPath: '/reactts/',
    },
    target: 'web',
    resolve: {
        extensions: ['.js', '.ts', '.tsx'],
        //mainFields: ['module', 'browser', 'main'],
        alias: {
            app: path.resolve(__dirname, 'src/app/'),
        },
    },
    module: {
        rules: [
            // .ts, .tsx
            {
                test: /\.tsx?$/,
                use: isProduction ?
                    'ts-loader' : [{
                            loader: 'babel-loader',
                            options: {
                                babelrc: false,
                                plugins: ['react-hot-loader/babel', 'syntax-dynamic-import'],
                            },
                        },
                        //'babel-loader?plugins=react-hot-loader/babel,syntax-dynamic-import',
                        'ts-loader',
                    ],
            },
            // json
            { test: /\.json$/, use: 'json-loader' },
            // css
            {
                test: /\.css$/,
                use: [!isProduction ? 'style-loader' : MiniCssExtractPlugin.loader,
                    {
                      loader: 'css-loader',
                      query: {
                        //modules: true,
                        sourceMap: !isProduction,
                        exportOnlyLocals :false,
                        importLoaders: 1,
                        localIdentName: '[local]__[hash:base64:5]',
                      },
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            ident: 'postcss',
                            plugins: [
                                require('postcss-import')({ addDependencyTo: webpack }),
                                require('postcss-url')(),
                                require('postcss-cssnext')(),
                                require('postcss-reporter')(),
                                require('postcss-browser-reporter')({
                                    disabled: isProduction,
                                }),
                            ],
                        },
                    },
                ],
            },
            // static assets
            { test: /\.html$/, use: 'html-loader' },
            { test: /\.(png|svg)$/, use: 'url-loader?limit=10000' },
            { test: /\.(jpg|gif)$/, use: 'file-loader' },
        ],
    },
    optimization: {
        minimize: !!isProduction,
        minimizer: [
            new TerserPlugin({
                parallel: true,
                terserOptions: {
                    ecma: 5,
                },
            }),
        ],
        splitChunks: {
            name: true,
            cacheGroups: {
                commons: {
                    chunks: 'initial',
                    minChunks: 2,
                },
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    chunks: 'all',
                    priority: -10,
                },
            },
        },
        runtimeChunk: true,
    },
    plugins: [
        new webpack.EnvironmentPlugin({
            APPVERSION: "v1",
            __API_PATH__: 'https://example.com:8089/api',
            __AUTH_PATH__: 'https://example.com:8089',
            __WS_PATH__: 'ws://example.com:8089/connect',
            NODE_ENV: 'development', // use 'development' unless process.env.NODE_ENV is defined
            DEBUG: false,
        }),
        new WebpackCleanupPlugin(),
        new MiniCssExtractPlugin({
            filename: !isProduction ? '[name].css' : '[name].[hash].css',
            chunkFilename: !isProduction ? '[id].css' : '[id].[hash].css',
        }),
        new HtmlWebpackPlugin({
            template: 'assets/index.html',
        }),
    ],
    devServer: {
        contentBase: sourcePath,
        hot: true,
        inline: true,
        historyApiFallback: {
            disableDotRule: true,
        },
        stats: 'minimal',
    },
    node: {
        // workaround for webpack-dev-server issue
        // https://github.com/webpack/webpack-dev-server/issues/60#issuecomment-103411179
        fs: 'empty',
        net: 'empty',
    },
};