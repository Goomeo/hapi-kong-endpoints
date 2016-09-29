'use strict';

const request = require('./package.json');

/**
 * Plugin registration function
 *
 * @param {object}      server                                          Hapi Server Instance
 * @param {object}      options                                         Plugin options
 * @param {object}      options.kong                                    Kong connection informations
 * @param {string}      options.kong.host                               Admin API Server (E.g : http://kong:8001)
 * @param {string}      [options.kong.username]                         Admin API username
 * @param {string}      [options.kong.password]                         Admin API password
 * @param {object}      options.endpoint                                Kong endpoint informations
 * @param {string}      options.endpoint.name                           Entry Point Name. Must be an `[a-zA-Z0-9_\-]` String
 * @param {string}      [options.endpoint.requestHost]                  The public DNS address that points to your API. For example, `mockbin.com`
 * @param {string}      [options.endpoint.requestPath]                  The public path that points to your API. For example, `/someservice`
 * @param {boolean}     [options.endpoint.stripRequestPath]             Strip the request_path value before proxying the request to the final API. For example a request made to `/someservice/hello` will be resolved to `upstream_url/hello`. By default is false.
 * @param {boolean}     [options.endpoint.preserveHost]                 Preserves the original Host header sent by the client, instead of replacing it with the hostname of the upstream_url. By default is false.
 * @param {string}      options.endpoint.upstreamUrl                    The base target URL that points to your API server, this URL will be used for proxying requests. For example, `https://mockbin.com`
 * @param {function}    next                                            Callback
 */
exports.register = function (server, options, next) {
    this.isExists(options, (err, isExist) => {
        if (err) {
            next(err);
            return;
        }

        if (isExist === true) {
            next();
            return;
        }

        this.registerApi(options, next);
    });
};

/**
 * Vérifie si le endpoint existe déjà ou non
 *
 * @param {object}      options                                         Plugin options
 * @param {object}      options.kong                                    Kong connection informations
 * @param {string}      options.kong.host                               Admin API Server (E.g : http://kong:8001)
 * @param {string}      [options.kong.username]                         Admin API username
 * @param {string}      [options.kong.password]                         Admin API password
 * @param {object}      options.endpoint                                Kong endpoint informations
 * @param {string}      options.endpoint.name                           Entry Point Name. Must be an `[a-zA-Z0-9_\-]` String
 * @param {function}    callback                                        Callback
 */
exports.isExists = function (options, callback) {
    request({
        method  : 'GET',
        baseUrl : options.kong.host,
        uri     : '/apis/' + options.endpoint.name,
        auth    : {
            user                : 'username',
            pass                : 'password',
            sendImmediately     : false
        }
    }, (err, res) => {
        if (err) {
            callback(err);
            return;
        }

        console.log(res.statusCode);

        callback(null, res.statusCode == 200);
    });
};

/**
 * Plugin registration function
 *
 * @param {object}      options                                         Plugin options
 * @param {object}      options.kong                                    Kong connection informations
 * @param {string}      options.kong.host                               Admin API Server (E.g : http://kong:8001)
 * @param {string}      [options.kong.username]                         Admin API username
 * @param {string}      [options.kong.password]                         Admin API password
 * @param {object}      options.endpoint                                Kong endpoint informations
 * @param {string}      options.endpoint.name                           Entry Point Name. Must be an `[a-zA-Z0-9_\-]` String
 * @param {string}      [options.endpoint.requestHost]                  The public DNS address that points to your API. For example, `mockbin.com`
 * @param {string}      [options.endpoint.requestPath]                  The public path that points to your API. For example, `/someservice`
 * @param {boolean}     [options.endpoint.stripRequestPath]             Strip the request_path value before proxying the request to the final API. For example a request made to `/someservice/hello` will be resolved to `upstream_url/hello`. By default is false.
 * @param {boolean}     [options.endpoint.preserveHost]                 Preserves the original Host header sent by the client, instead of replacing it with the hostname of the upstream_url. By default is false.
 * @param {string}      options.endpoint.upstreamUrl                    The base target URL that points to your API server, this URL will be used for proxying requests. For example, `https://mockbin.com`
 * @param {function}    next                                            Callback
 */
exports.registerApi = function (options, next) {
    request({
        method  : 'POST',
        baseUrl : options.kong.host,
        uri     : '/apis',
        auth    : {
            user                : 'username',
            pass                : 'password',
            sendImmediately     : false
        },
        body : {
            name                : options.endpoint.name,
            request_host        : options.endpoint.requestHost,
            request_path        : options.endpoint.requestPath,
            strip_request_path  : options.endpoint.stripRequestPath,
            preserve_host       : options.endpoint.preserveHost,
            upstream_url        : options.endpoint.upstreamUrl
        }
    }, (err, res) => {
        if (err) {
            next(err);
            return;
        }

        if (res.statusCode != 201) {
            next(new Error('API is not register in KONG'));
            return;
        }

        next();
    });
};

exports.register.attributes = {
    pkg: require('./package.json')
};