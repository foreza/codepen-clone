const middlewareCollection = {};
const yup = require('yup');
var userUtil = require('../dbUtils/userUtils')
const Hashids = require('hashids/cjs')
const hashids = new Hashids()



// HashID decode function

middlewareCollection.decodeToPenId = async (req, res, next) => {
    const hashedPenId = req.params.hashId;        
    try {
        unhashedPenId = (hashids.decode(hashedPenId))[0];
        if (unhashedPenId == undefined){
            res.sendStatus(400);
        } else {
            console.log(`[decodeToPenId] - Converted ${hashedPenId} to ${unhashedPenId} `);
            req.params.penId = unhashedPenId;
            next();
        }

    } catch (e) {
        res.sendStatus(400);
    }

}

middlewareCollection.checkPenIDValidity = async (req, res, next) => {

    // do a cast to number

    if (isNaN(parseInt(req.params.id))) {
        res.sendStatus(400);
    } else {
        next();
    }

}


// Authentication Middleware


middlewareCollection.checkUserExists = async (req, res, next) => {
    if (req.session && req.session.user) {
        const user = await userUtil.getUserById(req.session.user.id);   // ingest the id
        if (user.length > 0) {
            res.locals.userExists = true;
        } else {
            res.locals.userExists = false;
        }
    }
    next();
};

middlewareCollection.checkAuthState = async (req, res, next) => {
    if (req.session && req.session.user && res.locals.userExists) {
        next();
    } else {
        req.session.reset();
        res.redirect('/login');
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

    if (await userLoginSchema_Email.validate(req.body).catch((e) => { err = e; })) {
        next();
    } else if (await userLoginSchema_username.validate(req.body).catch((e) => { err = e; })) {
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
