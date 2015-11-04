var freedom = {
  'core.tcpsocket': function() {
    return {
      pause: function() {
        return Promise.resolve();
      }
    };
  }
};
