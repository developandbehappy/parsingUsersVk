(function () {

  var nameOrId = "durov";
  var type = "slug"; //slug or user or group or page

  if (type == "slug") {
    var resolveScreenNameResponse = API.utils.resolveScreenName({
      screen_name: nameOrId
    }); // user, group, application, page
    type = resolveScreenNameResponse.type;
    nameOrId = resolveScreenNameResponse.object_id;
  }
  if (type == "user") {
    var userRes =  API.users.get({
      user_ids: nameOrId,
      fields: "photo_max,city,followers_count,counters"
    });
    var friendsRes = API.friends.get({
      user_id: nameOrId
    });
    var friendsCount = friendsRes.length;
    return {
      type: type,
      id: nameOrId,
      friendsCount: friendsCount,
      data: userRes[0]
    };
  }
  if (type == "group") {
    var groupRes = API.groups.getById({
      group_id: nameOrId
    });
    var followersRes = API.groups.getMembers({
      group_id: nameOrId,
      count: 1
    });
    var followersCount = followersRes.count;

    return {
      type: type,
      id: nameOrId,
      followersCount: followersCount,
      data: groupRes
    };
  }
});