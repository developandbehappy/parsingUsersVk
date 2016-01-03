vkApp.controller('AboutCtrl', function ($scope, $http, $q, vkApiService, vkFetchDataService) {
  $scope.groupId = '-43215063';
  $scope.searchBtnHandler = function () {
    var idWall = $scope.groupId;
    var fetchWallData = vkFetchDataService.fetchWallData(idWall, 15, 20);
    fetchWallData.then(function (response) {
      var postIdList = [];
      response[0].map(function (item) {
        postIdList.push({
            postId: item.id,
            groupId: item.from_id,
            countLike: item.likes.count,
            countRepost: item.reposts.count,
            countComment: item.comments.count
          });
      });
      vkFetchDataService.fetchPostLikeData(postIdList);
    });
  };
  var getLengthPosts = function (groupId) {
    var countMax = 0;
    var url = vkApiService.wallGet({
      owner_id: groupId
    });
    return url.then(function (response) {
      return countMax = response.data.response[0];
    });
  };
  var postLikeGet = function () {

  }
});