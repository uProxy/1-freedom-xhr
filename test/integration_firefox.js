describe('Basic XMLHttpRequest integration tests', function() {
  var xhr;

  var runTest = function(done, selector, testName) {
    freedom('grunt-jasmine-firefoxaddon-runner/data/test/demo.json').
        then(function(Demo) {
      var demo = new Demo(selector);
      demo[testName]().then(function(ret) {
        expect(ret).toEqual(jasmine.any(String));
        done();
      }).catch(function(errMsg) {
        console.log(errMsg);
        expect(errMsg).toBeUndefined();
        expect(true).toBe(false);
        done();
      });
    });
  };

  it('corexhr: constructs XHRs', function(done) {
    runTest(done, 'corexhr', 'testHasXhr');
  });

  it('corexhr: load event', function(done) {
    runTest(done, 'corexhr', 'testLoadEvent');
  });

  it('corexhr: error event', function(done) {
    runTest(done, 'corexhr', 'testErrorEvent');
  });

  it('corexhr: timeout event', function(done) {
    runTest(done, 'corexhr', 'testTimeoutEvent');
  });

  it('corexhr: gets response on load', function(done) {
    runTest(done, 'corexhr', 'testLoadGetResponse');
  });

  it('corexhr: gets response on done', function(done) {
    runTest(done, 'corexhr', 'testDoneGetResponse');
  });

  it('corexhr: get arraybuffer', function(done) {
    runTest(done, 'corexhr', 'testGetArrayBuffer');
  });

/*
  // Getting a blob is not yet supported with core.xhr
  it('corexhr: get blob', function(done) {
    runTest(done, 'corexhr', 'testGetBlob');
  });
*/

  it('corexhr: get JSON', function(done) {
    runTest(done, 'corexhr', 'testGetJSON');
  });

  it('corexhr: can post', function(done) {
    runTest(done, 'corexhr', 'testPost');
  });

  it('corexhr: can post a blob', function(done) {
    runTest(done, 'corexhr', 'testBlobPost');
  });

  it('corexhr: can post an arraybuffer', function(done) {
    runTest(done, 'corexhr', 'testArrayBufferPost');
  });

});
