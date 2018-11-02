var mysql = require('mysql');

//增删改查都在query

var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'bao584520',
	database: 'node'
});

connection.connect(function(err) {
	if (err) {
		return;
	};
	console.log('数据库连接成功');
});

//插入数据
exports.insert = function(name, password, avatar, gender, bio, callback) {
	var insertData = "INSERT INTO user (name, password, avatar, gender, bio) VALUES ('" + name + "','" + password +"','" + avatar +"','" + gender +"','" + bio +"')"
	connection.query(insertData, function(err, result) {
		callback(err, result);
	});
}

//查询数据
exports.find = function(callback){
	var selectData = 'SELECT * FROM user';
	connection.query(selectData, function(err, result){
		callback(err, result);
	});
}
//查询用户数据
exports.findUserInfo = function(name, callback) {	
	var selectData = `SELECT * FROM user WHERE name='${name}'`
	connection.query(selectData, function(err, result) {
		callback(err, result)
	})
}

//删除数据
exports.deleteUser = function(id, callback) {
	var deleteDate = "DELETE FROM user WHERE id=" + id;
	connection.query(deleteDate, function(err, result) {
		callback(err, result);
	});
}


//修改数据
exports.update = function(id, name, psw, callback) {
	var sql = "UPDATE user SET username='" + name + "',password='" + psw +"'WHERE id=" + id;
	console.log(sql);
	connection.query(sql, function(err, result) {
		callback(err, result);
	});
}