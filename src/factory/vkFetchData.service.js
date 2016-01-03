vkApp.factory('vkFetchDataService', function (vkApiService, $q) {
  return {
    fetchWallData: function (groupId, postsSize, streamCount) {
      console.log('groupId', groupId);
      var deferred = $q.defer();
      var postsLength = postsSize;
      var api = {
        wallGet: function wallGet(opt) {
          opt = opt || {};
          return "API.wall.get(" +
            "{\"owner_id\": " + opt.owner_id + ", \"offset\": " + opt.offset + ", \"count\": 100}" + ")";
        }
      };
      var vkScriptRequestList = [];
      var resultList = [];
      for (var i = 0; i < postsLength; i += 100) {
        var vkScriptRequest = api.wallGet({owner_id: groupId, offset: i});
        vkScriptRequestList.push(vkScriptRequest);
      }
      console.log('vkScriptRequestList', vkScriptRequestList.length);
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
          console.log('response', response);
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
          console.log('tempResult', tempResult);
          console.log('tempResult', _.size(tempResult));
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
        console.log('list', list);
        var wallDataResult = list.reduce(function (previousValue, currentItem) {

          return previousValue.concat(currentItem);
        }).reduce(function (previousValue, currentItem) {
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
      var count = 1000;
      var deferred = $q.defer();
      var api = {
        likeGet: function likeGet(opt) {
          opt = opt || {};
          return "API.likes.getList(" +
            "{\"owner_id\": " + opt.owner_id + ", \"offset\": " + opt.offset + "," +
            " \"item_id\": " + opt.item_id + "," +
            " \"type\": \"post\", \"count\": " + count + "}" + ")";
        }
      };
      var vkScriptRequestList = [];
      var arrData = [];
      for (var i = 0; i < likeSize; i += count) {
        var vkScriptRequest = api.likeGet({owner_id: groupId, offset: i, item_id: postItemId});
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
      var finishResponseFilter = function (list) {
        return list.reduce(function (previousValue, currentItem) {
          return previousValue.concat(currentItem);
        });
      };
      return deferred.promise;
    },
    fetchPostLikeData: function (wallDataList) {
      var arrDataUsersLike = wallDataList;
      var deferred = $q.defer();
      var arrDataResult = [];
      var self = this;
      var go = function () {
        if (arrDataUsersLike.length === 0) {
          deferred.resolve(arrDataResult);
          return false;
        }
        var dataForRequest = arrDataUsersLike.splice(0, 1)[0];
        var groupId = dataForRequest.groupId;
        var likeCount = dataForRequest.likeCount;
        var postId = dataForRequest.postId;
        self.fetchLikesData(groupId, postId, likeCount, 20).then(function (response) {
          var tempData = {
            groupId: groupId,
            postId: postId,
            response: response
          };
          arrDataResult.push(tempData);
          var notifyData = finishNotifyFilter({
            type: 'temp',
            data: tempData
          });
          deferred.notify(notifyData);
          setTimeout(function () {
            go();
          }, 400);
        });
      };
      go();
      var finishNotifyFilter = function (opt) {
        return {
          count: _.size(opt.data.response)
        };
      };

      return deferred.promise;
    }
  }
});