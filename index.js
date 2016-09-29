'use strict';

const request = require('./package.json');
const apis    = require('./libs/apis');

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
    apis.get(options, (err, result) => {
        if (err) {
            next(err);
            return;
        }

        if (result.statusCode == 200) {
            next();
            return;
        }

        apis.post(options, next);
    });
};

exports.register.attributes = {
    pkg: require('./package.json')
};