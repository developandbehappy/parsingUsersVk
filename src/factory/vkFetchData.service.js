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
          result = response.data.response.map(function (item) {
            arrData.push(item.splice(1));
          });
          getData();
        });
      };
      getData();
    return deferred.promise;
    }
  }
});