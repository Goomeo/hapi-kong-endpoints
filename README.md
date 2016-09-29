# hapi-kong-endpoints
Allow Hapi to register itself automatically on an Kong Server Endpoints

## usage

```javascript
server.register({
    register : require('hapi-kong-endpoints'),
    options     : {
        kong : {
            host        : 'https://kong:8001',
            username    : 'user',
            password    : 'password'
        },
        endpoint : {
            name                : 'my-api',
            requestPath         : '/api',
            stripRequestPath    : true,
            upstreamUrl         : 'http://192.168.10.10:8080'
        }
    }
}, (err) => {
    
});
```

## options

| param | description | required |
| -- | -- | -- |
| kong | Kong connection informations | *x* |
| kong.host | Admin API Server (E.g : http://kong:8001) | *x* |
| kong.username | Admin API username | |
| kong.password | Admin API password | |
| endpoint | Kong endpoint informations | *x* |
| endpoint.name | Entry Point Name. Must be an `[a-zA-Z0-9_\-]` String | *x* |
| endpoint.requestHost | The public DNS address that points to your API. For example, `mockbin.com` | |
| endpoint.requestPath | The public path that points to your API. For example, `/someservice` | |
| endpoint.stripRequestPath | Strip the request_path value before proxying the request to the final API. For example a request made to `/someservice/hello` will be resolved to `upstream_url/hello`. By default is false. | |
| endpoint.preserveHost | Preserves the original Host header sent by the client, instead of replacing it with the hostname of the upstream_url. By default is false. | |
| endpoint.upstreamUrl | The base target URL that points to your API server, this URL will be used for proxying requests. For example, `https://mockbin.com` | *x* |