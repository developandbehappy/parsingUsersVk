vkApp.config(['$translateProvider', function ($translateProvider) {
  $translateProvider.translations('en', {
    'ABOUT_TITLE': 'About us',
    'HOME_TITLE': 'Home',
    'LIKE_SEARCH': 'Likes',
    'REPOSTS_SEARCH': 'Reposts',
    'COMMENTS_SEARCH': 'Comments',
    'GO_SEARCH': 'GO',
    'WALL_PARSER': 'id group'
  });

  $translateProvider.translations('ru', {
    'ABOUT_TITLE': 'О нас',
    'HOME_TITLE': 'Домой',
    'LIKE_SEARCH': 'Лайки',
    'REPOSTS_SEARCH': 'Репосты',
    'COMMENTS_SEARCH': 'Комментарии',
    'GO_SEARCH': 'Искать',
    'WALL_PARSER': 'id группы'
  });

  $translateProvider.preferredLanguage('en');
  $translateProvider.useStorage('translateStorage');
}]);