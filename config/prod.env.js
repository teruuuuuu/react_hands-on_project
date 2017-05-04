var prodUrl = require('./request.url.json')

module.exports = {
  NODE_ENV: '"production"',
  REQUEST_URL: JSON.stringify(prodUrl)
}
