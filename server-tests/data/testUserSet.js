
const smokeTestUsers = {};
const smokeTestLogins = {};

smokeTestUsers.test_user_0 = {
    fullName: "sampleTestRat",
    username: "IAmALabRat",
    email: "sampletest@test.com",
    password: "asdsdfsadfasdf"
};

// Valid login - uses the username
smokeTestLogins.test_user_0a = {
    usernameOrEmail: "IAmALabRat",
    password: "asdsdfsadfasdf"
}

// Valid login - uses the email
smokeTestLogins.test_user_0b = {
    usernameOrEmail: "sampletest@test.com",
    password: "asdsdfsadfasdf"
}

// Invalid logins

// Wrong username
smokeTestLogins.test_user_0_bad_0 = {
    usernameOrEmail: "IAmALadddRat",
    password: "asdsdfsadfasdf"
}

// Wrong password
smokeTestLogins.test_user_0_bad_1 = {
    usernameOrEmail: "sampletest@test.com",
    password: "asdsdfsadasdfasdffasdf"
}

// Empty
smokeTestLogins.test_user_0_bad_2 = {
    usernameOrEmail: "",
    password: ""
}

// Clearly invalid input
smokeTestLogins.test_user_0_bad_3 = {
    usernameOrEmail: "aksdlfjaslkdfjla;skdflaksdjla;skdjflaksdjflkasjaekjh;salkjdflksadjfl;aksdjflaksdjflaskdjflkasdjfl;kasf;kj",
    password: "asdf;laksd;lfkas;ldfoaiejlaksdjflksdjfoiasj;flaksjdfo;aisdjflkasjdf;lasjdfoiasj"
}

// Clearly invalid input
smokeTestLogins.test_user_0_bad_4 = {
    usernameOrEmail: "sampletest@test.com",
    theEarthKing: "welcomes you"
}


// TODO: FIX this stuff and add more tests
// Tests minimum allowable name length (1)
// Tests maximum allowable grade (100)
// Tests minimum allowed grade (0)

const validUsers = {};


// Tests maximum allowable fullName length (30)
validUsers.test_user_0 = {
    fullName: "sampleTestRatsampsampleTestRat",
    username: "IAmALabRat",
    email: "sampletest@test.com",
    password: "asd_asdfasdfasdfasdf"
};

const invalidUsers = {};

// Invalid due to no provided param
// Invalid due to missing '' param
// Invalid due to missing '' param
// Invalid due to missing both params and including wrong param
// Invalid due to incorrect type
// Invalid due to name incorrect type
// Invalid due to name too long (way larger than 12)

const params = { smokeTestUsers, smokeTestLogins }

module.exports = params;