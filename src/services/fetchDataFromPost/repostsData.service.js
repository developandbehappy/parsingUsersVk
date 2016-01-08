vkApp.factory('getRepostsCount', function (vkApiService, $q) {
  var api = {
    repostsGet: function repostsGet(opt) {
      opt = opt || {};
      opt.type = 'post';
      var queryString = JSON.stringify(opt);
      return "API.wall.getReposts(" + queryString + ")";
    }
  };
  return {
    fetchRepostsData: function (groupId, postItemId, likeSize, streamCount) {
      var log = debug('vkApp:fetchLikesData');
      log("[fetchLikesData] likeSize->", likeSize);
      log("[fetchLikesData] postItemId->", postItemId);
      var finishResponseFilter = function (list) {
        return list.reduce(function (previousValue, currentItem) {
          return previousValue.concat(currentItem);
        });
      };
      var count = 1000;
      var deferred = $q.defer();
      var vkScriptRequestList = [];
      var arrData = [];
      for (var i = 0; i < likeSize; i += count) {
        var vkScriptRequest = api.repostsGet({
          owner_id: groupId,
          offset: i,
          count: count,
          post_id: postItemId
        });
        vkScriptRequestList.push(vkScriptRequest);
      }
      var getData = function () {
        if (vkScriptRequestList.length === 0) {
          var userList = arrData.reduce(function (previousValue, currentItem) {
            return previousValue.concat(currentItem);
          });
          log('[fetchLikesData] finish likeSize->', _.size(userList));
          log("[fetchLikesData] finish postItemId->", postItemId);
          deferred.resolve(finishResponseFilter(arrData));
          log("............................");
          return false;
        }
        var dataForRequest = vkScriptRequestList.splice(0, streamCount);
        var vkScriptCode = "return [" + dataForRequest.join() + "];";
        vkApiService.execute({
          code: vkScriptCode
        }).then(function (response) {
          var sortDataArr = response.data.response.filter(function (item) {
            return item.items.length > 0
          });
          sortDataArr.map(function (item) {
            arrData.push(item.items);
          });
          getData();
        });
      };
      getData();
      return deferred.promise;
    },
    fetchPostRepostData: function (wallDataList) {
      var arrDataUsersRepost = wallDataList;
      arrDataUsersRepost = arrDataUsersRepost.filter(function (item) {
        var repostSize = item.repostCount;
        return repostSize > 1000;
      });
      var repostCount = _.sum(arrDataUsersRepost, function (item) {
        return item.repostCount;
      });
      var deferred = $q.defer();
      var resultList = [];
      var self = this;
      var go = function () {
        if (arrDataUsersRepost.length === 0) {
          deferred.resolve(finishResponseFilter(resultList));
          return false;
        }
        var dataForRequest = arrDataUsersRepost.splice(0, 1)[0];
        var groupId = dataForRequest.groupId;
        var repostCount = dataForRequest.repostCount;
        var postId = dataForRequest.postId;
        self.fetchRepostsData(groupId, postId, repostCount, 20).then(function (response) {
//          console.log('response', response);
          resultList.push(response);
          setTimeout(function () {
            deferred.notify(response.length);
            go();
          }, 600);
        });
      };
      var finishNotifyFilter = function (opt) {
        return {
          count: _.size(opt.data.response)
        };
      };
      var finishResponseFilter = function (list) {
        if (list.length === 0) {
          return [];
        }
        return list.reduce(function (previousValue, currentItem) {
          return previousValue.concat(currentItem);
        });
      };

      go();
      return deferred.promise;
    }
    ,
    fetchRepostsDataLess1k: function (postIdList, streamCount) {
      var log = debug('vkApp:fetchRepostsDataLess1k');
      log('postIdList->', postIdList);
      var deferred = $q.defer();
      var postList = postIdList.filter(function (item) {
        var repostSize = item.repostCount;
        return repostSize > 0 && repostSize <= 1000;
      });
      log('post_size->', _.size(postList));
      var vkScriptRequestList = [];
      var resultList = [];
      postList.forEach(function (item) {
        var vkScriptRequest = api.repostsGet({
          owner_id: item.groupId,
          offset: 0,
          count: 1000,
          post_id: item.postId
        });
        vkScriptRequestList.push(vkScriptRequest);
      });
      var getData = function () {
        if (vkScriptRequestList.length === 0) {
          deferred.resolve(finishResponseFilter(resultList));
          return false;
        }
        var dataForRequest = vkScriptRequestList.splice(0, streamCount);
        var vkScriptCode = "return [" + dataForRequest.join() + "];";
        vkApiService.execute({
          code: vkScriptCode
        }).then(function (response) {
          var preResultData = response.data.response;
          var resultData = [];
          preResultData = preResultData.map(function (item) {
            item.items.map(function (item) {
              if (item.to_id.toString()[0] === '-') {
                return false;
              }
              resultData.push(item.to_id);
            });
            return resultData;
          }).reduce(function (previousValue) {
            return previousValue;
          });
          resultList.push(preResultData);
          setTimeout(function () {
            deferred.notify(preResultData.length);
            getData();
          }, 600);
        });
      };
      var finishResponseFilter = function (list) {
        if (list.length === 0) {
          return [];
        }
        return list.reduce(function (previousValue, currentItem) {
          return previousValue.concat(currentItem);
        });
      };
      getData();
      return deferred.promise;
    }
  }
});