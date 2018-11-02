module.exports = {
  port: 3000,
  session: {
    secret: 'myblog',
    key: 'myblog',
    maxAge: 2592000000
  }
}

/*
 
 	port: 程序启动要监听的端口号
	session: express-session 的配置信息，后面介绍
 
 */