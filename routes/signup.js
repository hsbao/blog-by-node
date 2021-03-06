const fs = require('fs')
const path = require('path')
const sha1 = require('sha1')
const express = require('express')
const nodeCookie = require('node-cookie')
const router = express.Router()
const checkNotLogin = require('../middlewares/check').checkNotLogin

const mysql = require('../lib/db.js')

// GET /signup 注册页
router.get('/', checkNotLogin, function (req, res, next) {
  res.render('signup')
})

// POST /signup 用户注册
router.post('/', checkNotLogin, function (req, res, next) {
  const name = req.fields.name
  const gender = req.fields.gender
  const bio = req.fields.bio
  const avatar = req.files.avatar.path.split(path.sep).pop()
  let password = req.fields.password
  const repassword = req.fields.repassword

  // 校验参数
  try {
    if (!(name.length >= 1 && name.length <= 10)) {
      throw new Error('名字请限制在 1-10 个字符')
    }
    if (['男', '女', '保密'].indexOf(gender) === -1) {
      throw new Error('性别只能是 男、女 或 保密')
    }
    if (!(bio.length >= 1 && bio.length <= 30)) {
      throw new Error('个人简介请限制在 1-30 个字符')
    }
    if (!req.files.avatar.name) {
      throw new Error('缺少头像')
    }
    if (password.length < 6) {     
      throw new Error('密码至少 6 个字符')
    }
    if (password !== repassword) {
      throw new Error('两次输入密码不一致')
    }
  } catch (e) {
    // 注册失败，异步删除上传的头像
    fs.unlink(req.files.avatar.path)
    req.flash('error', e.message)
    return res.redirect('/signup')
  }

	// 明文密码加密
  password = sha1(password)
  let user = {
    name: name,
    gender: gender,
    bio: bio,
    avatar: avatar
  }
  // 用户信息写入数据库
  mysql.insert(name, password, avatar, gender, bio, function(err, result){
		if (err) {
			// 注册失败，异步删除上传的头像
      fs.unlink(req.files.avatar.path)
      req.flash('error', '用户名已被占用')
      return res.redirect('/signup')
		}
    //user = result[0]
    // 删除密码这种敏感信息，将用户信息存入 session
    req.session.user = user
    nodeCookie.create(res, 'user', user)
    // 写入 flash
    req.flash('success', '注册成功')
    // 跳转到首页
    res.redirect('/posts')
	})
})

module.exports = router
