import config from './config';

const FETCH_TIMEOUT = 60000;
const UPLOAD_TIMEOUT = 60000;
const PRINT_API_LOG = config.env !== 'production';

export const get = async function(url) {
    return _fetch(url, {
        method: "GET"
    })
};

export const post = async function(url, params) {
    this.logRequest('POST', url, params);
    return _fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
    })
};

logRequest = function(method, url, params) {
    if (PRINT_API_LOG)
        console.log('Request[%s]: URL = %s, params = %s', method, url, JSON.stringify(params));
};


_fetch = function(url, params) {
    return new Promise((resolve, reject) => {
        let finished = false;

        // NOTE: beware setTimedout may not work correctly when using debug (https://github.com/facebook/react-native/issues/9030)
        if (config.env === 'production') {
            setTimeout(() => {
                if (!finished) {
                    reject(formatVerboseRequest(url, params, '', 'Thời gian server phản hồi quá lâu'));
                    finished = true;
                }
            }, FETCH_TIMEOUT);
        }

        fetch(url, params)
            .then(onSuccessCallback)
            .catch(onErrorCallback);

        function onSuccessCallback(response) {
            response.clone().text().then((text) => {
                logResponse({response}, text)
            });
            if (response.status == 200 || response.status == 201) {
                response.json().then((json) => {
                    if (!finished) {
                        resolve(json);
                        finished = true;
                    }
                })
            } else {
                response.text().then((text) => {
                    if (!finished) {
                        reject(formatVerboseRequest(url, params, response, text));
                        finished = true;
                    }
                })
            }
        }

        function onErrorCallback(error) {
            logResponse(error, error.message);
            if (!finished) {
                reject(formatVerboseRequest(url, params, error, error.message));
                finished = true;
            }
        }

        function logResponse(response, text) {
            if (PRINT_API_LOG) {
                console.log('Response : %s', JSON.stringify(response));
                console.log('RespText : ');
                console.log(text);
            }
        }

        function formatVerboseRequest(url, params, response, text) {
            if (PRINT_API_LOG) {
                return (
                    'URL: ' + url + '\n\n' +
                    'PARAMS: ' + JSON.stringify(params) + '\n\n' +
                    'RESPONSE: ' + JSON.stringify(response) + '\n\n' +
                    'RESPTEXT: ' + text
                )
            } else {
                return text;
            }
        }
    }).then((response) => {
        return {
            ok: true,
            data: response
        }
    }).catch((error) => {
        return {
            ok: false,
            data: error
        }
    });
};