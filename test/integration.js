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
    runTest(done, "corexhr", "testHasXhr");
  });

  it('coretcpsocket: constructs XHRs', function(done) {
    runTest(done, "coretcpsocket", "testHasXhr");
  });

  it('corexhr: load event', function(done) {
    runTest(done, "corexhr", "testLoadEvent");
  });

  it('coretcpsocket: load event', function(done) {
    runTest(done, "coretcpsocket", "testLoadEvent");
  });

});
