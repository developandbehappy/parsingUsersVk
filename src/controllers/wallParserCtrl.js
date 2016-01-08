vkApp.controller('wallParserCtrl', function ($timeout,
                                             $scope,
                                             $http,
                                             $q,
                                             vkApiService,
                                             vkFetchDataService,
                                             vkFetchLikeDataService,
                                             getRepostsCount,
                                             vkResponseService) {
  var log = debug('vkApp:wallParser');
  log('hello from wall parser');
  var finishResultList = [];
  $scope.searchParams = {
    status: false
  };

  $scope.showloadingStats = false;
  $scope.isShowlistPeople = false;
  $scope.actionSearchForm = {
    disabled: false
  };
  $scope.actionSearchButton = {
    disabled: false
  };
  $scope.actionDownloadButton = {
    disabled: true
  };
  $scope.parse = {
    link: '1',
    type: 'reposts',
    count: '100'
  };

//  $scope.parse.link = 'https://vk.com/id256611307'; // ALLAH
  //  $scope.parse.link = '80651295'; // Bog
    $scope.parse.link = 'https://vk.com/anonbusinessman'; // Bog

  

  $scope.totalPost = 0;
  $scope.totalLikes = 0;
  $scope.totalReposts = 0;
  $scope.totalComments = 0;
  $scope.totalPeople = 0;
  $scope.finishResultList = [];
  $scope.searchBtnHandler = function () {
    destroyData();
    var buildIdWall = function (data) {
      if (data.type === 'user') {
        return data.id;
      }
      return -data.id;
    };
    var idWall = buildIdWall($scope.searchParams.data);
    var fetchWallData = vkFetchDataService.fetchWallData(idWall, $scope.parse.count, 20);
    $scope.showloadingStats = true;
    $scope.actionSearchButton.disabled = true;
    $scope.actionSearchForm.disabled = true;
    var arrAllData = [];
    var wallDataList = [];
    fetchWallData.then(function (response) {
      wallDataList = response;
      if ($scope.parse.type === 'likes') {
        return vkFetchLikeDataService.fetchPostLikeData(_.cloneDeep(wallDataList), 20);
      } else if ($scope.parse.type === 'reposts') {
        return getRepostsCount.fetchPostRepostData(_.cloneDeep(wallDataList), 20);
      } else {
        console.log('comments');
      }
    }, function (error) {
      console.log('error', error);
      return false;
    }, function (notify) {
      $scope.totalPost = formatNumber($scope.totalPost, notify.postCount);
      $scope.totalLikes = formatNumber($scope.totalLikes, notify.likesCount);
      return false;
    }).then(function (response) {
      arrAllData = arrAllData.concat(response);
      if ($scope.parse.type === 'likes') {
        return vkFetchLikeDataService.fetchLikesDataLess1k(_.cloneDeep(wallDataList), 20);
      } else if ($scope.parse.type === 'reposts') {
        return getRepostsCount.fetchRepostsDataLess1k(_.cloneDeep(wallDataList), 5);
      } else {
        console.log('comments');
      }
    }).then(function (response) {
      arrAllData = arrAllData.concat(response);
      return arrAllData;
    }).then(function (finisResponseForSort) {
      var sortData = sortLikes(finisResponseForSort);
      finishResultList = sortData;
      var top100 = sortData.slice(0, 100);
      var dataForUserRequest = top100.map(function (item) {
        return item.key;
      });
      return $q.all([vkFetchLikeDataService.vkFetchUserData(dataForUserRequest), top100]);
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
      $scope.finishTop100Result = top100;
      $scope.finishAllResult = finishResultList;
      $scope.isShowlistPeople = true;
      $scope.actionDownloadButton.disabled = false;
      $scope.actionSearchButton.disabled = false;
      $scope.actionSearchForm.disabled = false;
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
  $scope.$watch('searchParams', function (current) {
    $scope.actionSearchButton.disabled = !current.status;
    // TODO: need fix strange bug
  }, true);

  $scope.downloadButtonHandler = function (type, count) {
    var result = [];
    if (count) {
      result = result.slice(0, count);
    }
    result = result.map(function (item) {
      return type === 'csv' ? {vk_id: item.key, like_count: item.value} : {vk_id: item.key};
    });
    var idPageParse = $scope.searchParams.data.id;
    var csvResult = Papa.unparse(result);
    var blob = new Blob([csvResult], {type: "text/plain;charset=utf-8"});
    var fileName = "report" + idPageParse + "." + type;
    saveAs(blob, fileName);
  };
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