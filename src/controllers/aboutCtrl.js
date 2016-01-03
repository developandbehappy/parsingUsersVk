vkApp.controller('AboutCtrl', function ($scope, $http, $q, vkApiService, vkFetchDataService) {
  $scope.groupId = '2';
  $scope.showloadingStats = false;
  $scope.totalPost = 0;
  $scope.totalLikes = 0;
//  setInterval(function () {
//    $scope.totalPost++;
//    $scope.$apply();
//    console.log(",,,,,,,");
//  }, 500);
  $scope.searchBtnHandler = function () {
    destroyData();
    var idWall = $scope.groupId;
    var fetchWallData = vkFetchDataService.fetchWallData(idWall, 500, 20);
    $scope.showloadingStats = true;
    var fetchPostLikeDataPromise = fetchWallData.then(function (response) {
      return vkFetchDataService.fetchPostLikeData(response);
    }, function (error) {
      console.log('error', error);
      return false;
    }, function (notify) {
      console.log('notify', notify);
      $scope.totalPost = ($scope.totalPost + notify.postCount);
      $scope.totalLikes = ($scope.totalLikes + notify.likesCount);
      return false;
    });

    fetchPostLikeDataPromise.then(function (response) {
      console.log('wwww', response);
    }, function (error) {

    }, function (notify) {
      console.log('notify', notify);
    });
  };

  var destroyData = function () {
    $scope.showloadingStats = false;
    $scope.totalPost = 0;
    $scope.totalLikes = 0;
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