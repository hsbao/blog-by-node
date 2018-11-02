const express = require('express')
const router = express.Router()
const marked = require('marked')
const nodeCookie = require('node-cookie')
const moment = require('moment')
const checkLogin = require('../middlewares/check').checkLogin

const mysql = require('../lib/articleDB')
const userDB = require('../lib/db')
// GET /posts 所有用户或者特定用户的文章页
//   eg: GET /posts?author=xxx
router.get('/', function (req, res, next) {
	const author = nodeCookie.get(req, 'user')
	if (author) {
		console.log(author)
		mysql.findAllArticleByAuthor(author.name, function(err, result) {
			if (err) {
				req.flash('error', '获取文章失败')
				return res.redirect('back')
			}
			if (result.length == 0) {
				return  res.render('posts', {
				        	result: []
				      	})
			}
			console.log(result)
			for (let i = 0; i < result.length; i++) {
					result[i].content = marked(result[i].content)
					mysql.getCommentNumberById(result[i].id, function(err, result2) {
							if (err) {
								return
							}
							result[i].comments = result2
							userDB.findUserInfo(author.name, function(err, result1) {
									if (err) {
										req.flash('error', '用户不存在')
							      		return res.redirect('back')
									}
									result[i].avatar = result1[0].avatar
						    	if (i === result.length - 1) {
											res.render('posts', {
						        		result: result
						      		})
						    	}
							})
					})
			}
		})
	} else {
		res.redirect('/home')
	}

})
// GET /posts/create 发表文章页
router.get('/create', checkLogin, function (req, res, next) {
  	res.render('create')
})
router.post('/create', checkLogin, function (req, res, next) {
	const author = nodeCookie.get(req, 'user')
	const title = req.fields.title
	const content = req.fields.content
	const dateStr = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
	try {
		if (!title.length) {
	      	throw new Error('请填写标题')
	    }
	    if (!content.length) {
	      	throw new Error('请填写内容')
	    }
	} catch (e) {
		req.flash('error', e.message)
    	return res.redirect('back')
	}
	mysql.createArticle(author.name, title, content, 0, dateStr, function(err, result) {
		if (err) {
			req.flash('error', '发表失败')
			return res.redirect('/posts/create')
		}
		req.flash('success', '发表成功')
    	res.redirect(`/posts/${result.insertId}`)
	})
})

router.get('/:postId', function (req, res, next) {
	const id = req.params.postId
	mysql.findArticleById(id, function(err, result) {
			if (err) {
				req.flash('error', '获取文章失败')
				return res.redirect('back')
			}
			result[0].content = marked(result[0].content)
			mysql.increasePvById(id, result[0].pv + 1, function(err, result2) {
				if (err) {
					 throw new Error('increase error')
				}
			})
			mysql.getCommentNumberById(id, function(err, result3) {
					if (err) {
						return
					}
					result[0].comments = result3
					console.log(result3)
					userDB.findUserInfo(result[0].author, function(err, result1) {
						if (err) {
							req.flash('error', '用户不存在')
					     return res.redirect('back')
						}
						result[0].avatar = result1[0].avatar
						result[0].pv += 1
					  res.render('post', {
					    post: result[0],
							comments: result3
					  })
					})
			})
		})
})

router.get('/:postId/edit', function(req, res, next) {
	const id = req.params.postId
	const author = nodeCookie.get(req, 'user').name
	console.log(author)
	mysql.findArticleById(id, function(err, result) {
		if (err) {
			req.flash('error', '文章不存在')
			return res.redirect('back')
		}
		console.log(result)
		if (result[0].author !== author) {
			req.flash('error', '您没有权限修改这篇文章')
		}
		res.render('edit', {
			post: result[0]
		})
	})

})

router.post('/:postId/edit', function(req, res, next) {
	const id = req.params.postId
	const author = nodeCookie.get(req, 'user').name
	const title = req.fields.title
	const content = req.fields.content
	const dateStr = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
	try {
			if (!title.length) {
					throw new Error('请填写标题')
			}
			if (!content.length) {
					throw new Error('请填写内容')
			}
	} catch (e) {
			req.flash('error', e.message)
			return res.redirect('back')
	}
	mysql.updateArticleById(id, title, content, dateStr, function(err, result) {
		if (err) {
			req.flash('error', '文章不存在')
			return res.redirect('back')
		}

		res.redirect(`/posts/${id}`)
	})
})

router.get('/:postId/delete', function(req, res, next) {
	const id = req.params.postId
	mysql.deleteArticleById(id, function(err, result) {
		if (err) {
			req.flash('error', '删除文章失败')
			return res.redirect('back')
		}
		req.flash('success', '删除成功')
		res.redirect('/posts')
	})
})

module.exports = router
