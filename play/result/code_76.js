(function () {
  var a = [94317831, 92786022, 146418008, 146397893, 75656323, 73228117, 93144868, 98448739, 130906175, 130350110, 139493261, 258060358, 257594787, 137733645, 21567840, 22063664, 121176203, 119969041, 150256893, 149978933, 141399044, 141236995, 86601630, 86377006, 145422291], ans = [], i = 0;
  while (i < a.length) {
    ans.push(API.friends.get({user_id: a[i], count: 1}).count);
    i = i + 1;
  }
  return ans;
});