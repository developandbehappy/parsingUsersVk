(function () {
  var a = [13967445, 91559525, 90427682, 160187511, 159744325, 193252179, 193095529, 135073666, 135005068, 176651270, 175706030, 250929874, 249505833, 172459505, 177099031, 98938178, 95046610, 142530247, 142283649, 266991342, 26672228, 210358288, 207528092, 101391322, 10065038], ans = [], i = 0;
  while (i < a.length) {
    ans.push(API.friends.get({user_id: a[i], count: 1}).count);
    i = i + 1;
  }
  return ans;
});