/*
 * @Author: xiuquanxu
 * @Company: kaochong
 * @Date: 2020-01-15 01:13:11
 * @LastEditors: xiuquanxu
 * @LastEditTime: 2020-01-17 15:55:34
 */
var Tool = require('./sqlParseTool.js');
var Lexter = require('./lexter.js');
var selectToken = require('./parsers/select');
var updateToken = require('./parsers/update');
var insertToken = require('./parsers/insert');
var deleteToken = require('./parsers/delete');

var parsers = {};
parsers['select'] = selectToken;
parsers['update'] = updateToken;
parsers['insert'] = insertToken;
parsers['delete'] = deleteToken;
// function init(){
//   require('fs').readdirSync(__dirname + '/parsers').forEach(function(file) {
//     var match   = file.match(/^(\w+)\.js$/);
//       if (!match) {
//         return;
//       }
//       parsers[match[1].trim().toLowerCase()] = require(__dirname + '/parsers/' + file);
//   });
// }
// init();

// exports.parse = function(sql) {
//   sql = sql.trim();
//   var who = sql.substr(0,sql.indexOf(' ')).toLowerCase();
//   if(parsers[who] === undefined){
//     throw new Error("Unsupport sentence");
//   }
//   return  parsers[who].createObj(sql);
// }

function parse(sql) {
  sql = sql.trim();
  var who = sql.substr(0,sql.indexOf(' ')).toLowerCase();
  console.log('-->' + who);
  if(parsers[who] === undefined){
    throw new Error("Unsupport sentence");
  }
  return  parsers[who].createObj(sql);
}
// var sql = "SELECT /*/ /** 我是注释 **/ 123, `password`, MD5(\"123456\") FROM mysql.user WHERE user=\"测试\\\"引号\" AND host!='%";
const sql = `select * /**  这是一个注释 **/ from table where name='xxq' and age='21'`;
console.log(JSON.stringify(parse(sql)));
exports.RELATE = Tool.RELATE;
exports.JOIN = Tool.JOIN;
exports.ORDER = Tool.ORDER;
exports.types = Lexter.types;
