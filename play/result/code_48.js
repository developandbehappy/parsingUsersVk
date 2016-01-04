(function () {
  var user_ids = [14803113, 73354073];
  var queriesPerStep = parseInt(25 / user_ids.length), ans = [];
  while (ans.length < user_ids.length) {
    var owner_id = user_ids[ans.length];
    var api = 0;
    var guests = {user_id: owner_id};
    var allVideoComments = [];
    var allVideoCommentsVids = [];
    var allPostComments = [];
    var allPostCommentsPids = [];
    var photos = API.photos.getAll({owner_id: owner_id, extended: 1, count: 200}).items;
    api = api + 1;
    var photosComments = API.photos.getAllComments({owner_id: owner_id, need_likes: 1, count: 100}).items;
    api = api + 1;
    var videos = API.video.get({owner_id: owner_id, extended: 1, count: 200}).items;
    api = api + 1;
    if (videos) {
      var i = 0;
      var maxQ = queriesPerStep >= 25 ? 2 : 0;
      while (i < videos.length && maxQ > 0) {
        if (videos[i].comments > 0) {
          var vComments = API.video.getComments({
            owner_id: videos[i].owner_id,
            video_id: videos[i].id,
            need_likes: 1,
            count: 100,
            sort: "desc"
          }).items;
          api = api + 1;
          if (vComments) {
            allVideoComments = allVideoComments + vComments;
            allVideoCommentsVids.push({vid: videos[i].id, len: vComments.length});
          }
          maxQ = maxQ - 1;
        }
        i = i + 1;
      }
    }
    var wall = API.wall.get({owner_id: owner_id, count: 100}).items;
    api = api + 1;
    if (wall) {
      var i = 0;
      while (i < wall.length) {
        if (wall[i].comments.count > 0) {
          var pComments = API.wall.getComments({
            owner_id: owner_id,
            post_id: wall[i].id,
            need_likes: 1,
            count: 100,
            sort: "desc"
          }).items;
          api = api + 1;
          if (pComments) {
            allPostComments = allPostComments + pComments;
            allPostCommentsPids.push({pid: wall[i].id, len: pComments.length});
          }
          if (api >= queriesPerStep)i = wall.length;
        }
        i = i + 1;
      }
    }
    guests.photos = {id: photos_$.id, date: photos_$.date, likes: photos_$.likes_$.count};
    guests.videos = {id: videos_$.id, date: videos_$.date, likes: videos_$.likes_$.count};
    guests.wall = {id: wall_$.id, from_id: wall_$.from_id, date: wall_$.date, likes: wall_$.likes_$.count};
    guests.photosComments = {
      id: photosComments_$.id,
      from_id: photosComments_$.from_id,
      date: photosComments_$.date,
      likes: photosComments_$.likes_$.count,
      pid: photosComments_$.pid
    };
    guests.videoComments = {
      id: allVideoComments_$.id,
      from_id: allVideoComments_$.from_id,
      date: allVideoComments_$.date,
      likes: allVideoComments_$.likes_$.count
    };
    guests.videoCommentsVids = allVideoCommentsVids;
    guests.postComments = {
      id: allPostComments_$.id,
      from_id: allPostComments_$.from_id,
      date: allPostComments_$.date,
      likes: allPostComments_$.likes_$.count
    };
    guests.postCommentsPids = allPostCommentsPids;
    ans.push(guests);
  }
  return ans;
});