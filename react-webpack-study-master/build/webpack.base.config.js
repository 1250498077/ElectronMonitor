const path = require("path");

const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HappyPack = require('happypack');
const os = require('os');
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });


module.exports = {
    entry: ["./src/index.js"],
    output: {
        // 输出目录
        path: path.resolve(__dirname, "../dist")
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                include: [path.resolve(__dirname,"../src")],
                use: [
                  {
                    loader: "babel-loader"
                  }
                ]
            },
            {
                test: /\.(sc|sa|c)ss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader", // 编译css
                    "postcss-loader", // 使用 postcss 为 css 加上浏览器前缀
                    "sass-loader" // 编译scss
                ]
            },
            {
                test: /\.(less|css)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader", // 编译css
                    "postcss-loader", // 使用 postcss 为 css 加上浏览器前缀
                    "less-loader" // 编译less
                ]
            },
            {
                test: /\.(png|jpg|jpeg|gif|svg)/,
                use: {
                    loader: "url-loader",
                    options: {
                        outputPath: "images/", // 图片输出的路径
                        limit: 10 * 1024
                    }
                }
            },
            {
                test: /\.(eot|woff2?|ttf|svg)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            name: '[name]-[hash:5].min.[ext]',
                            limit: 5000, // fonts file size <= 5KB, use 'base64'; else, output svg file
                            publicPath: 'fonts/',
                            outputPath: 'fonts/'
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            filename: "index.html", // 最终创建的文件名
            template: path.resolve(__dirname, '..', "src/template.html"), // 指定模板路径
            minify: {
                collapseWhitespace: true // 去除空白
            }
        }),
        new webpack.ProvidePlugin({ $: 'jquery' }),
        // happypack
        new HappyPack({
            //用id来标识 happypack处理那里类文件
            id: 'happyBabel',
            //如何处理  用法和loader 的配置一样
            loaders: [{
                loader: 'babel-loader?cacheDirectory=true',
            }],
            //共享进程池threadPool: HappyThreadPool 代表共享进程池，即多个 HappyPack 实例都使用同一个共享进程池中的子进程去处理任务，以防止资源占用过多。
            threadPool: happyThreadPool,
            //允许 HappyPack 输出日志
            verbose: true,
        }),
        // css单独提取
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css" 
        }),
        new HappyPack({
            id: 'less',
            threads: 4,
            loaders: [
              {
                loader: 'css-loader',
                options: {
                    importLoaders: 1,
                    modules: true,
                    localIdentName: '[local]___[hash:base64:5]'
                }
              },
              'postcss-loader',
              {
                loader: 'less-loader',
                options: {
                    modifyVars: { '@primary-color': '"#2d5da7"', '@CDN_BASE': '""' },
                    javascriptEnabled: true
                }
              }
            ],
        })
    ],
    performance: false // 关闭性能提示
};
