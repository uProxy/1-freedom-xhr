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
      //
      if (this.xhr.readyState !== 4) {
        reject('readyState is not 4: ' + this.xhr.readyState);
        return;
      }
      resolve('Woo');
    }.bind(this));

//    this.xhr.open('GET', 'http://isup.me');
    this.xhr.open('GET', 'https://www.googleapis.com/discovery/v1/apis/');
    this.xhr.send(null);
  }.bind(this));
};

xhrdemo.prototype.testErrorEvent = function() {
  return new Promise(function(resolve, reject) {
    this.xhr.addEventListener('error', function (e) {
      // TODO: expect(e).not.toBeUndefined();
      resolve('Woo');
    }.bind(this));

    this.xhr.open('GET', 'http://no.such.domain');
    this.xhr.send(null);
  }.bind(this));
};

xhrdemo.prototype.testTimeoutEvent = function() {
  return new Promise(function(resolve, reject) {
    this.xhr.addEventListener('timeout', function (e) {
      // TODO: expect(e).not.toBeUndefined();
      resolve('Woo');
    }.bind(this));

    this.xhr.timeout = 500;
    this.xhr.open('GET', 'http://192.0.2.1');
    this.xhr.send(null);
  }.bind(this));
};

xhrdemo.prototype.testLoadGetResponse = function() {
  return new Promise(function(resolve, reject) {
    this.xhr.addEventListener('load', function (e) {
      // TODO: expect(e).not.toBeUndefined();
      if (this.xhr.status !== 200) {
        reject('status not 200: ' + this.xhr.status);
        return;
      }
      try {
        // Check that the page is valid JSON
        var parsed = JSON.parse(this.xhr.responseText);
        resolve('Woo');
      } catch (err) {
        reject('responseText isn\'t valid JSON:' + err.message);
      }
    }.bind(this));

    this.xhr.open('GET', 'https://www.googleapis.com/discovery/v1/apis/');
    this.xhr.send(null);
  }.bind(this));
};

xhrdemo.prototype.testDoneGetResponse = function() {
  return new Promise(function(resolve, reject) {
    this.xhr.addEventListener('readystatechange', function (e) {
      if (this.xhr.readyState === 4) {
        if (this.xhr.status !== 200) {
          reject('status not 200: ' + this.xhr.status);
          return;
        }
        try {
          // Check that the page is valid JSON
          var parsed = JSON.parse(this.xhr.responseText);
          resolve('Woo');
        } catch (err) {
          reject('responseText isn\'t valid JSON:' + err.message);
        }
      }
    }.bind(this));

    this.xhr.open('GET', 'https://www.googleapis.com/discovery/v1/apis/');
    this.xhr.send(null);
  }.bind(this));
};

xhrdemo.prototype.testGetArrayBuffer = function() {
  return new Promise(function(resolve, reject) {
    this.xhr.addEventListener('readystatechange', function (e) {
      if (this.xhr.readyState === 4) {
        if (this.xhr.status !== 200) {
          reject('status not 200: ' + this.xhr.status);
          return;
        }
        try {
          var decoder = new TextDecoder('utf-8');
          var responseText = decoder.decode(this.xhr.response);
          // Check that the page is valid JSON
          var parsed = JSON.parse(responseText);
          resolve('Woo');
        } catch (err) {
          reject('responseText isn\'t valid utf-8 or JSON: ' + err.message);
        }
      }
    }.bind(this));

    this.xhr.open('GET', 'https://www.googleapis.com/discovery/v1/apis/');
    this.xhr.responseType = 'arraybuffer';
    this.xhr.send(null);
  }.bind(this));
};

