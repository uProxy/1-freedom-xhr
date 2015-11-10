describe('Basic XMLHttpRequest integration tests', function() {
  var xhr;

  var runTest = function(done, selector, testName) {
    freedom('scripts/test/demo.json').then(function(Demo) {
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

  it('coretcpsocket: constructs XHRs', function(done) {
    runTest(done, 'coretcpsocket', 'testHasXhr');
  });

  it('corexhr: load event', function(done) {
    runTest(done, 'corexhr', 'testLoadEvent');
  });

  it('coretcpsocket: load event', function(done) {
    runTest(done, 'coretcpsocket', 'testLoadEvent');
  });

  it('corexhr: error event', function(done) {
    runTest(done, 'corexhr', 'testErrorEvent');
  });

  it('coretcpsocket: error event', function(done) {
    runTest(done, 'coretcpsocket', 'testErrorEvent');
  });

  it('corexhr: timeout event', function(done) {
    runTest(done, 'corexhr', 'testTimeoutEvent');
  });

  it('coretcpsocket: timeout event', function(done) {
    runTest(done, 'coretcpsocket', 'testTimeoutEvent');
  });

  it('corexhr: gets response on load', function(done) {
    runTest(done, 'corexhr', 'testLoadGetResponse');
  });

  it('coretcpsocket: gets response on load', function(done) {
    runTest(done, 'coretcpsocket', 'testLoadGetResponse');
  });

  it('corexhr: gets response on done', function(done) {
    runTest(done, 'corexhr', 'testDoneGetResponse');
  });

  it('coretcpsocket: gets response on done', function(done) {
    runTest(done, 'coretcpsocket', 'testDoneGetResponse');
  });

  it('corexhr: can post', function(done) {
    runTest(done, 'corexhr', 'testPost');
  });

  it('coretcpsocket: can post', function(done) {
    runTest(done, 'coretcpsocket', 'testPost');
  });

  it('coretcpsocket: domain fronting', function(done) {
    runTest(done, 'coretcpsocket', 'testDomainFronting');
  });

});
