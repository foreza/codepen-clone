const chai = require('chai');
const chaiHttp = require('chai-http');


const assert = require('chai').assert;
const app = require('../app');

const testParams = require('./data/testUserSet');
const testPenParams = require('./data/testPenSet');

const testUtils = require('./testUtils');
const dbUtils = require('../dbUtils/testUtils')

chai.use(chaiHttp);
chai.use(require('chai-shallow-deep-equal'));

describe('Users', function () {

  before(async () => {
    await dbUtils.deleteUserRowsQuery();
  });

  after(async () => {
    await dbUtils.deleteUserRowsQuery();
  });

  it('Add a user with the users a[o], verify response code (201)', async () => {
    try {
      let tUser = testParams.smokeTestUsers.test_user_0;
      const response = await chai.request(app).post('/users').send(tUser);
      tUser.password = testUtils.hashPassword(tUser.password);
      assert.shallowDeepEqual(response.body, tUser, 'User should match some of the info provided');
      assert.equal(response.status, 201, 'Response should be 201');
    } catch (err) {
      throw err;
    }
  })

  it('Verify user has been added, verify response code (201)', async () => {
    try {
      const response = await dbUtils.getTestUserByUserName(testParams.smokeTestUsers.test_user_0.username)
      if (response) {
        let tUser = testParams.smokeTestUsers.test_user_0;
        tUser.password = testUtils.hashPassword(tUser.password);
        assert.shallowDeepEqual(response, tUser, 'User should match some of the info provided');
      }
    } catch (err) {
      throw err;
    }
  })

  it('Try to login as the added user using username, verify response code (200)', async () => {
    try {
      const response = await chai.request(app).post('/users/login').send(testParams.smokeTestLogins.test_user_0a);
      assert.equal(response.status, 200, 'User should be logged in successfully');
    } catch (err) {
      throw err;
    }
  })

  it('Try to login as the added user using email, verify response code (200)', async () => {
    try {
      const response = await chai.request(app).post('/users/login').send(testParams.smokeTestLogins.test_user_0b);
      assert.equal(response.status, 200, 'User should be logged in successfully');
    } catch (err) {
      throw err;
    }
  })

  it('Try to login as the added user using invalid credentials (wrong username), verify error code (401)', async () => {
    try {
      const response = await chai.request(app).post('/users/login').send(testParams.smokeTestLogins.test_user_0_bad_0);
      assert.equal(response.status, 401, 'User should not be authorized');
    } catch (err) {
      throw err;
    }
  })

  it('Try to login as the added user using invalid credentials (wrong password), verify error code (401)', async () => {
    try {
      const response = await chai.request(app).post('/users/login').send(testParams.smokeTestLogins.test_user_0_bad_1);
      assert.equal(response.status, 401, 'User should not be authorized');
    } catch (err) {
      throw err;
    }
  })

  it('Try to login as the added user using bad credentials (nothing provided), verify error code (400)', async () => {
    try {
      const response = await chai.request(app).post('/users/login').send(testParams.smokeTestLogins.test_user_0_bad_2);
      assert.equal(response.status, 400, 'User should not be authorized');
    } catch (err) {
      throw err;
    }
  })

  it('Try to login using bad credentials (overall bad input provided, exceed length), verify error code (400)', async () => {
    try {
      const response = await chai.request(app).post('/users/login').send(testParams.smokeTestLogins.test_user_0_bad_3);
      assert.equal(response.status, 400, 'User should not be authorized');
    } catch (err) {
      throw err;
    }
  })

  it('Try to login using a missing field , verify error code (400)', async () => {
    try {
      const response = await chai.request(app).post('/users/login').send(testParams.smokeTestLogins.test_user_0_bad_4);
      assert.equal(response.status, 400, 'User should not be authorized');
    } catch (err) {
      throw err;
    }
  })


  it('Try to get a pen with a non-existing pen ID, verify error code (404)', async () => {
    try {
      const response = await chai.request(app).get('/pens/999')
      assert.equal(response.status, 404, 'Pen should not exist');
    } catch (err) {
      throw err;
    }
  })

  it('Try to get a pen with an invalid pen ID, verify error code (400)', async () => {
    try {
      const response = await chai.request(app).get('/pens/youCallThisAnID????')
      assert.equal(response.status, 400, 'Pen should not exist');
    } catch (err) {
      throw err;
    }
  })

  let penId;      // Store the penID to be referenced 

  it('Try to add a pen, verify 201 success', async () => {
    try {
      const response = await chai.request(app).post('/pens').send(testPenParams.smokeTestPens.test_pen_0);
      assert.equal(response.status, 201, 'Pen should be created');
      assert.deepEqual(testPenParams.smokeTestPens.test_pen_0_res["penInfo"], response.body, 'User should match the info provided');
      penId = response.body.penId;
    } catch (err) {
      throw err;
    }
  })

  it('Try to get a pen with the valid pen ID, verify error code (400)', async () => {
    try {
      const response = await chai.request(app).get(`/pens/${penId}`)
      assert.equal(response.status, 200, 'Pen should exist');
    } catch (err) {
      throw err;
    }
  })


});