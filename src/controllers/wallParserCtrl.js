vkApp.controller('wallParserCtrl', function ($scope, $http, $q, vkApiService, vkFetchDataService) {
  var log = debug('vkApp:wallParser');

  log('hello from wall parser');

//  $scope.vkLink = '-86002878'; // MUSIC GROUP
//  $scope.vkLink = '-33338722'; // https://vk.com/public33338722
//  $scope.vkLink = '80651295'; // zd
//  $scope.vkLink = '339650720';
//  $scope.vkLink = '80651295'; // zd
  $scope.vkLink = 'mdk'; // zd
//  $scope.vkLink = '16930784'; // zd
//  $scope.vkLink = '-10639516'; // MDK
  $scope.showloadingStats = false;
  $scope.isShowlistPeople = false;
  $scope.actionSearchButton = {
    disabled: false
  };
  $scope.actionDownloadButton = {
    disabled: true
  };
  $scope.totalPost = 0;
  $scope.totalLikes = 0;
  $scope.totalPeople = 0;
  $scope.finishResultList = [];
//  throw  new Error("dasd");
//  console.log("---");

//  vkFetchDataService.fetchWallData($scope.vkLink, 10000, 20).then(function (wall_res) {
//    console.log('wallDataRes', wall_res);
//    return vkFetchDataService.fetchPostLikeData(wall_res, 23);
//  }).then(function (res) {
//    console.log('res', res);
//  });

  $scope.searchBtnHandler = function () {
    destroyData();
    var idWall = $scope.vkLink;
    var fetchWallData = vkFetchDataService.fetchWallData(idWall, 100, 20);
    $scope.showloadingStats = true;
    $scope.actionSearchButton.disabled = true;
    var arrAllData = [];
    var wallDataList = [];
    fetchWallData.then(function (response) {
      console.log('response', response);
      wallDataList = response;
      return vkFetchDataService.fetchPostLikeData(_.cloneDeep(wallDataList), 23);
    }, function (error) {
      console.log('error', error);
      return false;
    }, function (notify) {
      $scope.totalPost = formatNumber($scope.totalPost, notify.postCount);
      $scope.totalLikes = formatNumber($scope.totalLikes, notify.likesCount);
      return false;
    }).then(function (response) {
//      debugger;
      arrAllData = arrAllData.concat(response);
      return vkFetchDataService.fetchLikesDataLess1k(_.cloneDeep(wallDataList), 23);
    }).then(function (response) {
      arrAllData = arrAllData.concat(response);
      return arrAllData;
    }).then(function (finisResponseForSort) {
//      debugger;
      var sortData = sortLikes(finisResponseForSort);
      var top100 = sortData.slice(0, 100);
      var dataForUserRequest = top100.map(function (item) {
        return item.key;
      });
      return $q.all([vkFetchDataService.vkFetchUserData(dataForUserRequest), top100]);
    }, function (error) {

    }, function (notify) {
      if (!notify) {
        return false;
      }
      $scope.totalPeople = formatNumber($scope.totalPeople, notify);
    }).then(function (resultList) {
      var responseVkList = resultList[0];
      var top100 = resultList[1];
      top100.map(function (item) {
        var vkId = parseInt(item.key);
        var data = responseVkList.filter(function (item) {
          return item.uid === vkId;
        });
        item.data = data[0];
        return item;
      });
      $scope.finishResultList = top100;
      $scope.isShowlistPeople = true;
      $scope.actionDownloadButton.disabled = false;
      $scope.actionSearchButton.disabled = false;
    })
  };

  var destroyData = function () {
    $scope.showloadingStats = false;
    $scope.totalPost = 0;
    $scope.totalLikes = 0;
    $scope.totalPeople = 0;
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
    console.log('list', list);
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
    return _.sortBy(arr, function (item) {
      return -item.value;
    });
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