module.exports = function(email) {
  return {
    to: email,
    from: "TestNodeProject@mail.com",
    subject: "You have successfully registered",
    html: "<h1>You have successfully registered</h1>"
  };
};
