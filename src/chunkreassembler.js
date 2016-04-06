/**
 * @fileoverview ChunkReassembler is an HTTP Chunked Transfer Encoding parser.
 */

/** @private @enum string */
var State_ = {
  READING_HEX: 'hex',
  WAITING_FOR_CR: '\r',
  NEED_LINE_FEED: '\n',
  COUNTDOWN: '#',
  NEED_DELIMIT_CR: '\r2',
  NEED_DELIMIT_LF: '\n2',
  WAITING_FOR_CRLFCRLF: '\r\n\r\n',
  CHECKING_FOR_LFCRLF: '\n\r\n',
  CHECKING_FOR_CRLF: '\r\n',
  CHECKING_FOR_FINAL_LF: '\n3',
  DONE: ''
};

/**
 * @param {string} c A single character
 * @return {boolean} True if it is a valid hex digit
 * @private
 */
function isHexDigit_(c) {
  return !!c.match(/[0-9A-E]/i);
}

/**
 * @constructor
 * @struct
 */
function ChunkReassembler() {
  /** @private !State_ */
  this.state_ = State_.READING_HEX;
  /** @private !Array<string> */
  this.hexDigits_ = [];
  /** @private number */
  this.countdown_ = 0;
}

/**
 * @param {!ArrayBuffer} segment A segment of bytes from the body
 * @return {!Array<!ArrayBuffer>} Any chunks extracted so far
 */
ChunkReassembler.prototype.addSegment = function(segment) {
  /** !Array<!ArrayBuffer> */ var chunks = [];
  var a = new Uint8Array(segment);
  var i = 0;
  while (i < a.length) {
    var c = String.fromCharCode(a[i]);
    if (this.state_ === State_.READING_HEX) {
      if (isHexDigit_(c)) {
        this.hexDigits_.push(c);
        ++i;
      } else {
        this.state_ = State_.WAITING_FOR_CR;
      }
    } else if (this.state_ === State_.WAITING_FOR_CR) {
      if (c === '\r') {
        this.state_ = State_.NEED_LINE_FEED;
      }
      ++i;
    } else if (this.state_ === State_.NEED_LINE_FEED) {
      if (c !== '\n') {
        throw new Error('Need line feed');
      }
      this.countdown_ = parseInt(this.hexDigits_.join(''), 16);
      this.hexDigits_ = [];
      if (this.countdown_ > 0) {
        this.state_ = State_.COUNTDOWN;
      } else {
        this.state_ = State_.CHECKING_FOR_CRLF;
      }
      ++i;
    } else if (this.state_ === State_.COUNTDOWN) {
      var target = i + this.countdown_;
      var endpoint = Math.min(target, a.length);
      if (endpoint > i) {  // This check avoids confusing zero-length buffers.
        chunks.push(segment.slice(i, endpoint));
        this.countdown_ -= endpoint - i;
        i = endpoint;
      }
      if (this.countdown_ === 0) {
        this.state_ = State_.NEED_DELIMIT_CR;
      }
    } else if (this.state_ === State_.NEED_DELIMIT_CR) {
      if (c !== '\r') {
        throw new Error('Need ending carriage return');
      }
      ++i;
      this.state_ = State_.NEED_DELIMIT_LF;
    } else if (this.state_ === State_.NEED_DELIMIT_LF) {
      if (c !== '\n') {
        throw new Error('Need ending line feed');
      }
      ++i;
      this.state_ = State_.READING_HEX;
    } else if (this.state_ === State_.WAITING_FOR_CRLFCRLF) {
      if (c === '\r') {
        this.state_ = State_.CHECKING_FOR_LFCRLF;
      }
      ++i;
    } else if (this.state_ === State_.CHECKING_FOR_LFCRLF) {
      if (c === '\n') {
        this.state_ = State_.CHECKING_FOR_CRLF;
      } else {
        this.state_ = State_.WAITING_FOR_CRLFCRLF;
      }
      ++i;
    } else if (this.state_ === State_.CHECKING_FOR_CRLF) {
      if (c === '\r') {
        this.state_ = State_.CHECKING_FOR_FINAL_LF;
      } else {
        this.state_ = State_.WAITING_FOR_CRLFCRLF;
      }
      ++i;
    } else if (this.state_ === State_.CHECKING_FOR_FINAL_LF) {
      if (c === '\n') {
        this.state_ = State_.DONE;
      } else {
        this.state_ = State_.WAITING_FOR_CRLFCRLF;
      }
      ++i;
    } else if (this.state_ === State_.DONE) {
      throw new Error('Got bytes after parsing completed');
    }
  }
  return chunks;
};

/** @return {boolean} Whether the final chunk has been received */
ChunkReassembler.prototype.isDone = function() {
  return this.state_ === State_.DONE;
};

if (typeof module !== 'undefined') {
  module.exports = ChunkReassembler;
}

