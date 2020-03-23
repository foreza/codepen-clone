import { Selector } from 'testcafe';
const testUtils = require('./testUtils');
const dbUtils = require('../dbUtils/testUtils');

fixture`Index`
    .page`http://localhost:3000/signup`
    .before(async (t) => {
        dbUtils.deleteUserRowsQuery();
    })
    .after(async (t) => {
        dbUtils.deleteUserRowsQuery();
    });

test('Test basic signup', async t => {
    await t
        .typeText('#name', 'John Smith')
        .typeText('#username', 'JohnSmithCheerio')
        .typeText('#email', 'john.smith@cheerio.com')
        .typeText('#password', '123456789123456789')
        .click("#signup-button")
        .expect(Selector('#login-form-header').exists).ok()
});

