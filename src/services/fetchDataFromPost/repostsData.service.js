vkApp.factory('getRepostsCount', function (vkApiService, $q, vkResponseService) {
  var TIMEOUT = {
    RECURSION: 600
  };
  var api = {
    repostsGet: function repostsGet(opt) {
      opt = opt || {};
      opt.type = 'post';
      var queryString = JSON.stringify(opt);
      return "API.wall.getReposts(" + queryString + ")";
    }
  };
  var finishHandlerRepostList = function (list) {
    return list.reduce(function (prevVal, currentVal) {
      if (_.isArray(prevVal)) {
        return prevVal.concat(currentVal.items);
      }
      return prevVal.items.concat(currentVal.items);
    }).filter(function (item) {
      return Number(item.to_id) > 0;
    }).map(function (item) {
      return item.to_id;
    });
  };
  return {
    /**
     * Получает Данные поста и отдает id пользователей, которые поделились записью
     * @param groupId - id группы.
     * @param postItemId - id поста.
     * @param repostsSize - Кол-во репостов у поста
     * @param streamCount - Кол-во количество потоков за раз от 1 до 25. Рекомендуем 20.
     * @returns {*|jQuery.promise|promise.promise|promise|Function|Deferred.promise}
     */
    fetchRepostsData: function (groupId, postItemId, repostsSize, streamCount) {
      var log = debug('vkApp:fetchRepostsData');
      log("[fetchRepostsData] repostsSize->", repostsSize);
      log("[fetchRepostsData] postItemId->", postItemId);
      var finishResponseFilter = function (list) {
        return list;
      };
      var count = 1000;
      var deferred = $q.defer();
      var vkScriptRequestList = [];
      var arrData = [];
      for (var i = 0; i < repostsSize; i += count) {
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
//          log('[fetchRepostsData] finish repostsSize->', _.size(userList));
          log("[fetchRepostsData] finish postItemId->", postItemId);
          deferred.resolve(finishResponseFilter(arrData));
          log("............................");
          return false;
        }
        var dataForRequest = vkScriptRequestList.splice(0, streamCount);
        var vkScriptCode = "return [" + dataForRequest.join() + "];";
        vkApiService.execute({
          code: vkScriptCode
        }).then(function (serverResponse) {
          var response = vkResponseService(serverResponse.data);
          if (response.hasNotError()) {
            var data = response.getResponse();
            var tempData = finishHandlerRepostList(data);
            arrData = tempData;
          } else {
            var errorCode = response.getErrorCode();
            var errorMessage = response.getErrorMessage();
            log("[fetchRepostsData] errorCode->", errorCode);
            log("[fetchRepostsData] errorMessage->", errorMessage);
          }

//          var responseData = response.data.response;
//          vkResponseService(response);
//          var sortData = responseData.map(function (item) {
//            item.items.map(function (item) {
//              arrData.push(item.to_id);
//            });
//          });
          getData();
        });
      };
      getData();
      return deferred.promise;
    },
    /**
     * Отдает массив с id пользователя которые делились записями где репостов больше 1000
     * @param wallDataList -  массив данных стены в таком формате
     * {
       * commentCount: 0, - Количество комментариев
       * groupId: 80651295, id страницы
       * likeCount: 2, Кол-во лайков
       * postId: 3600, Номер поста, страницы
       * repostCount: 0, количество репостов
     * }
     * @returns {*|jQuery.promise|promise.promise|promise|Function|Deferred.promise}
     */
    fetchPostRepostData: function (wallDataList) {
      var log = debug('vkApp:fetchPostRepostData');
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
          }, TIMEOUT.RECURSION);
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
    },

    /**
     *
     * @param postIdList -  массив данных стены в таком формате
     * {
       * commentCount: 0, - Количество комментариев
       * groupId: 80651295, id страницы
       * likeCount: 2, Кол-во лайков
       * postId: 3600, Номер поста, страницы
       * repostCount: 0, количество репостов
     * }
     * @param streamCount - Кол-во количество потоков за раз от 1 до 25. Рекомендуем 20.
     * @returns {*|jQuery.promise|promise.promise|promise|Function|Deferred.promise}
     */
    fetchRepostsDataLess1k: function (postIdList, streamCount) {
      var log = debug('vkApp:fetchRepostsDataLess1k');
      var deferred = $q.defer();
      var postList = postIdList.filter(function (item) {
        var repostSize = item.repostCount;
        return repostSize > 0 && repostSize <= 1000;
      });
      log('postIdList->', postIdList);
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
        }).then(function (serverResponse) {
          var response = vkResponseService(serverResponse.data);
          var tempData = [];
          if (response.hasNotError()) {
            var data = response.getResponse();
            tempData = finishHandlerRepostList(data);
          } else {
            console.log('%c ERROR', 'background: red; color: white');
            console.log("error_code:", response.getErrorCode());
            console.log("error_mes:", response.getErrorMessage());
          }
          if (!_.isEmpty(tempData)) {
            resultList.push(tempData);
          }
          setTimeout(function () {
            deferred.notify(tempData.length);
            getData();
          }, TIMEOUT.RECURSION);
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