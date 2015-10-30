describe('Basic XMLHttpRequest integration tests', function() {
    var xhr;

    beforeEach(function() {
        xhr = new chrome.sockets.tcp.xhr();
    });

    afterEach(function() {
        xhr.abort();
    });

    it('should initiate an instance of chrome.sockets.tcp.xhr', function() {
        expect(xhr instanceof chrome.sockets.tcp.xhr).toBe(true);
    });

    it('load event', function(done) {
        xhr.addEventListener('load', function (e) {
            // TODO: expect(e).not.toBeUndefined();
            expect(xhr.readyState).toBe(xhr.DONE);
            done();
        });

        xhr.open('GET', 'http://isup.me');
        xhr.send(null);
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
});
