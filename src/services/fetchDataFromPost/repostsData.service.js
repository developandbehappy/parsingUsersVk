vkApp.factory('getRepostsCount', function (vkApiService, $q, vkFetchLikeDataService) {
  var api = {
    repostsGet: function repostsGet(opt) {
      opt = opt || {};
      opt.type = 'post';
      var queryString = JSON.stringify(opt);
      return "API.wall.getReposts(" + queryString + ")";
    }
  };
  return {
    fetchPostRepostData: function (wallDataList) {
      var arrDataUsersRepost = wallDataList;
      arrDataUsersRepost = arrDataUsersRepost.filter(function (item) {
        var repostSize = item.repostCount;
        return repostSizeSize > 1000;
      });
      var repostCount = _.sum(arrDataUsersRepost, function (item) {
        return item.repostCount;
      });
      console.log("[fetchPostRepostData] repostCount->", repostCount);
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
        console.log('item', item);
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
          preResultData = preResultData.map(function (item) {
            return item.users;
          }).reduce(function (previousValue, currentItem) {
            if (!previousValue) {
              return []
            }
            return previousValue.concat(currentItem);
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