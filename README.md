# freedom-xhr [![NPM version][npm-image]][npm-url]

freedom-xhr is an `XMLHttpRequest` drop-in replacement using
[core.tcpsocket](https://github.com/freedomjs/freedom/blob/master/interface/core.tcpsocket.json)
or [core.xhr](https://github.com/freedomjs/freedom/blob/master/interface/core.xhr.json)
for [freedom.js](http://www.freedomjs.org/) apps.  It exposes the XMLHttpRequest
2.0 API, including support for HTTPS, ArrayBuffers, and Blobs.

Some uses for this module include
- Performing XMLHttpRequests from a nodejs child process
- Unifying cookie storage among freedom modules
- Performing spec-violating HTTP requests (if the core environment has
sufficient permissions)
 * e.g. domain fronting, cookie forgery

## How to get it

- Install with [NPM](http://npmjs.org):
```bash
npm install freedom-xhr
```

## Domain fronting URLs

freedom-xhr supports domain-fronting, i.e. setting a Host: header that does not
match the destination domain.  This is not allowed by ordinary browser XHR.

Applications can invoke this function directly, using `setRequestHeader`.
However, this can be inconvenient, especially if XHR is being used via a
third-party library that is not aware of domain-fronting.  Therefore,
freedom-xhr also supports transparent domain fronting, using URLs with a domain
of the form
```
dns.and.sni.part.secret.inner.domain.4.domainfront
```
For more information on the format, see the [frontdomain](https://github.com/uproxy/frontdomain)
package.

## Sample Usage

To use freedom-xhr for all requests, you can just overwrite the global
XMLHttpRequest constructor:
```javascript
XMLHttpRequest = require('freedom-xhr').coretcpsocket;
```
All requests will now be routed through the freedom core's TCP sockets, using an
HTTP client written in pure Javascript.  To use the core environment's XHR, you
can instead write
```javascript
XMLHttpRequest = require('freedom-xhr').corexhr;
```

## Compiling [![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)

This project uses [Grunt](http://gruntjs.com/). If you haven't used Grunt before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide.

### Available Grunt commands

| Function  | Command       | Description                                   |
| --------- | ------------- | --------------------------------------------- |
| Build     | `grunt build` | Compiles.                                     |
| Tests     | `grunt test`  | Runs tests.                                   |


## License

Licensed under [the MIT license](LICENSE).  Maintained by [@bemasc](https://github.com/bemasc).

Derived from chrome.sockets.tcp.xhr by [@ahmadnassri](https://github.com/ahmadnassri)
- Twitter: [@AhmadNassri](http://twitter.com/ahmadnassri)
- Website: [ahmadnassri.com](http://ahmadnassri.com)

[npm-url]: http://badge.fury.io/js/freedom-xhr
[npm-image]: https://badge.fury.io/js/freedom-xhr.png
