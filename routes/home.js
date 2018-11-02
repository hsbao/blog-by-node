const express = require('express')
const router = express.Router()
const marked = require('marked')
const nodeCookie = require('node-cookie')
const moment = require('moment')
const checkLogin = require('../middlewares/check').checkLogin

const mysql = require('../lib/articleDB')
const userDB = require('../lib/db')

router.get('/', function(req, res, next) {
  mysql.findAllArticle(function(err, result) {
    if (err) {
        req.flash('error', '获取文章失败')
        return res.redirect('back')
    }
    if (result.length == 0) {
        return  res.render('home', {
            result: []
        })
    }
    for (let i = 0; i < result.length; i++) {
      result[i].content = marked(result[i].content)
      mysql.getCommentNumberById(result[i].id, function(err, result2) {
          if (err) {
            return
          }
          result[i].comments = result2
          userDB.findUserInfo(result[i].author, function(err, result1) {
              if (err) {
                  req.flash('error', '用户不存在')
                  return res.redirect('back')
              }
              result[i].avatar = result1[0].avatar
              if (i === result.length - 1) {
                  res.render('home', {
                    result: result
                  })
              }
          })
      })
    }
  })
})
module.exports = router
