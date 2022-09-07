import { state, actions } from './store/ajaxRequest.js';

/**
 * Represents a request factory
 * @param {Object}                    - request properties object
 * @param {string} url                - the request url
 * @param {function} successCallback  - run, when request status is  200 and state is 4
 * @param {string} [method=GET]       - the request method
 * @param {number} [maxRetry=2]       - how many times to retry send the request
 * @param {number} [delay=5000]       - the delay in milisec beetween two retry
 * @returns {function}                - the reqeust function, witch send the request
 */
function ajaxRequest({
  url,
  successCallback,
  method = 'GET',
  delay = 5000,
  maxRetry = 2,
} = {}) {
  actions.initRequest(maxRetry, delay);

  /**
   * Log error message to the console.error
   * @param {string} message - the error message
   */
  function handleError(message) {
    console.error(message);
  }

  /**
   * Handle ajax onload event
   * @param {Object} xhr - the error message
   */
  function handleLoad(xhr) {
    /*
      onerror fires when there is a failure on the network level.
      If the error only exists on the application level,
      e.g., an HTTP error code is sent, then onload still fires
    */
    if (xhr.readyState === 4 && xhr.status === 200) {
      successCallback(JSON.parse(xhr.responseText));
    } else if (xhr.status === 404) {
      handleError('Nem található');
    }
  }

  /**
   * Send ajax request
   */
  function request() {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.onload = () => handleLoad(xhr);
    xhr.onerror = (err) => handleError(err.message);
    xhr.send();
  }

  return request;
}

export default ajaxRequest;
