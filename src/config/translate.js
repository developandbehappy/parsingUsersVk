vkApp.config(['$translateProvider', function ($translateProvider) {
  $translateProvider.translations('en', {
    'PARSER_TITLE': 'Wall parsing in',
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
    'LINK_USER': 'link user',
    'DOWNLOAD_PARSER': 'Download result data',
    'DOWNLOAD_PARSER_CSV_100': 'Download first 100-th results in',
    'DOWNLOAD_PARSER_CSV_ALL': 'Download all result in',
    'DOWNLOAD_PARSER_TXT_100': 'Download first 100-th results in',
    'DOWNLOAD_PARSER_TXT_ALL': 'Download all result in',
    'HOME_LINK': 'Home',
    'WALL_PARSER_LINK': 'Wall parser',
    'FOLLOWERS_COUNT': 'Count followers:',
    'FRIENDS_COUNT': 'Count friends:',
    'PHOTOS_COUNT': 'Count photos'

  });

  $translateProvider.translations('ru', {
    'PARSER_TITLE': 'Парсинг стены',
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
    'LINK_USER': 'страница пользователя',
    'DOWNLOAD_PARSER': 'Скачать результат',
    'DOWNLOAD_PARSER_CSV_100': 'Скачать первые 100 в',
    'DOWNLOAD_PARSER_CSV_ALL': 'Скачать все в',
    'DOWNLOAD_PARSER_TXT_100': 'Скачать первые 100 в',
    'DOWNLOAD_PARSER_TXT_ALL': 'Скачать все в',
    'HOME_LINK': 'Главная',
    'WALL_PARSER_LINK': 'Парсинг стены',
    'FOLLOWERS_COUNT': 'Количество подписчиков:',
    'FRIENDS_COUNT': 'Количество друзей:',
    'PHOTOS_COUNT': 'Количество фотографий'
  });

  $translateProvider.preferredLanguage('en');
  $translateProvider.useStorage('translateStorage');
}]);