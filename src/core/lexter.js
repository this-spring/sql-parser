
// 词法解析
var Types = {
  UNKNOWN: 0, // 未知
  KEYWORD: 1, // 关键字
  NUMBER: 2, // 数字

  COMMENT: 99, // 注释
}
// var 

// 			"SELECT /*/ /** 我是注释 **/ 123, `password`, MD5(\"123456\") FROM mysql.user WHERE user=\"测试\\\"引号\" AND host!='%'"
// /***fsdfsafsadfsf */
var parseSQL = function(query, options) {
  var template =  query;
  var tmp = '', cur = '', sub = '';
  var i = 0, len = template.length;
  for (;i < len; i += 1) {
    var cur = template.charAt(i);
    // var next = temp
    if (cur === '/' &&  template.charAt(i + 1) === '*') {
      options.start(Types.COMMENT);
      var res = handleComment();
      options.end(Types.COMMENT, res);
    }
  }
  options.allEnd();
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
    return res;
  }
}

const template = "SELECT /*/ /** 我是注释 **/ 123, /** 456 **/`password`, MD5(\"123456\") FROM mysql.user WHERE user=\"测试\\\"引号\" AND host!='%'";
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
    tokens.push(createTokenTemplate(type, res));
    console.log(`end res:${res}`);
  },
  allEnd() {
    console.log(`allend allRes:`, tokens)
  }
});
console.log(tokens);
