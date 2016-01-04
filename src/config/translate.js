vkApp.config(['$translateProvider', function ($translateProvider) {
  $translateProvider.translations('en', {
    'PARSER_TITLE': 'Wall parsing in vk',
    'HOME_TITLE': 'Home',
    'LIKE_SEARCH': 'Likes',
    'REPOSTS_SEARCH': 'Reposts',
    'COMMENTS_SEARCH': 'Comments',
    'GO_SEARCH': 'GO',
    'WALL_PARSER': 'id group',
    'COUNT_POST': 'Count posts',
    'COUNT_LIKE': 'All likes',
    'COUNT_DOWNLOAD': 'Download likes',
    'ID_USER': 'id user',
    'COUNT_LIKES_BY_USER': 'count like',
    'LINK_USER': 'link user'
  });

  $translateProvider.translations('ru', {
    'PARSER_TITLE': 'Парсинг стены в вконтакте',
    'HOME_TITLE': 'Домой',
    'LIKE_SEARCH': 'Лайки',
    'REPOSTS_SEARCH': 'Репосты',
    'COMMENTS_SEARCH': 'Комментарии',
    'GO_SEARCH': 'Искать',
    'WALL_PARSER': 'id группы',
    'COUNT_POST': 'Количество постов',
    'COUNT_LIKE': 'Всего лайков',
    'COUNT_DOWNLOAD': 'Загружено',
    'ID_USER': 'id-пользователя',
    'COUNT_LIKES_BY_USER': 'количество лайков',
    'LINK_USER': 'страница пользователя'
  });

  $translateProvider.preferredLanguage('en');
  $translateProvider.useStorage('translateStorage');
}]);