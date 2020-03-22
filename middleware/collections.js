const middlewareCollection = {};
const yup = require('yup');

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