xhrdemo.prototype.testGetBlob = function() {
  return new Promise(function(resolve, reject) {
    this.xhr.addEventListener('readystatechange', function (e) {
      if (this.xhr.readyState === 4) {
        if (this.xhr.status !== 200) {
          reject('status not 200: ' + this.xhr.statusText);
          return;
        }
        try {
          var fileReader = new FileReader();
          fileReader.onload = function() {
            var buffer = fileReader.result;
            var decoder = new TextDecoder('utf-8');
            try {
              var responseText = decoder.decode(buffer);
              // Check that the page is valid JSON
              var parsed = JSON.parse(responseText);
            } catch (err) {
              reject('response isn\'t valid JSON: ' + err.message);
            }
          }.bind(this);
          fileReader.readAsArrayBuffer(this.xhr.response);
          resolve('Woo');
        } catch (err) {
          reject('FileReader can\'t read the blob: ' + err.message);
        }
      }
    }.bind(this));

    this.xhr.open('GET', 'https://www.googleapis.com/discovery/v1/apis/');
    this.xhr.responseType = 'blob';
    this.xhr.send(null);
  }.bind(this));
};

xhrdemo.prototype.testGetJSON = function() {
  return new Promise(function(resolve, reject) {
    this.xhr.addEventListener('readystatechange', function (e) {
      if (this.xhr.readyState === 4) {
        if (this.xhr.status !== 200) {
          reject('status not 200: ' + this.xhr.status);
          return;
        }
        if (this.xhr.response && this.xhr.response.discoveryVersion) {
          resolve('Woo');
        } else {
          reject('response isn\'t in the expected format');
        }
      }
    }.bind(this));

    this.xhr.open('GET', 'https://www.googleapis.com/discovery/v1/apis/');
    this.xhr.responseType = 'json';
    this.xhr.send(null);
  }.bind(this));
};

xhrdemo.prototype.testPost = function() {
  var postString = 'freedom-xhr post test contents';
  return new Promise(function(resolve, reject) {
    this.xhr.addEventListener('readystatechange', function (e) {
      if (this.xhr.readyState === 4) {
        if (this.xhr.status !== 200) {
          reject('status not 200: ' + this.xhr.status);
          return;
        }
        if (this.xhr.responseText.match(postString)) {
          resolve('Woo');
        } else {
          reject('Wrong responseText: ' + this.xhr.responseText);
        }
      }
    }.bind(this));

    this.xhr.open('POST', 'https://posttestserver.com/post.php?dump');
    this.xhr.send(postString);
  }.bind(this));
};

xhrdemo.prototype.testBlobPost = function() {
  var postString = 'freedom-xhr post test contents';
  var postBlob = new Blob([postString], {type: 'text/plain'});
  return new Promise(function(resolve, reject) {
    this.xhr.addEventListener('readystatechange', function (e) {
      if (this.xhr.readyState === 4) {
        if (this.xhr.status !== 200) {
          reject('status not 200: ' + this.xhr.status);
          return;
        }
        if (this.xhr.responseText.match(postString)) {
          resolve('Woo');
        } else {
          reject('Wrong responseText: ' + this.xhr.responseText);
        }
      }
    }.bind(this));

    this.xhr.open('POST', 'https://posttestserver.com/post.php?dump');
    this.xhr.send(postBlob);
  }.bind(this));
};

xhrdemo.prototype.testArrayBufferPost = function() {
  var postString = 'freedom-xhr post test contents';
  var postBuffer = new TextEncoder().encode(postString).buffer;
  return new Promise(function(resolve, reject) {
    this.xhr.addEventListener('readystatechange', function (e) {
      if (this.xhr.readyState === 4) {
        if (this.xhr.status !== 200) {
          reject('status not 200: ' + this.xhr.status);
          return;
        }
        if (this.xhr.responseText.match(postString)) {
          resolve('Woo');
        } else {
          reject('Wrong responseText: ' + this.xhr.responseText);
        }
      }
    }.bind(this));

    this.xhr.open('POST', 'https://posttestserver.com/post.php?dump');
    this.xhr.send(postBuffer);
  }.bind(this));
};

