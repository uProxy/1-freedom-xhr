//var XhrXhr = require('freedom-xhr').corexhr;
//var XhrTcpsocket = require('freedom-xhr').coretcpsocket;

var xhrdemo = function(dispatchEvent, selector) {
  this.dispatch = dispatchEvent;
  this.XhrClass = require('freedom-xhr')[selector];
  this.xhr = new this.XhrClass();
};

xhrdemo.prototype.testHasXhr = function() {
  if (typeof this.XhrClass !== 'undefined' &&
        typeof this.xhr !== 'undefined') {
    return Promise.resolve('Woo');
  } else {
    return Promise.reject('Missing XHR classes');
  }
};

xhrdemo.prototype.testLoadEvent = function() {
  return new Promise(function(resolve, reject) {
    this.xhr.addEventListener('load', function (e) {
      // TODO: expect(e).not.toBeUndefined();
      if (this.xhr.readyState === 4) {
        resolve('Woo');
      } else {
        reject('readyState is not 4: ' + this.xhr.readyState);
      }
    }.bind(this));

//    this.xhr.open('GET', 'http://isup.me');
    this.xhr.open('GET', 'https://api.github.com/');
    this.xhr.send(null);
  }.bind(this));
};

    /**
    afterEach(function() {
        xhr.abort();
    });

    it('error event', function(done) {
        xhr.addEventListener('error', function (e) {
            // TODO: expect(e).not.toBeUndefined();
            done();
        });

        xhr.open('GET', 'http://no.such.domain');
        xhr.send(null);
    });

    it('timeout event', function(done) {
        xhr.addEventListener('timeout', function (e) {
            // TODO: expect(e).not.toBeUndefined();
            done();
        });

        xhr.timeout = 500;  // milliseconds
        xhr.open('GET', 'http://192.0.2.1');  // Reserved IP address.
        xhr.send(null);
    });

    it('beforeredirect event', function(done) {
        var xhr = new chrome.sockets.tcp.xhr();

        var redirector = 'http://httpredir.debian.org/debian/';
        xhr.addEventListener('beforeredirect', function (redirectUrl, responseHeaders, statusText) {
            expect(redirectUrl).toMatch(/^http.*\/debian\/$/);
            expect(redirectUrl).not.toEqual(redirector);
            expect(statusText).toMatch(/^30/);
            done();
        });

        xhr.open('GET', redirector);
        xhr.send(null);
    });

    it('load event should indicate a successful response', function (done) {
        xhr.addEventListener('load', function (e) {
            // TODO: expect(e).not.toBeUndefined();
            expect(xhr.statusText).toBe('200 OK');
            expect(xhr.responseText).toMatch(/&#9731;/);
            done();
        });

        xhr.open('GET', 'http://unicodesnowmanforyou.com/');
        xhr.send(null);
    });

    it ('done state should indicate a successful response', function (done) {
        xhr.addEventListener('readystatechange', function () {
            if (this.readyState === this.DONE) {
                expect(xhr.statusText).toBe('200 OK');
                expect(xhr.responseText).toMatch(/&#9731;/);
                done();
            }
        });

        xhr.open('GET', 'http://unicodesnowmanforyou.com/');
        xhr.send(null);
    });

    it ('SSL support', function (done) {
        xhr.addEventListener('readystatechange', function () {
            if (this.readyState === this.DONE) {
                expect(xhr.statusText).toBe('200 OK');
                done();
            }
        });

        xhr.open('GET', 'https://www.httpsnow.org/');
        xhr.send(null);
    });
    **/


freedom().providePromises(xhrdemo);
