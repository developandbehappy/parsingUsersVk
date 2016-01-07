vkApp.factory('vkFetchDataService', function (vkApiService, $q) {
  var api = {
    wallGet: function wallGet(opt) {
      opt = opt || {};
      opt.count = 100;
      var queryString = JSON.stringify(opt);
      return "API.wall.get(" + queryString + ")";
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
    }
  }
});