xhrdemo.prototype.testDomainFronting = function() {
  var p = new Promise(function(resolve, reject) {
    this.xhr.addEventListener('load', function(e) {
      var validLoaded = e.loaded >= 0;
      if (!validLoaded) {
        reject('load event but e.loaded == ' + e.loaded);
      }
      var validTotal = e.total >= 0;
      if (!validTotal) {
        reject('load event but e.total == ' + e.total);
      }
      if (this.xhr.readyState !== 4) {
        reject('readyState should be 4, not ' + this.xhr.readyState);
      }
      if (this.xhr.status !== 200) {
        reject('status should be 200 ' + this.xhr.status);
      }
      if (!this.xhr.responseText.match(/I.m just a happy little web server.\n/)) {
        reject('unexpected responseText: ' + this.xhr.responseText);
      }
      if (this.xhr.response !== this.xhr.responseText) {
        reject(this.xhr.response + ' !== ' + this.xhr.responseText);
      }
      if (this.xhr.responseURL !== 'https://ajax.aspnetcdn.com/') {
        reject('Unexpected responseURL: ' + this.xhr.responseURL);
      }
      resolve('Woo');
    }.bind(this));
  }.bind(this));

  // This is a domain-fronting test server operated by Tor: see
  // https://trac.torproject.org/projects/tor/wiki/doc/meek#MicrosoftAzure
  this.xhr.open('GET', 'https://ajax.aspnetcdn.com/', true);
  this.xhr.setRequestHeader('Host', 'az786092.vo.msecnd.net');
  this.xhr.send(null);
  return p;
};

xhrdemo.prototype.testFrontDomain = function() {
  // This is a domain-fronting test server operated by Tor: see
  // https://trac.torproject.org/projects/tor/wiki/doc/meek#MicrosoftAzure
  var frontDomainUrl = 'https://ajax.aspnetcdn.com.az786092.vo.msecnd.net.3.domainfront';
  var p = new Promise(function(resolve, reject) {
    this.xhr.addEventListener('load', function(e) {
      var validLoaded = e.loaded >= 0;
      if (!validLoaded) {
        reject('load event but e.loaded == ' + e.loaded);
      }
      var validTotal = e.total >= 0;
      if (!validTotal) {
        reject('load event but e.total == ' + e.total);
      }
      if (this.xhr.readyState !== 4) {
        reject('readyState should be 4, not ' + this.xhr.readyState);
      }
      if (this.xhr.status !== 200) {
        reject('status should be 200 ' + this.xhr.status);
      }
      if (this.xhr.statusText !== 'OK') {
        reject('statusText should be OK, not ' + this.xhr.statusText);
      }
      if (!this.xhr.responseText.match(/I.m just a happy little web server.\n/)) {
        reject('unexpected responseText: ' + this.xhr.responseText);
      }
      if (this.xhr.response !== this.xhr.responseText) {
        reject(this.xhr.response + ' !== ' + this.xhr.responseText);
      }
      if (this.xhr.responseURL !== frontDomainUrl) {
        reject('Unexpected responseURL: ' + this.xhr.responseURL);
      }
      resolve('Woo');
    }.bind(this));
  }.bind(this));

  this.xhr.open('GET', frontDomainUrl);
  this.xhr.send(null);
  return p;
};

xhrdemo.prototype.testChunkedEncoding = function() {
  return new Promise(function(resolve, reject) {
    this.xhr.addEventListener('readystatechange', function (e) {
      if (this.xhr.readyState === 4) {
        if (this.xhr.status !== 200) {
          reject('status not 200: ' + this.xhr.status);
          return;
        }
        if (this.xhr.response.byteLength !== 33653) {
          reject('Expected 33653 byte JPEG but got ' +
              this.xhr.response.byteLength + ' bytes');
        }
        resolve('Woo');
      }
    }.bind(this));

    // This image is served "using a 1 KB chunk of data every 0.1 seconds".
    // See https://www.httpwatch.com/httpgallery/chunked/
    this.xhr.open('GET', 'https://www.httpwatch.com/httpgallery/chunked/chunkedimage.aspx');
    this.xhr.responseType = 'arraybuffer';
    this.xhr.send(null);
  }.bind(this));
};
freedom().providePromises(xhrdemo);
