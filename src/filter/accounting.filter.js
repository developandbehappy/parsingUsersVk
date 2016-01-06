vkApp.filter('accounting', function() {
  return function(input) {
    return accounting.formatNumber(input, 0, " ");
  };
});