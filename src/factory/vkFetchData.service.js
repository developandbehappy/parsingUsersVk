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
      var arrData = [];
      for (var i = 0; i < postsLength; i += 100) {
        var vkScriptRequest = api.wallGet({owner_id: groupId, offset: i});
        vkScriptRequestList.push(vkScriptRequest);
      }
      console.log('vkScriptRequestList', vkScriptRequestList.length);
      var getData = function () {
        if (vkScriptRequestList.length === 0) {
          deferred.resolve(arrData);
          return false;
        }
        var dataForRequest = vkScriptRequestList.splice(0, streamCount);
        var vkScriptCode = "return [" + dataForRequest.join() + "];";
        vkApiService.execute({
          code: vkScriptCode
        }).then(function (response) {
          response.data.response.map(function (item) {
            arrData.push(item.splice(1));
          });
          getData();
        });
      };
      getData();
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
          deferred.resolve(arrData);
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
//      debugger;
      var arrDataUsersLike = wallDataList;
      console.log('arrDataUsersLike.length', arrDataUsersLike.length);
      var deferred = $q.defer();
      var arrDataResult = [];
      var self = this;
      var go = function () {
        if (arrDataUsersLike.length === 0) {
          console.log('%c RESOLVE!!!', 'background: #000; color: #f90');
          deferred.notify({
            type: 'complete',
            data: arrDataResult
          });
          deferred.resolve(arrDataResult);
          return false;
        }
        var dataForRequest = arrDataUsersLike.splice(0, 1)[0];
        console.log('dataForRequest', dataForRequest);
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
          deferred.notify({
            type: 'temp',
            data: tempData
          });
          console.log('response post: ' + postId, response);
          setTimeout(function () {
            go();
          }, 250);
        });
      };
      go();
      return deferred.promise;
    }
  }
});