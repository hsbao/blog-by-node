const sha1 = require('sha1')
const express = require('express')
const router = express.Router()
const nodeCookie = require('node-cookie')
const checkNotLogin = require('../middlewares/check').checkNotLogin

const mysql = require('../lib/db.js')

// GET /signin 登录页
router.get('/', checkNotLogin, function (req, res, next) {
  res.render('signin')
})

// POST /signin 用户登录
router.post('/', checkNotLogin, function (req, res, next) {
  const name = req.fields.name
  const password = req.fields.password	
  // 校验参数
  try {
    if (!name.length) {
      throw new Error('请填写用户名')
    }
    if (!password.length) {
      throw new Error('请填写密码')
    }
  } catch (e) {
    req.flash('error', e.message)
    return res.redirect('back')
  }
	
	mysql.findUserInfo(name, function(err, result) {
		if (err) {
			req.flash('error', '用户不存在')
      return res.redirect('back')
		}
		// 检查密码是否匹配
    if (sha1(password) !== result[0].password) {
      req.flash('error', '用户名或密码错误')
      return res.redirect('back')
    }
    req.flash('success', '登录成功')
    // 用户信息写入 session
    delete result[0].password
    req.session.user = result[0]
    nodeCookie.create(res, 'user', result[0])
    // 跳转到主页
    res.redirect('/posts')
	})
})

module.exports = router