const middlewareCollection = {};
const yup = require('yup');
var userUtil = require('../dbUtils/userUtils')

// Authentication Middleware

middlewareCollection.checkUserExists = async (req, res, next) => {

    console.log("authenticateUserID middleware called");
    const user = await userUtil.checkUserSessionForID(req.session.user);   // ingest the id
    if (user.length > 0) {
        console.log("authenticateUserID: user exists");
        res.locals.userExists = true;
    } else {
        console.log("authenticateUserID: user does not exist");
        res.locals.userExists = false;
    }
    next();
};

middlewareCollection.checkAuthState = async (req, res, next) => {

    console.log("checkAuthState middleware called");

    if (req.session && req.session.user && res.locals.userExists) {
        console.log("session exists");
        next();
    } else {
        req.session.reset();
        // res.send(301);
        console.log("user is not authenticated or does not exist");
        res.redirect(301, './login');
    } 
};


// User validation Middleware

let userCreationSchema = yup.object().shape({
    fullName: yup
        .string()
        .required()
        .min(1)
        .max(30),
    username: yup
        .string()
        .required()
        .min(1)
        .max(30),
    email: yup
        .string()
        .email()
        .required()
        .min(3)
        .max(30),
    password: yup
        .string()
        .required()
        .min(12)
        .max(60)
});

let userLoginSchema_Email = yup.object().shape({
    usernameOrEmail: yup
        .string()
        .email()
        .required()
        .min(3)
        .max(30),
    password: yup
        .string()
        .required()
        .min(12)
        .max(60)
});

let userLoginSchema_username = yup.object().shape({
    usernameOrEmail: yup
        .string()
        .required()
        .min(3)
        .max(30),
    password: yup
        .string()
        .required()
        .min(12)
        .max(60)
});

middlewareCollection.validateUserLogin = async (req, res, next) => {
    let err = [];

    console.log(req.query)

    if (await userLoginSchema_Email.validate(req.query).catch((e) => { err = e; })) {
        next();
    } else if (await userLoginSchema_username.validate(req.query).catch((e) => { err = e; })) {
        next();
    } else {
        res.setHeader("Content-Type", "text/plain; charset=utf-8")
        res.status(400).send(err.errors);
    }
};

middlewareCollection.validateUserCreation = async (req, res, next) => {
    let err = [];

    if (await userCreationSchema.validate(req.body).catch((e) => { err = e; })) {
        next();
    } else {
        res.setHeader("Content-Type", "text/plain; charset=utf-8")
        res.status(400).send(err.errors);
    }
};

module.exports = middlewareCollection;
