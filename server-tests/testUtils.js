const chai_assert_utils = {};
const assert = require('chai').assert;

chai_assert_utils.checkResStatus = (response, code) =>  {
    return assert.equal(response.status, code, `Response should have status code ${code}`);
}

chai_assert_utils.checkHeaderOnSuccess = (response) => {
    return assert.equal(response.headers["content-type"] === 'application/json; charset=utf-8', true, 'Success headers should be of type application/json; charset=utf-8');
}

chai_assert_utils.checkHeaderOnFail = (response) => {
    return assert.equal(response.headers["content-type"] === 'text/plain; charset=utf-8', true, 'Failure headers should be of type text/plain; charset=utf-8');
}

chai_assert_utils.checkBodyLength = (response, num) => {
    return assert.equal(response.body.length === num, true, `Body results length should be: ${num}`);
}


module.exports = chai_assert_utils;
