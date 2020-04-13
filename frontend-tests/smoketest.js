import { Selector } from 'testcafe';
const testUtils = require('./testUtils');
const dbUtils = require('../dbUtils/testUtils');

fixture`Index`
    // .page`http://localhost:3000/signup`
    .before(async (t) => {
        dbUtils.deleteUserRowsQuery();
        // TODO: delete everything else
    })
    .after(async (t) => {
        dbUtils.deleteUserRowsQuery();
        // TODO: delete everything else
    });

test('Test basic signup', async t => {
    await t
        .typeText('#name', 'John Smith')
        .typeText('#username', 'JohnSmithCheerio')
        .typeText('#email', 'john.smith@cheerio.com')
        .typeText('#password', '123456789123456789')
        .click("#signup-button")
        .expect(Selector('#login-form-header').exists).ok()
}).page(`http://localhost:3000/signup`)



test('Test login to new pen, save some data', async t => {
    await t
        .typeText('#usernameOrEmail', 'JohnSmithCheerio', {replace: true})
        .typeText('#password', '123456789123456789', {replace: true})
        .click("#login-button")
        .expect(Selector('#logged-in-dashboard').exists).ok()
        .click("#profile-image")
        .click("#create-new-pen")
        .expect(Selector('#pen-view-header').exists).ok()
        .typeText('#editor-1-ide .inputarea', "<h1>John and Jane are thousands of miles away</h1>")
        .expect(Selector('#pen-save-status-content').visible).ok()
        .click("#save-pen")
        .expect(Selector('#pen-save-status-content').visible).notOk()

}).page(`http://localhost:3000/login`);



// test('Test re-login, open pen from dashboard view', async t => {
//     await t
//         .typeText('#usernameOrEmail', 'JohnSmithCheerio', {replace: true})
//         .typeText('#password', '123456789123456789', {replace: true})
//         .click("#login-button")
//         .expect(Selector('#logged-in-dashboard').exists).ok()
//         .click("#profile-image")
//         .click("#create-new-pen")
//         .expect(Selector('#pen-view-header').exists).ok()


// }).page(`http://localhost:3000/login`);



// test ('Test create a new pen', async t => {
//     await t
//         .click("#profile-image")
//         .click("#create-new-pen")
//         .expect(Selector('#pen-view-header').exists).ok()
// }).page(`http://localhost:3000/dashboard`);
