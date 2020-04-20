import { Selector } from 'testcafe';
const testUtils = require('../testUtils');
const dbUtils = require('../../dbUtils/testUtils');

fixture`Index`
    // .page`http://localhost:3000/signup`
    .before(async (t) => {
    })
    .after(async (t) => {
    });

test('Login, verify pen pages are intact, create a new pen and attach all fields', async t => {
    await t
    .typeText('#usernameOrEmail', 'jason.chiu', {replace: true})
    .typeText('#password', '2238scholarship', {replace: true})
    .click("#login-button")
    .expect(Selector('#logged-in-dashboard').exists).ok()
    .expect(Selector('#pen-card-view').child().count).eql(2)        // Should have 2 seeded pens by default
    .click("#profile-image")
    .click("#create-new-pen")
    .expect(Selector('#pen-view-header').exists).ok()

    await t
        .typeText('#editor-1-ide .inputarea', "<h1>This pandemic needs to be over soon</h1>")
        .typeText('#editor-2-ide .inputarea', "h1 { color: blue; } ")
        .typeText('#editor-3-ide .inputarea', "alert('get a load of this dude!')")

    await t   
        .setNativeDialogHandler(() => true)     // TODO: Figure out how to verify history of a pen
        .expect(Selector('#pen-save-status-content').visible).ok()

    await t
        .click("#pen-settings")
        .expect(Selector('#pen-settings-modal').visible).ok()


        
    await t    
    .click("#css-link")
    .click("#modal-css-externals-add")
    .typeText('#new-external-1 input', "https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css", {replace: true})



        // .click("#css-link")
        // .expect(Selector('#modal-css-externals').visible).ok()
        // .expect(Selector('#modal-css-externals').child().count).eq(0)
        // .click("#modal-css-externals-add")
        // .expect(Selector('#modal-css-externals').child().count).eq(1)
        // .click(".icon-wrapper-link")
        // .expect(Selector('#modal-css-externals').child().count).eq(0)
        // .click("#modal-css-externals-add")
        // .expect(Selector('#modal-css-externals').child().count).eq(1)
        // .typeText('#new-external-2 input', "https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css")
        // .expect(Selector('#modal-css-externals').child().count).eq(1)

    await t
        .click("#modal-stage-update")
        .setNativeDialogHandler(() => true)     // TODO: handle the alert case in functionality
        .click("#save-pen")
        .expect(Selector('#pen-save-status-content').visible).notOk()


}).page(`http://localhost:3000/login`)



// test('Test login to new pen, save some data', async t => {
//     await t
//         .typeText('#usernameOrEmail', 'JohnSmithCheerio', {replace: true})
//         .typeText('#password', '123456789123456789', {replace: true})
//         .click("#login-button")
//         .expect(Selector('#logged-in-dashboard').exists).ok()
//         .expect(Selector('#pen-card-view').child().count).eql(0)
//         .click("#profile-image")
//         .click("#create-new-pen")
//         .expect(Selector('#pen-view-header').exists).ok()
//         .typeText('#editor-1-ide .inputarea', "<h1>John and Jane are thousands of miles away</h1>")
//         .expect(Selector('#pen-save-status-content').visible).ok()
//         .click("#save-pen")
//         .expect(Selector('#pen-save-status-content').visible).notOk()
// }).page(`http://localhost:3000/login`);



// test('Test re-login, open pen from dashboard view', async t => {
//     await t
//     .typeText('#usernameOrEmail', 'JohnSmithCheerio', {replace: true})
//     .typeText('#password', '123456789123456789', {replace: true})
//     .click("#login-button")
//     .expect(Selector('#logged-in-dashboard').exists).ok()
//     .expect(Selector('#pen-card-view').child().count).eql(1)
// }).page(`http://localhost:3000/login`);

