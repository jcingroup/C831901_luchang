const path = require('path');
var webpack = require('webpack');

var m = process.env.NODE_ENV
var p = null;
var ent = {
    login: path.resolve(__dirname, 'Scripts/src/app.jsx'),
    news: path.resolve(__dirname, 'Scripts/src/news/app.js'),
    commrun: path.resolve(__dirname, 'Scripts/comm/comm-run.js'),
    vendors: ['react', 'react-dom', 'redux', 'react-redux', 'redux-thunk', 'react-addons-update', 'moment']
};
if (m === "development") {
    p = {
        entry: ent,
        output: {
            path: path.resolve(__dirname, 'Scripts/dist'),
            filename: '[name].js'
        },
        externals: {
            jquery: "jQuery"
        },
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: 'babel-loader',
                            options: { presets: ['es2015', "stage-0", "babel-preset-react"] }
                        }
                    ]
                },
                {
                    test: /\.css$/,
                    use: ['style-loader', 'css-loader']
                }
            ]
        },
        resolve: {
            alias: {
                moment: "moment/moment.js"
            },
            extensions: ['.webpack.js', '.web.js', '.jsx', '.js', '.css']
        },
        optimization: {
            runtimeChunk: {
                name: 'manifest'
            },
            splitChunks: {
                cacheGroups: {
                    commons: {
                        test: /[\\/]node_modules[\\/]/,
                        name: "vendors",
                        chunks: "all",
                        reuseExistingChunk: true
                    }
                }
            }
        },
        plugins: [
            new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /zh-tw/),
        ],
        mode: 'development'
    }
} else {
    p = {
        entry: ent,
        output: {
            path: path.resolve(__dirname, 'Scripts/dist'),
            filename: '[name].js'
        },
        externals: {
            jquery: "jQuery"
        },
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: 'babel-loader',
                            options: { presets: ['es2015', "stage-0","@babel/preset-react"] }
                        }
                    ]
                },
                {
                    test: /\.css$/,
                    use: ['style-loader', 'css-loader']
                }
            ]
        },
        resolve: {
            alias: {
                moment: "moment/moment.js"
            },
            extensions: ['.js', '.css']
        },
        optimization: {
            runtimeChunk: {
                name: 'manifest'
            },
            splitChunks: {
                cacheGroups: {
                    commons: {
                        test: /[\\/]node_modules[\\/]/,
                        name: "vendors",
                        chunks: "all",
                        reuseExistingChunk: true
                    }
                }
            }
        },
        plugins: [
            new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /zh-tw/),
        ],
        mode: 'production'
    }
}

module.exports = p;


