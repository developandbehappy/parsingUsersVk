vkApp.controller('AboutCtrl', function ($scope, $http, $q, vkApiService, vkFetchDataService) {
  $scope.groupId = '-43215063';
  $scope.searchBtnHandler = function () {
    var idWall = $scope.groupId;
    var fetchWallData = vkFetchDataService.fetchWallData(idWall, 10, 20);
    var fetchWallDataPromise = fetchWallData.then(function (response) {
      console.log('response', response);
      var wallDataResult = response.reduce(function (previousValue, currentItem) {
        return previousValue.concat(currentItem);
      });
      wallDataResult = wallDataResult.map(function (item) {
        return {
          postId: item.id,
          groupId: item.from_id,
          likeCount: item.likes.count,
          repostCount: item.reposts.count,
          commentCount: item.comments.count
        };
      });
      return vkFetchDataService.fetchPostLikeData(wallDataResult.slice(0, 3));
    }, function (error) {
      console.log('error', error);
      return false;
    }, function (notify) {
      console.log('notify', notify);
      return false;
    }).then(function (rrr) {
      console.log('rrr', rrr);
    }, function (error) {
      console.log('error', error);
      return false;
    }, function (notify) {
      console.log('notify', notify);
      return false;
    });

//    fetchWallDataPromise.then(function (response) {
//      console.log('response', response);
//    }, function (error) {
//
//    }, function (notify) {
//
//    });
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