vkApp.factory('translateStorage', function (localStorageService) {
  return {
    put: function (name, value) {
      return localStorageService.set(name, value);
    },
    get: function (name) {
      return localStorageService.get(name);
    }
  };
});