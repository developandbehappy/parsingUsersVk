vkApp.factory('vkFetchDataService', function (vkApiService, $q) {
  var api = {
    wallGet: function wallGet(opt) {
      opt = opt || {};
      opt.count = 100;
      var queryString = JSON.stringify(opt);
      return "API.wall.get(" + queryString + ")";
    },
    likeGet: function likeGet(opt) {
      opt = opt || {};
      opt.type = 'post';
      var queryString = JSON.stringify(opt);
      return "API.likes.getList(" + queryString + ")";
    }
  };

  return {
    fetchWallData: function (groupId, postsSize, streamCount) {
      var deferred = $q.defer();
      var postsLength = postsSize;
      var vkScriptRequestList = [];
      var resultList = [];
      for (var i = 0; i < postsLength; i += 100) {
        var vkScriptRequest = api.wallGet({owner_id: groupId, offset: i});
        vkScriptRequestList.push(vkScriptRequest);
      }
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
          var tempResult = [];
          var nextStep = true;
          response.data.response.forEach(function (item) {
            var itemSize = _.size(item);
            if (itemSize > 1) {
              var data = item.splice(1);
              tempResult.push(data);
            } else {
              nextStep = false;
            }
          });
          var notifyData = finishNotifyFilter({
            type: 'temp',
            data: tempResult
          });
          deferred.notify(notifyData);
          resultList.push(tempResult);
          if (nextStep) {
            getData();
          } else {
            deferred.resolve(finishResponseFilter(resultList));
            return false;
          }
        });
      };
      getData();
      var finishResponseFilter = function (list) {
        var wallDataResult = list.reduce(function (previousValue, currentItem) {

          return previousValue.concat(currentItem);
        }).reduce(function (previousValue, currentItem) {
          return previousValue.concat(currentItem);
        });
        wallDataResult = wallDataResult.filter(function (item) {
          return item.likes.count > 0;
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
        return wallDataResult.splice(0, postsSize);
      };
      var finishNotifyFilter = function (opt) {
        var data = opt.data.reduce(function (previousValue, currentItem) {
          return previousValue.concat(currentItem);
        });
        var likesCount = _.sum(data, function (item) {
          return item.likes.count;
        });
        return {
          postCount: _.size(data),
          likesCount: likesCount
        };
      };

      return deferred.promise;
    },
    fetchLikesData: function (groupId, postItemId, likeSize, streamCount) {
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
        var vkScriptRequest = api.likeGet({
          owner_id: groupId,
          offset: i,
          count: count,
          item_id: postItemId
        });
        vkScriptRequestList.push(vkScriptRequest);
      }
      var getData = function () {
        if (vkScriptRequestList.length === 0) {
          deferred.resolve(finishResponseFilter(arrData));
          return false;
        }
        var dataForRequest = vkScriptRequestList.splice(0, streamCount);
        var vkScriptCode = "return [" + dataForRequest.join() + "];";
        vkApiService.execute({
          code: vkScriptCode
        }).then(function (response) {
          var sortDataArr = response.data.response.filter(function (item) {
            return item.users.length > 0
          });

          sortDataArr.map(function (item) {
            arrData.push(item.users);
          });
          getData();
        });
      };
      getData();
      return deferred.promise;
    },
    fetchPostLikeData: function (wallDataList) {
      var arrDataUsersLike = wallDataList;
      arrDataUsersLike = arrDataUsersLike.filter(function (item) {
        var likeSize = item.likeCount;
        return likeSize > 1000;
      });
      var deferred = $q.defer();
      var resultList = [];
      var self = this;
      var go = function () {
        if (arrDataUsersLike.length === 0) {
          deferred.resolve(finishResponseFilter(resultList));
          return false;
        }
        var dataForRequest = arrDataUsersLike.splice(0, 1)[0];
        var groupId = dataForRequest.groupId;
        var likeCount = dataForRequest.likeCount;
        var postId = dataForRequest.postId;
        self.fetchLikesData(groupId, postId, likeCount, 20).then(function (response) {
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
          return false;
        }
        return list.reduce(function (previousValue, currentItem) {
          return previousValue.concat(currentItem);
        });
      };
      go();
      return deferred.promise;
    },
    fetchLikesDataLess1k: function (postIdList, streamCount) {
      var postList = postIdList.filter(function (item) {
        var likeSize = item.likeCount;
        return likeSize > 0 && likeSize <= 1000;
      });
      var deferred = $q.defer();
      var vkScriptRequestList = [];
      var resultList = [];
      postList.forEach(function (item) {
        var vkScriptRequest = api.likeGet({
          owner_id: item.groupId,
          offset: 0,
          count: 1000,
          item_id: item.postId
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
            return previousValue.concat(currentItem);
          });
          resultList.push(preResultData);
          setTimeout(function () {
            deferred.notify(preResultData.length);
            getData();
          }, 600);
        });
      };
      getData();
      var finishResponseFilter = function (list) {
        if (list.length === 0) {
          return false;
        }
        return list.reduce(function (previousValue, currentItem) {
          return previousValue.concat(currentItem);
        });
      };
      return deferred.promise;
    }
  }
});