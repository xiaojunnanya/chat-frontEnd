const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports=function(app){
    app.use(
        createProxyMiddleware('/api',{//`api`是需要转发的请求 
            // target:'http://62.234.178.157:9002',// 这里是接口服务器地址
            target:'http://localhost:9002',// 这里是接口服务器地址
            changeOrigin:true,
            pathRewrite:{
                "^/api":""
            }
        })
    )
}