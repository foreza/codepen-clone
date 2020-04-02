var pens = [];

$(document).ready(function () {
    $('.tabs').tabs();
    $('select').formSelect();
    $('.dropdown-trigger').dropdown();
    $('.sidenav').sidenav();
    $('.collapsible').collapsible();

    getPensForUser(userId);

});


// API route

function getPensForUser(userId) {
    // TODO: implement
    $.get(`/pens/user/${userId}`).then((data) => {
        console.log(data);
        pens = data;
        renderPensForUser(pens);
    }).catch(error => {
        alert(`${error.responseText} `);
    })
}



function renderPensForUser(pens) {

    for (var i = 0; i < pens.length; ++i){
        console.log("creating pen: ", pens[i].penName);
        $("#pen-card-view").append(generatePenCardDom(pens[i]));
    }

}



function generatePenCardDom(pen){

    return `<div class="col s12 m6 l4">
                <div class="card">
                    <div class="card-image">
                        <a class="pen-title-link" href="/${pen.hashId}/pen/${pen.penId}">
                            <div class="placeholder">
                            </div>
                        </a>   
                    </div>
                </div>
                <div class="card-content">
                    <div class="row card-info">
                    <a class="pen-title-link" href="/${pen.hashId}/pen/${pen.penId}">
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