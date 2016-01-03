vkApp.controller('AboutCtrl', function ($scope, $http, $q, vkApiService, vkFetchDataService) {
  $scope.groupId = '2';
  $scope.showloadingStats = false;
  $scope.totalPost = 0;
  $scope.totalLikes = 0;
  $scope.totalPeople = 0;
  $scope.searchBtnHandler = function () {
    destroyData();
    var idWall = $scope.groupId;
    var fetchWallData = vkFetchDataService.fetchWallData(idWall, 10000, 20);
    $scope.showloadingStats = true;
    var fetchPostLikeDataPromise = fetchWallData.then(function (response) {
      return vkFetchDataService.fetchPostLikeData(response);
    }, function (error) {
      console.log('error', error);
      return false;
    }, function (notify) {
      console.log('notify', notify);
      $scope.totalPost = formatNumber($scope.totalPost, notify.postCount);
      $scope.totalLikes = formatNumber($scope.totalLikes, notify.likesCount);
      return false;
    });

    fetchPostLikeDataPromise.then(function (response) {
      console.log('wwww', response);
    }, function (error) {

    }, function (notify) {
      if (!notify) {
        return false;
      }
      console.info('notify.count', notify);
      $scope.totalPeople = formatNumber($scope.totalPeople, notify.count);
    });
  };

  var destroyData = function () {
    $scope.showloadingStats = false;
    $scope.totalPost = 0;
    $scope.totalLikes = 0;
  };
  var replaceAll = function (str, s, r) {
    return str.toString().split(s).join(r);
  };
  var formatNumber = function (prevVal, currentVal) {
    console.log('prevVal', prevVal);
    prevVal = replaceAll(prevVal, ' ', '');
    prevVal = parseInt(prevVal);
    console.log('prevVal', prevVal);
    var num = currentVal + prevVal;
    return accounting.formatNumber(num, 0, " ");
  };
//  var getLengthPosts = function (groupId) {
//    var countMax = 0;
//    var url = vkApiService.wallGet({
//      owner_id: groupId
//    });
//    return url.then(function (response) {
//      return countMax = response.data.response[0];
//    });
//  };
//  var postLikeGet = function () {
//
//  }
});