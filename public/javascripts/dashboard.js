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
                        <div class="placeholder">
                        </div>
                    </div>
                </div>
                <div class="card-content">
                    <div class="row card-info">
                        <span>${title}</span>
                        <span class="card-options">
                            <a href="/${userId}/pen/${cardId}">
                                <i class="material-icons">more_horiz</i>
                            </a>
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