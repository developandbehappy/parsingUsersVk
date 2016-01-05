var str = "https://vk.com/event100";
//var str = "httpseven$/t100";
var res = str.replace(/[\w|:|\/|.]+/, '');

console.log('res', res.length === 0);

console.log('str', str);