(function () {
  var a = [7167951, 7167952, 7167953, 7167954, 7167955, 7167956, 7167957, 7167958, 7167959, 7167960, 7167961, 7167962, 7167963, 7167964, 7167965, 7167966, 7167967, 7167968, 7167969, 7167970, 7167971, 7167972, 7167973, 7167974, 7167975], ans = [], i = 0;
  while (i < a.length) {
    ans.push(API.friends.get({user_id: a[i], count: 1}).count);
    i = i + 1;
  }
  return ans;
});