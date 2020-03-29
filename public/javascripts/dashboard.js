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
        $("#pen-card-view").append(generatePenCardDom(pens[i].penName, pens[i].userId, pens[i].penId));
    }

}



function generatePenCardDom(title, userId, cardId){

    return `<div class="col s12 m6 l4">
                <div class="card">
                    <div class="card-image">
                        <a class="pen-title-link" href="/${userId}/pen/${cardId}">
                            <div class="placeholder">
                            </div>
                        </a>   
                    </div>
                </div>
                <div class="card-content">
                    <div class="row card-info">
                    <a class="pen-title-link" href="/${userId}/pen/${cardId}">
                        <span>${title}</span>
                    </a>
                    <span class="card-options">
                        <i class="material-icons">more_horiz</i>
                    </span>
                    </div>
                    <div class="row card-action">
                        <button><i class="material-icons">favorite_border</i><span>4</span></button>
                        <button><i class="material-icons">comment</i><span>3</span></button>
                        <button><i class="material-icons">visibility</i><span>2</span></button>
                    </div>
                </div>
            </div>`

}