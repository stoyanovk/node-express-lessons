module.exports = {
  isEq: function(ownerID, currentUserID, options) {
    if (ownerID.toString() == currentUserID.toString()) {
      return options.fn(this);
    }
    return options.inverse(this);
  }
};
