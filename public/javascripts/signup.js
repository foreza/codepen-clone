

$(() => {



    $("#signup-form").submit((e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const postData = {
            fullName: formData.get("fullName").trim(),
            username: formData.get("username").trim(),
            email: formData.get("email").trim(),
            password: formData.get("password").trim(),
        }

        console.log(postData);
        // TODO: additional FE validation here, ideally against some schema 


        $.post("/users", postData).then(res => {
            window.location.href = "/login";
        }).catch(error => {
            console.error(error);
        })





    });

});