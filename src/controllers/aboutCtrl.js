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
            groupId: item.from_id
          });
      });
      vkFetchDataService.fetchPostLikeData(postIdList);
//      var postId = postIdList[0].postId;
//      var groupId = postIdList[0].groupId;
//      vkFetchDataService.fetchLikesData(groupId, postId, 10000, 20).then(function (response) {
//        console.log('response', response);
//      });
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