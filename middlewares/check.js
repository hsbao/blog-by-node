module.exports = {
	checkLogin: function checkLogin(req, res, next) {
		const nodeCookie = require('node-cookie')
		const author = nodeCookie.get(req, 'user')
		if (!author) {
	      req.flash('error', '未登录')
	      return res.redirect('/signin')
	    }
	    next()
	},
  	checkNotLogin: function checkNotLogin (req, res, next) {
  		const nodeCookie = require('node-cookie')
		const author = nodeCookie.get(req, 'user')
	    if (author) {
	      req.flash('error', '已登录')
	      return res.redirect('back')// 返回之前的页面
	    }
	    next()
  	}
}
