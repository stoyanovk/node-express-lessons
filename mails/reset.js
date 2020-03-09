const config = require('../settings')

module.exports = function(email,link) {
  return {
    to: email,
    from: "TestNodeProject@mail.com",
    subject: "Reset Password",
    html: `<h1>Reset Pass</h1>
           <p>For reset pass, go to <a href="${config.baseUrl}/auth/reset/password/${link}">link</a></p>`
  };
};
