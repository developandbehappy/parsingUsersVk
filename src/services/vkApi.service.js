vkApp.factory('vkApiService', function ($http) {
  var apiLink = 'https://api.vk.com/method/';
  return {
    buildLink: function (method, params, token) {
      var tokenResult = "";
      var paramsResult = "";
      if (token) {
        tokenResult = token;
      } else {
        tokenResult = "e6a7fdabe815a97ca64dfc68be83d420f1cb16b955e3d8d202d8c98d25d70372e7eb656645863d6d7f983";
      }
      
      if (params) {
        for (key in params) {
          if (params.hasOwnProperty(key)) {
            paramsResult += key + '=' + params[key] + '&';
          }
        }
        return apiLink + method + '?' + paramsResult + 'access_token=' + tokenResult;
      } else {
        return apiLink + method + '?access_token=' + tokenResult;
      }
    },
    getWall: function (params, token) {
      var url = this.buildLink('wall.get', params, token);
      return $http.get(url);
    },
    execute: function (params, token) {
      var url = this.buildLink('execute', params, token);
      return $http.get(url);
    },
    userGet: function (params, token) {
      var url = this.buildLink('users.get', params, token);
      return $http.get(url);
    },
    likesGetList: function (params, token) {
      var url = this.buildLink('likes.getList', params, token);
      return $http.get(url);
    }
  }
});