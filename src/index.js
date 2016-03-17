module.exports.corexhr = require('./xhr.corexhr');
module.exports.coretcpsocket = require('./xhr.coretcpsocket');
// TODO: Move auto to coretcpsocket on Firefox 46+, once
// freedom-for-firefox-0.6.23 is available (and it's tested).
module.exports.auto = navigator.userAgent.indexOf('Firefox') >= 0 ?
    module.exports.corexhr : module.exports.coretcpsocket;
