vkApp.controller('AboutCtrl', function ($scope, $http, $q, vkApiService, vkFetchDataService) {
  $scope.groupId = '-74598451';
//  $scope.groupId = '80651295'; // zd
  $scope.showloadingStats = false;
  $scope.isShowlistPeople = false;
  $scope.totalPost = 0;
  $scope.totalLikes = 0;
  $scope.totalPeople = 0;
  $scope.finishResultList = [];
  $scope.searchBtnHandler = function () {
    destroyData();
    var idWall = $scope.groupId;
    var fetchWallData = vkFetchDataService.fetchWallData(idWall, 10000, 20);
    $scope.showloadingStats = true;
    var fetchPostLikeDataPromise = fetchWallData.then(function (response) {
      console.log('response', response);
      return vkFetchDataService.fetchLikesDataLess1k(response, 23);
    }, function (error) {
      console.log('error', error);
      return false;
    }, function (notify) {
      $scope.totalPost = formatNumber($scope.totalPost, notify.postCount);
      $scope.totalLikes = formatNumber($scope.totalLikes, notify.likesCount);
      return false;
    });

    fetchPostLikeDataPromise.then(function (response) {
      var res = sortLikes(response);
      $scope.finishResultList = res;
      console.log('$scope.finishResultList', $scope.finishResultList);
      console.log('res', res);
      $scope.isShowlistPeople = true;
    }, function (error) {

    }, function (notify) {
      if (!notify) {
        return false;
      }
      $scope.totalPeople = formatNumber($scope.totalPeople, notify.count);
    });
  };

  var destroyData = function () {
    $scope.showloadingStats = false;
    $scope.totalPost = 0;
    $scope.totalLikes = 0;
    $scope.isShowlistPeople = false;
    $scope.finishResultList = [];
  };
  var replaceAll = function (str, s, r) {
    return str.toString().split(s).join(r);
  };
  var formatNumber = function (prevVal, currentVal) {
    prevVal = replaceAll(prevVal, ' ', '');
    prevVal = parseInt(prevVal);
    var num = currentVal + prevVal;
    return accounting.formatNumber(num, 0, " ");
  };
//
  var sortLikes = function (list) {
    var userLikesResultObject = _.countBy(list);
    var arr = [];
    for (var prop in userLikesResultObject) {
      if (userLikesResultObject.hasOwnProperty(prop)) {
        arr.push({
          'key': prop,
          'value': userLikesResultObject[prop]
        });
      }
    }
    var result = _.sortBy(arr, function (item) {
      return -item.value;
    });
    return result.slice(0, 100);
  };
//
//  console.log('userLikesResult', _.countBy(userLikesResult));
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