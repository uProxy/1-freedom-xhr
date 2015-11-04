describe('XMLHttpRequest Compatibility: event [load]', function() {
    //var xhr = new ChromeSocketsXMLHttpRequest();
    var XhrClass = require('freedom-xhr').coretcpsocket;
    var xhr = new XhrClass();
    console.log(xhr);

    beforeEach(function(done) {
        xhr.addEventListener('load', function (e) {
            done();
        });
    });

    xhr.open('GET', 'http://httpconsole.com/text/Hello%20World');
    xhr.send(null);

    //@todo - this seems like more of an integration test?
    it ('should work get a successful response', function (done) {
        expect(xhr.readyState).toBe(xhr.DONE);
        done();
    });
});
