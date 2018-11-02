const express = require('express')
const router = express.Router()
const nodeCookie = require('node-cookie')
const moment = require('moment')
const checkLogin = require('../middlewares/check').checkLogin

const mysql = require('../lib/articleDB')

// POST /comments 创建一条留言
router.post('/', checkLogin, function (req, res, next) {
  const userMsg = nodeCookie.get(req, 'user')
  const content = req.fields.content
  const aid = req.fields.postId
  const dateStr = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
  if (!userMsg) {
    req.flash('error', '需登录后才可留言。')
    return res.redirect('/signin')
  }
  // 校验参数
  try {
    if (!content.length) {
      throw new Error('请填写留言内容')
    }
  } catch (e) {
    req.flash('error', e.message)
    return res.redirect('back')
  }

  mysql.addComment(content, aid, dateStr, userMsg.name, userMsg.avatar, function(err, result) {
    if (err) {
      req.flash('error', '发表留言失败')
      return res.redirect('back')
    }
    res.redirect(`/posts/${aid}`)
  })
})

// GET /comments/:commentId/remove 删除一条留言
router.get('/:commentId/delete', checkLogin, function (req, res, next) {
  const cid = req.params.commentId
  mysql.deleteCommentByCid(cid, function(err, result) {
      if (err) {
        req.flash('error', '删除留言失败')
        return res.redirect('back')
      }
      res.redirect('back')
  })
})

module.exports = router
