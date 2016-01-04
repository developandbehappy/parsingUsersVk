var fs = require('fs');
var urlencode = require('urlencode');

var replaceAll = function (find, replace, str) {
  //noinspection JSDuplicatedDeclaration
  var find = find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  return str.replace(new RegExp(find, 'g'), replace);
};

var i = 1;
var dir = './result';

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

fs.readFile('code_list.txt', 'utf8', function (err, data) {
  if (err) {
    return console.log(err);
  }
  var list = data.split('\n');
  list.forEach(function (item) {
    var res = urlencode.decode(item, 'gbk');
    res = replaceAll('@', '_$', res);
    res = "(function () {" + res + "});";
    var fileName = 'result/code_' + i + ".js";
    fs.writeFileSync(fileName, res);
    i++;
  });
});

