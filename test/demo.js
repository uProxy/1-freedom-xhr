var XhrXhr = require('freedom-xhr').corexhr;
var XhrTcpsocket = require('freedom-xhr').coretcpsocket;

var xhrdemo = function(dispatchEvent) {
  this.dispatch = dispatchEvent;
};

xhrdemo.prototype.testHasXhr = function() {
  if (typeof XhrXhr !== "undefined" &&
        typeof XhrTcpsocket !== "undefined") {
    return Promise.resolve();
  } else {
    return Promise.reject();
  }
};

freedom().providePromises(xhrdemo);
