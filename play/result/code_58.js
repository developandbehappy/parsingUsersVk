(function () {
  var a = [8002386, 79153116, 141151420, 142916364, 224445966, 223925626, 80255730, 204371534, 211230512, 92530688, 91023545, 21381879, 2219942, 53033274, 52867077, 132792470, 133956167, 143126756, 143115521, 248539003, 125280488, 124239055, 57146747, 56926135, 131489387], ans = [], i = 0;
  while (i < a.length) {
    ans.push(API.friends.get({user_id: a[i], count: 1}).count);
    i = i + 1;
  }
  return ans;
});