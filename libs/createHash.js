/**
 * Generate Hash
 */
var crypto = require('crypto'),
    assign = require('lodash.assign');

function createHash(content,options){
    options = assign({}, {
        algorithm: 'sha1',
        hashLength: 8
    }, options);

    var hasher = crypto.createHash(options.algorithm);
    hasher.update(content);
    return hasher.digest('hex').slice(0, options.hashLength);
}

module.exports = createHash;