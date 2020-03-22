const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = require('chai').assert;
const app = require('../app');

const testParams = require('./data/testUserSet');
const testUtils = require('./testUtils');


chai.use(chaiHttp);

/*

Smoketest:

This smoketest shall do the following: // TODO
- (POST)  CREATE a user (A), verify user A returns, verify response code (201)

*/


describe('Users', function () {

  // TODO: drop the test database

  // before(async function () {
  //   await studentModel.deleteMany({});
  // });

  // it('Verify database is empty, verify response code (200)', async function () {
  //   try {
  //     const response = await chai.request(app).get('/students');
  //     testUtils.checkBodyLength(response, 0);
  //     testUtils.checkResStatus(response, 200);
  //     testUtils.checkHeaderOnSuccess(response);
  //   } catch (err) {
  //     throw err;
  //   }
  // });

  it('Add a user (A), verify user A returns, verify response code (201)', async function () {

    try {
      const response = await chai.request(app).post('/users').send(testParams.smokeTestUsers.test_user_0);
      // assert.ownInclude(response.body, testParams.smokeTestUsers.test_user_0, 'UserA should be returned in response');
      assert.equal(response.status, 201, 'Response should be 201');
    } catch (err) {
      throw err;
    }

  })

  // it('Add a second user (B), verify user A is not returned, verify response code (201)', async function () {

  //   try {
  //     const response = await chai.request(app).post('/students').send(testParams.smokeTestUsers.test_user_1);
  //     assert.notOwnInclude(response.body, testParams.smokeTestUsers.test_user_0, 'UserA should NOT be returned in response');
  //     assert.equal(response.status, 201, 'Response should be 201');
  //   } catch (err) {
  //     throw err;
  //   }

  // })

  // it('Get user A, verify user A is returned, verify response code (200)', async function () {

  //   try {
  //     const response = await chai.request(app).get(`/students/${testParams.smokeTestUsers.test_user_0._id}`);
  //     assert.ownInclude(response.body, testParams.smokeTestUsers.test_user_0, `${testParams.smokeTestUsers.test_user_0.name} should be returned in response`);
  //     assert.equal(response.status, 200, 'Response should be 200');
  //   } catch (err) {
  //     throw err;
  //   }

  // })

  // it('Get nonexistent user by id, verify response code (400)', async function () {

  //   try {
  //     const response = await chai.request(app).get(`/students/0000000000000`);
  //     assert.equal(response.status, 400, 'Response should be 400'); // TODO: Should equal 400 instead of 404
  //   } catch (err) {
  //     throw err;
  //   }

  // })

  // it('Verify that database contains users, verify response code (200)', async function () {

  //   try {
  //     const response = await chai.request(app).get('/students');
  //     assert.equal(response.body.length === Object.keys(testParams.smokeTestUsers).length, true, 'Results should be 2 users');
  //     assert.equal(response.status, 200, 'Response should be 200');
  //   } catch (err) {
  //     throw (err);
  //   }

  // })

  // it('Modify properties of user A, verify response code (200)', async function () {
  //   try {

  //     const response = await chai.request(app).put(`/students/${testParams.smokeTestUsers.test_user_0._id}`).send(testParams.modifiedUsers.test_user_0);
  //     assert.ownInclude(response.body, testParams.smokeTestUsers.test_user_0, 'User 1 should be returned');
  //     assert.equal(response.status, 200, 'Response should be 200');

  //   } catch (err) {
  //     throw (err)
  //   }
  // })

  // it('Verify property update of user A, verify response code (200)', async function () {

  //   try {
  //     const response = await chai.request(app).get(`/students/${testParams.smokeTestUsers.test_user_0._id}`);
  //     assert.notOwnInclude(response.body, testParams.smokeTestUsers.test_user_0, 'User 1 should not be returned in response');
  //     assert.ownInclude(response.body, testParams.modifiedUsers.test_user_0, 'Modified User 1 should be returned in response');
  //     assert.equal(response.status, 200, 'Response should be 200');
  //   } catch (err) {
  //     throw err;
  //   }

  // })

  // it('Delete user B, verify response code (200)', async function () {

  //   try {
  //     const response = await chai.request(app).delete(`/students/${testParams.smokeTestUsers.test_user_1._id}`);
  //     assert.equal(response.status, 200, 'Response should be 200');
  //   } catch (err) {
  //     throw err;
  //   }

  // })

  // it('Modify properties of user B, verify response code (404)', async function () {
  //   try {

  //     const response = await chai.request(app).put(`/students/${testParams.smokeTestUsers.test_user_1._id}`).send(testParams.smokeTestUsers.test_user_1);
  //     assert.equal(response.status, 404, 'Response should be 404');   // TODO: should this be sending a 404 or not? 
  //   } catch (err) {
  //     throw (err)
  //   }
  // })

  // it('Get user B, verify response code (400)', async function () {
  //   try {
  //     const response = await chai.request(app).get(`/students/${testParams.smokeTestUsers.test_user_1._id}`);
  //     assert.equal(response.status, 400, 'Response should be 400');
  //   } catch (err) {
  //     throw (err)
  //   }
  // })

  // it('Delete user B, verify response code (200)', async function () {

  //   try {
  //     const response = await chai.request(app).delete(`/students/${testParams.smokeTestUsers.test_user_0._id}`);
  //     assert.equal(response.status, 200, 'Response should be 200');
  //   } catch (err) {
  //     throw err;
  //   }

  // })

  // it('Verify database is empty, verify response code (200)', async function () {
  //   try {
  //     const response = await chai.request(app).get('/students');
  //     assert.equal(response.body.length === 0, true, 'Results should be empty');
  //     assert.equal(response.status, 200, 'Response should be 200');
  //   } catch (err) {
  //     throw err;
  //   }
  // });

  // after(async function () {
  //   await studentModel.deleteMany({});
  // });

});