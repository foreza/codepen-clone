const bcrypt = require('bcrypt');
const saltRounds = 10;

const test_utils = {};
const assert = require('chai').assert;

test_utils.checkResStatus = (response, code) =>  {
    return assert.equal(response.status, code, `Response should have status code ${code}`);
}

test_utils.checkHeaderOnSuccess = (response) => {
    return assert.equal(response.headers["content-type"] === 'application/json; charset=utf-8', true, 'Success headers should be of type application/json; charset=utf-8');
}

test_utils.checkHeaderOnFail = (response) => {
    return assert.equal(response.headers["content-type"] === 'text/plain; charset=utf-8', true, 'Failure headers should be of type text/plain; charset=utf-8');
}

test_utils.checkBodyLength = (response, num) => {
    return assert.equal(response.body.length === num, true, `Body results length should be: ${num}`);
}

// Bcrypt Utility function
test_utils.hashPassword = async (password) => {
    await bcrypt.hash(password, saltRounds, (err, hash) => {
        if (!err){
            return hash;
        } else {
            // Handle error
        }
    });
}


module.exports = test_utils;
