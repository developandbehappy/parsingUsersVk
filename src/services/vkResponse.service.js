vkApp.service('vkResponseService', function () {
  var vkErrorType = {
    VK_UNKNOWN_ERROR: 'VK_UNKNOWN_ERROR',
    VK_PROTOCOL_ERROR: 'VK_PROTOCOL_ERROR'
  };
  var vkResponseClass = function (serverResponse) {
    this.response = serverResponse;
    this.errorStatus = false;
    this.errorType = null;
    this.errorCode = null;
    this.errorMessage = null;
    if (_.isString(serverResponse)) {
      console.log("unknown error!");
      this.errorStatus = true;
      this.errorType = vkErrorType.VK_UNKNOWN_ERROR;
    } else {
      if (_.isUndefined(serverResponse.error)) {
        console.log("все ок");
      } else {
        console.log("ошибка вк");
        this.errorStatus = true;
        this.errorType = vkErrorType.VK_PROTOCOL_ERROR;
        this.errorCode = serverResponse.error.error_code;
        this.errorMessage = serverResponse.error.error_msg;
      }
    }
    return this;
  };
  /**
   *
   * @returns {*}
   */
  vkResponseClass.prototype.getResponse = function () {
    if (this.hasError()) {
      return this.response.error;
    }
    return this.response.response;
  };
  /**
   *
   * @returns {boolean}
   */
  vkResponseClass.prototype.hasError = function () {
    return Boolean(this.errorStatus);
  };
  /**
   *
   * @returns {boolean}
   */
  vkResponseClass.prototype.hasNotError = function () {
    return Boolean(!this.errorStatus);
  };
  /**
   *
   * @returns {boolean}
   */
  vkResponseClass.prototype.hasProtocolError = function () {
    return Boolean(this.errorType === vkErrorType.VK_PROTOCOL_ERROR);
  };
  /**
   *
   * @returns {boolean}
   */
  vkResponseClass.prototype.hasUnknownError = function () {
    return Boolean(this.errorType === vkErrorType.VK_UNKNOWN_ERROR);
  };
  /**
   *
   * @returns {*}
   */
  vkResponseClass.prototype.getErrorType = function () {
    return this.errorType;
  };
  /**
   *
   * @returns {*}
   */
  vkResponseClass.prototype.getErrorCode = function () {
    return this.errorCode;
  };
  /**
   *
   * @returns {*}
   */
  vkResponseClass.prototype.getErrorMessage = function () {
    return this.errorMessage;
  };
  return function (serverResponse) {
    return new vkResponseClass(serverResponse);
  }
});