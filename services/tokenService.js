const jwt = require('jsonwebtoken');

const createTokens = (id) => {
  const accessToken = jwt.sign({ id }, process.env.secret, {
    expiresIn: '1h',
  });

  const refreshToken = jwt.sign({ id }, process.env.secret, {});

  return { accessToken, refreshToken };
};

module.exports = { createTokens };
