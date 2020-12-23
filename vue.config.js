module.exports = {
    devServer: {
        port: 80,
        proxy: {
            '/api': {
                target: 'http://47.92.150.78:8080',
                changeOrigin: true,
            },
            '/register':{
                target: 'http://47.92.150.78:8080',
                changeOrigin: true,
            }

        },
    },
};
