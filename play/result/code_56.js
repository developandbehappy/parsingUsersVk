(function () {
  var a = [154497571, 153584374, 37711088, 37612928, 100347827, 106873958, 122681774, 122670715, 238110765, 237095274, 132425523, 132224073, 228722231, 234598183, 122441406, 122108404, 95918681, 95791660, 204737742, 137940856, 137899966, 26924645, 269128920, 17059911, 170454126], ans = [], i = 0;
  while (i < a.length) {
    ans.push(API.friends.get({user_id: a[i], count: 1}).count);
    i = i + 1;
  }
  return ans;
});