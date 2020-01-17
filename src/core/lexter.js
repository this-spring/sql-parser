/*
 * @Author: xiuquanxu
 * @Company: kaochong
 * @Date: 2020-01-15 23:02:39
 * @LastEditors  : xiuquanxu
 * @LastEditTime : 2020-01-17 17:19:25
 */

// 词法解析
var Types = {
  UNKNOWN: 0, // 未知
  KEYWORD: 1, // 关键字
  NUMBER: 2, // 数字
  STRING: 3, // 字符串
  FUNCTION: 4, // 函数名
  VARIABLE: 5, // 变量
  PARAMS: 6, // 绑定值
  OPERATOR: 7, // 运算符
  COMMAS: 8, // 标点
  MEMORY: 9,

  COMMENT: 99, // 注释
}
// var 

// 			"SELECT /*/ /** 我是注释 **/ 123, `password`, MD5(\"123456\") FROM mysql.user WHERE user=\"测试\\\"引号\" AND host!='%'"
// /***fsdfsafsadfsf */
var parseSQL = function(query, options) {
  var template =  query;
  console.log('start parseSQL:', template);
  var tmp = '', cur = '', sub = '', pre = '';
  var i = 0, len = template.length, token = '';
  for (;i < len; i += 1) {
    var cur = template.charAt(i);
    // 注释
    if (cur === '/' &&  template.charAt(i + 1) === '*') {
      options.start(Types.COMMENT);
      var res = handleComment();
      token = options.end(Types.COMMENT, res);
    }
    // 字符串 词法解析器字符串只允许使用',""作为字符串
    else if("'" === cur || '"' === cur) {
      options.start(Types.STRING);
      var res = handleString();
      token = options.end(Types.STRING, res);
    }
    // 标点
    else if (/^[\,;\(\)]+$/.test(cur)) {
      options.start(Types.COMMAS);
      var res = handleCommas();
      token = options.end(Types.COMMAS, res);
    }
    // 关键字
    else if (/^[a-z_]+$/i.test(cur)) {
      options.start(Types.KEYWORD);
      var res = handleKeyWord();
      token = options.end(Types.KEYWORD, res);
    }
    // 变量: select name, age from person, 变量是name和age
    // 运算符
    else if (/^(\+|\-|\*|\/|>|<|=|!)$/.test(cur)) {
      options.start(Types.OPERATOR);
      var res = handleOperator();
      token = options.end(Types.OPERATOR, res);
    }
    // 数字
    // else if (('-' === cur && pre .type!== )) {

    // }
    pre = token;
  }
  options.allEnd();
  // 函数名
  function handleKeyWord() {
    let sub = '', res = template.charAt(i);
    while(i < template.length) {
      i ++;
      sub = template.charAt(i);
      if (!(/^[\w\.:]+$/i.test(sub))) {
        break;
      }
      res += sub;
    }
    return res;
  }
  // 数字
  function handleNumber() {

  }
  // 运算符
  function handleOperator() {
    let res = cur;
    while(i < template.length && /^(\+|\-|\*|\/|>|<|=|!)$/.test(template.charAt(i + 1))) {
      res += template.charAt(i + 1);
      i ++;
    }
    return res;
  }
  // 标点
  function handleCommas() {
    return cur;
  }
  // 字符串
  function handleString() {
    let sub;
    let start = i + 1, end = i;
    i ++;
    while(i < template.length && cur !== (sub = template.charAt(i))) {
      // console.log(template.charAt(i));
      i ++;
    }
    end = i;
    return template.substring(start, end);
  }
  // 注释
  function handleComment() {
    let sub = '', next = '', res = '';
    let start = i, end = i;
    i += 2; // 跳过/*
    while(i < template.length) {
      sub = template.charAt(i);
      next = template.charAt(i + 1);
      if ('*' === sub && '/' === next) {
        end = i + 1;
        res = template.substring(start, end + 1);
        i++;
        break;
      }
      i ++;
    }
    // advance(end - start + 1);
    return res;
  }
  // 跳跃字符
  function advance (n) {
    i += n;
  }

}

// const template = "SELECT /*/ /** 我是注释 **/ 123, /** 456 **/`password`, MD5(\"123456\") FROM mysql.user WHERE user="测"引号\" AND host!='%'";
const template = `select * /**  这是一个注释 **/ from table where name='xxq' and age >= '21'`;
var tokens = [];
var tokenKey = {
  type: Types.UNKNOWN,
  text: '',
};
var createTokenTemplate = function(type, text) {
  return {
    type,
    text,
  }
}
parseSQL(template, {
  // 钩子
  start(type) {
    console.log(`start  type:${type}`);
  },
  end(type, res) {
    var token = createTokenTemplate(type, res);
    tokens.push(token);
    console.log(`end res:${res}`);
  },
  allEnd() {
    console.log(`\nallend allRes: \n`, tokens)
  }
});
