const mysql = require('mysql')

const connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'bao584520',
	database: 'node'
})

connection.connect(function(err) {
	if (err) {
		throw new Error('connect error')
		return
	}
})

//发布文章
exports.createArticle = function(author, title, content, pv, dateStr, callback) {
	const create = `INSERT INTO article (author, title, content, pv, date) VALUES('${author}', '${title}', '${content}', ${pv}, '${dateStr}')`
	connection.query(create, function(err, result) {
		callback(err, result)
	})
}
//根据id查询文章
exports.findArticleById = function(id, callback) {
	const find = `SELECT * FROM article WHERE id=${id}`
	connection.query(find, function(err, result) {
		callback(err, result)
	})
}
//根据用户名查询文章
exports.findAllArticleByAuthor = function(author, callback) {
	const find = `SELECT * FROM article WHERE author='${author}'`
	connection.query(find, function(err, result) {
		callback(err, result)
	})
}
//查询所有文章
exports.findAllArticle = function(callback) {
	const find = `SELECT * FROM article`
	connection.query(find, function(err, result) {
		callback(err, result)
	})
}
//编辑文章
exports.updateArticleById = function(id, title, content, date, callback) {
	const update = `UPDATE article SET title='${title}',content='${content}',date='${date}' WHERE id=${id}`
	connection.query(update, function(err, result) {
			callback(err, result)
	})
}
//浏览数量
exports.increasePvById = function(id, pv, callback) {
	const updatePv = `UPDATE article SET pv=${pv} WHERE id=${id}`
	connection.query(updatePv, function(err, result) {
			callback(err, result)
	})
}
//根据id删除文章
exports.deleteArticleById = function(id, callback) {
		const deleteArticle = `DELETE FROM article WHERE id=${id}`
		connection.query(deleteArticle, function(err, result) {
				callback(err, result)
		})
}
//根据文章id获取留言数量
exports.getCommentNumberById = function(id, callback) {
	console.log(id)
	const getComments = `SELECT * FROM comments WHERE aid=${id} ORDER BY date DESC,cid DESC`
	connection.query(getComments, function(err, result) {
			callback(err, result)
	})
}
//发表留言
exports.addComment = function(comment, aid, date, name, avatar, callback) {
		const add = `INSERT INTO comments (comment, aid, date, name, avatar) 	VALUES ('${comment}', ${aid}, '${date}', '${name}', '${avatar}')`
		connection.query(add, function(err, result) {
				callback(err, result)
		})
}
//删除留言
exports.deleteCommentByCid = function(cid, callback) {
	var deleteMsg = `DELETE FROM comments WHERE cid=${cid}`
	connection.query(deleteMsg, function(err, result) {
			callback(err, result)
	})
}
