var EventEmitter = require('events').EventEmitter;
var inherits = require('inherits');


/**
 * @param {string} domain
 * @param {number} port
 * @param {boolean} tls
 * @constructor
 * @struct
 */
function Socket(domain, port, tls) {
  /** @const {string} */
  this.domain = domain;
  /** @const {number} */
  this.port = port;
  /** @const {boolean} */
  this.tls = tls;

  /** @private @const {!FreedomTcpSocket} */
  this.socket_ = freedom['core.tcpsocket']();

  this.socket_.on('onData', function(e) {
    this.emit('data', e.data);
  }.bind(this));

  /** @public {boolean} */
  this.closed = false;

  this.socket_.on('onDisconnect', function(e) {
    this.close();
    this.emit('close', e);
  }.bind(this));

  /** @const {!Promise<void>} */
  this.connected = this.connect_(domain, port, tls);
}
inherits(Socket, EventEmitter);


/**
 * @param {string} domain
 * @param {number} port
 * @param {boolean} tls
 * @return {!Promise<void>}
 * @private
 */
Socket.prototype.connect_ = function(domain, port, tls) {
  if (tls) {
    return this.socket_.prepareSecure().then(function() {
      return this.socket_.connect(domain, port);
    }.bind(this)).then(function() {
      return this.socket_.secure();
    }.bind(this));
  } else {
    return this.socket_.connect(domain, port);
  }
};


/**
 * @return {!Promise<void>}
 */
Socket.prototype.write = function(data) {
  return this.socket_.write(data);
};


Socket.prototype.close = function() {
  if (this.closed) {
    return;
  }
  this.closed = true;
  this.socket_.close();
  freedom['core.tcpsocket'].close(this.socket_);
};


/**
 * @param {string} domain
 * @param {number} port
 * @param {boolean} tls
 * @constructor
 */
function SocketPool(domain, port, tls) {
  /** @private {string} */
  this.domain_ = domain;
  /** @private {number} */
  this.port_ = port;
  /** @private {boolean} */
  this.tls_ = tls;

  /** @private {!Array<!SocketPool.capsule_>} */
  this.idle_ = [];
  /** @private {!Array<!Socket>} */
  this.active_ = [];
}


/**
 * @private @typedef {{
 *   socket: Socket,
 *   timeoutId: number,
 *   closeListener: function
 * }}
 */
SocketPool.capsule_ = undefined;


/** @const {number} */
SocketPool.TIMEOUT = 60000;  // 60 second timeout on idle sockets


/**
 * @param {!Socket} socket
 * @private
 */
SocketPool.prototype.addIdleSocket_ = function(socket) {
  var closeListener = this.expireSocket_.bind(this, socket);
  socket.once('close', closeListener);
  this.idle_.push({
    socket: socket,
    timeoutId: setTimeout(this.expireSocket_.bind(this, socket),
        SocketPool.TIMEOUT),
    closeListener: closeListener
  });
};


/**
 * @param {number} index
 * @return {!Socket}
 * @private
 */
SocketPool.prototype.grabIdleSocket_ = function(index) {
  var capsule = this.idle_[index];
  this.idle_.splice(index, 1);
  clearTimeout(capsule.timeoutId);
  capsule.socket.removeListener('close', capsule.closeListener);
  return capsule.socket;
};


/**
 * @param {!Socket} socket
 * @private
 */
SocketPool.prototype.expireSocket_ = function(socket) {
  for (var i = 0; i < this.idle_.length; ++i) {
    if (this.idle_[i].socket === socket) {
      break;
    }
  }

  if (i === this.idle_.length) {
    return;
  }

  this.grabIdleSocket_(i).close();
};


/**
 * @return {!Promise<!Socket>}
 */
SocketPool.prototype.getSocket = function() {
  if (this.idle_.length === 0) {
    this.addIdleSocket_(new Socket(this.domain_, this.port_, this.tls_));
  }
  var socket = this.grabIdleSocket_(this.idle_.length - 1);
  this.active_.push(socket);
  return Promise.resolve(socket);
};


/**
 * @param {!Socket} socket
 */
SocketPool.prototype.release = function(socket) {
  var i = this.active_.indexOf(socket);
  if (i === -1) {
    throw new Error('Can\'t release unknown socket');
  }
  this.active_.splice(i, 1);

  if (!socket.closed) {
    this.addIdleSocket_(socket);
  }
};


/**
 * @constructor
 * @struct
 */
function SocketFactory() {
  /** @private {!Object.<string, !SocketPool>} */
  this.pools_ = {};
}


/**
 * @param {string} domain
 * @param {number} port
 * @param {boolean} tls
 * @return {string}
 * @private
 */
SocketFactory.key_ = function(domain, port, tls) {
  return domain + ':' + port + ':' + tls;
};


/**
 * @param {string} domain
 * @param {number} port
 * @param {boolean} tls
 * @return {!Promise<!Socket>}
 */
SocketFactory.prototype.getSocket = function(domain, port, tls) {
  var key = SocketFactory.key_(domain, port, tls);
  if (!this.pools_[key]) {
    this.pools_[key] = new SocketPool(domain, port, tls);
  }
  return this.pools_[key].getSocket();
};


/**
 * @param {!Socket} socket
 */
SocketFactory.prototype.release = function(socket) {
  var key = SocketFactory.key_(socket.domain, socket.port, socket.tls);
  var pool = this.pools_[key];
  pool.release(socket);
};

module.exports = new SocketFactory();
