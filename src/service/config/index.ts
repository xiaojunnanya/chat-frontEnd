export const TIMEOUT = 10000

// 设置开发环境和生产环境
export let BASE_URL = ''
export let SOCKET_CHAT_URL = ''
export let SOCKET_CANVAS_URL = ''
if(process.env.NODE_ENV === 'development'){
    BASE_URL = 'http://localhost:9002'
    SOCKET_CHAT_URL = 'ws://localhost:4000'
    SOCKET_CANVAS_URL = 'ws://localhost:4001'
    // BASE_URL = 'http://62.234.178.157:9002'
    // SOCKET_BASE_URL = 'http://62.234.178.157:4000'
}else{
    BASE_URL = 'http://62.234.178.157:9002'
    SOCKET_CHAT_URL = 'http://62.234.178.157:4000'
    SOCKET_CANVAS_URL = 'http://62.234.178.157:4001'
}