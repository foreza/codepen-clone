var pens = [];

$(document).ready(function () {

    // Initialize Materialize components
    $('.tabs').tabs();
    $('select').formSelect();
    $('.dropdown-trigger').dropdown();
    $('.sidenav').sidenav();
    $('.collapsible').collapsible();

    // User ID is provided in EJS template
    if (typeof userId !== 'undefined'){
        getPensForUser(userId);
    } else {
        // Error handling here. We should always have the user ID.
        alert("Missing userID. Something went wrong!")
    }

});

// GET: Fetch all pens for user (userId provided by EJS template )
function getPensForUser(userId) {
    $.get(`/pens/user/${userId}`).then((data) => {
        pens = data;
        console.log(`called /pens/user/${userId}, got data: ${pens}` );
        if (typeof username !== 'undefined'){
            renderPensForUser(pens, username);
        } else {
            alert("something wrong");
            throw Error("Username not found")
        }
    }).catch(error => {
        alert(`${error.responseText} `);
    })
}

// 
function renderPensForUser(pens, username) {
    for (var i = 0; i < pens.length; ++i){
        $("#pen-card-view").append(util_generatePenCardDom(pens[i], username));
    }
}


function util_generatePenCardDom(pen, username){

    if (typeof pen.uri != undefined) {
        console.log(pen.uri);
        var truncatedUri = (pen.uri).substring(8);      // Temp fix - let's talk about this?
    } else {
        pen.uri = "/images/placeholder.jpg"
    };
    

    return `<div class="col s12 m6 l4">
                <div class="card">
                    <div class="card-image">
                        <a class="pen-title-link" href="/${username}/pen/${pen.hashId}">
                            <div class="preview-container">
                                <img src="${truncatedUri}"/>
                            </div>
                        </a>   
                    </div>
                </div>
                <div class="card-content">
                    <div class="row card-info">
                    <a class="pen-title-link" href="/${username}/pen/${pen.hashId}">
                        <span>${pen.penName}</span>
                    </a>
                    <span class="card-options">
                        <i class="material-icons">more_horiz</i>
                    </span>
                    </div>
                    <div class="row card-action">
                        <button><i class="material-icons">favorite_border</i><span>${pen.numFavorites}</span></button>
                        <button><i class="material-icons">comment</i><span>${pen.numComments}</span></button>
                        <button><i class="material-icons">visibility</i><span>${pen.numViews}</span></button>
                    </div>
                </div>
            </div>`

}