$(() => {

    $("#login-form").submit((e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const getData = {
            usernameOrEmail: formData.get("usernameOrEmail").trim(),
            password: formData.get("password").trim(),
        }

        $.get("/users/login", getData).then( () => {
            // window.location.href = "/dashboard";
        }).catch(error => {
            alert(`${error.responseText} No valid account found with the provided information. `);
        })

    });

});