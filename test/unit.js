function encode(str) {
  var buf = new ArrayBuffer(str.length);
  var bufView = new Uint8Array(buf);
  for (var i = 0; i < str.length; ++i) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

function decode(segments) {
  return segments.map(function(segment) {
    return String.fromCharCode.apply(null, new Uint8Array(segment));
  }).join('');
}

describe('chunk reassembler tests', function() {
  var testData = [{
    in: '4\r\nWiki\r\n5\r\npedia\r\nE\r\n in\r\n\r\nchunks.\r\n0\r\n\r\n',
    out: 'Wikipedia in\r\n\r\nchunks.'
  }, {
    in: '3 ; some extension here \r\n123\r\n0 ; different extension\r\n\r\n',
    out: '123'
  }, {
    in: '10\r\n0123456789012345\r\n0\r\n\r\n',
    out: '0123456789012345'
  }, {
    in: '1a; ignore-stuff-here\r\nabcdefghijklmnopqrstuvwxyz\r\n10\r\n1234567890abcdef\r\n0\r\nsome-footer: some-value\r\nanother-footer: another-value\r\n\r\n',
    out: 'abcdefghijklmnopqrstuvwxyz1234567890abcdef'
  }];

  it('big block parse', function() {
    testData.forEach(function(t) {
      var r = new ChunkReassembler();
      var inBuffer = encode(t.in);
      var outBuffers = r.addSegment(inBuffer);
      var out = decode(outBuffers);
      expect(out).toEqual(t.out);
      expect(r.isDone()).toBe(true);
    });
  });

  it('two segment parse', function() {
    testData.forEach(function(t) {
      for (var i = 1; i < t.in.length; ++i) {
        var r = new ChunkReassembler();
        var in1 = t.in.slice(0, i);
        var in2 = t.in.slice(i);
        var inBuffer1 = encode(in1);
        var inBuffer2 = encode(in2);
        var outBuffers1 = r.addSegment(inBuffer1);
        expect(r.isDone()).toBe(false);
        var outBuffers2 = r.addSegment(inBuffer2);
        expect(r.isDone()).toBe(true);
        var out1 = decode(outBuffers1);
        var out2 = decode(outBuffers2);
        expect(out1 + out2).toEqual(t.out);
      }
    });
  });

  it('bytewise parse', function() {
    testData.forEach(function(t) {
      var r = new ChunkReassembler();
      var allSegments = [];
      for (var i = 0; i < t.in.length; ++i) {
        expect(r.isDone()).toBe(false);
        var inBuffer = encode(t.in[i]);
        var outBuffers = r.addSegment(inBuffer);
        expect(outBuffers.length).toBeLessThan(2);
        if (outBuffers.length > 0) {
          allSegments.push(outBuffers[0]);
        }
      }
      expect(r.isDone()).toBe(true);
      var out = decode(allSegments);
      expect(out).toEqual(t.out);
    });
  });

  it('too many bytes', function() {
    testData.forEach(function(t) {
      var r = new ChunkReassembler();
      var inBuffer = encode(t.in + 'foo');
      expect(r.addSegment.bind(r, inBuffer)).toThrow();
    });
  });
});
