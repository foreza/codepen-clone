var leftPane;                                   // Reference to left IDE container
var centerPane;                                 // Reference to center IDE container
var rightPane;                                  // Reference to right IDE container
var bottomPane;                                 // Reference to bottom iframe render container
var leftAnchor;                                 // Reference to anchor between left / center IDE container
var rightAnchor;                                // Reference to anchor between right / center IDE container
var bottomAnchor;                               // Reference to anchor between IDE group and bottomPane container
var resizeLeft = false;                         // Track whether currently resizing with leftAnchor
var resizeRight = false;                        // Track whether currently resizing with rightAnchor
var resizeBottom = false;                       // Track whether currently resizing with bottomAnchor
var tWidth;                                     // Global store temporary width for left/right anchor operations
var tHeight;
var leftEditor;                                 // Reference to left monaco editor
var centerEditor;                               // Reference to center monaco editor
var rightEditor;                                // Reference to right monaco editor
var htmlEditorContent;                          // Content for left monaco editor
var cssEditorContent;                           // Content for center monaco editor
var jsEditorContent;                            // Content for right monaco editor
let editingName = false;
let penShowContainer;
let penEditContainer;
let penNameInput;
let penNameView;
let externalsString = "";
const timeBeforeEditorUpdate = 1000;            // Default time                     
var updateTimerRef;



// Monaco Editor config
require.config({ paths: { 'vs': '/min/vs' } });


$(() => {

    // Add a "put" and "delete" shortcut since it's already supported.
    jQuery.each(["put", "delete"], function (i, method) {
        jQuery[method] = function (url, data, callback, type) {
            if (jQuery.isFunction(data)) {
                type = type || callback;
                callback = data;
                data = undefined;
            }

            // GET/POST shortcuts are already supported. 
            // We'll add 2 additional dataTypes when we call put/delete.
            return jQuery.ajax({
                url: url,
                type: method,
                dataType: type,
                data: data,
                success: callback
            });
        };
    });

    // Materialize component init
    $('.dropdown-trigger').dropdown();
    $('.modal').modal();
    $('.tabs').tabs();

    editingName = false;
    penShowContainer = $("#pen-name-show-container");
    penEditContainer = $("#pen-name-edit-container");
    penNameInput = $("#penName");
    penNameView = $("#pen-name-value");

    // Pen update name - change state
    $("#edit-pen-name").click(() => {
        if (!editingName) {
            editingName = true;
            penShowContainer.hide();
            penEditContainer.show();
        }
    })

    // Pen update name - do a PUT
    $("#save-pen-name").click(() => {
        if (editingName) {
            editingName = false;
            const updatedPenName = penNameInput.val();

            if (typeof penInfo !== 'undefined' && typeof penFragments !== 'undefined') {
                penNameView.text(updatedPenName);
                putPenUpdate(penInfo.penId, updatedPenName, htmlEditorContent, cssEditorContent, jsEditorContent, penExternals);
            } else {
                postNewPen(userId, updatedPenName, htmlEditorContent, cssEditorContent, jsEditorContent, penExternals);
            }
            penShowContainer.show();
            penEditContainer.hide();
        }

    })

    // Pen creation/saving logic 
    $("#save-pen").click(() => {

        if (typeof penInfo !== 'undefined' && typeof penFragments !== 'undefined') {
            putPenUpdate(penInfo.penId, penInfo.penName, htmlEditorContent, cssEditorContent, jsEditorContent, penExternals);
        } else {
            postNewPen(userId, penNameView.val(), htmlEditorContent, cssEditorContent, jsEditorContent, penExternals);
        }

    });

    // If 'pen' was provided, set content
    if (typeof penInfo !== 'undefined' && typeof penFragments !== 'undefined') {
        for (var i = 0; i < penFragments.length; ++i) {
            switch (penFragments[i].fragmentType) {
                case 0:
                    htmlEditorContent = penFragments[i].body;
                    break;
                case 1:
                    cssEditorContent = penFragments[i].body;
                    break;
                case 2:
                    jsEditorContent = penFragments[i].body;
                    break;
            }
        }
    } else {
        alert("no content provided");
        htmlEditorContent = cssEditorContent = jsEditorContent = "";
    }

    // Import remote externals and make string for template:
    externalsString = generateLocalExternals(penExternals);

    // Setup Monaco Editor view
    monaco_setupMonacoResizing();
    monaco_configure();

    // Render content provided from remote
    monaco_initializeEditors();

    // Setup modals
    setupExternalModals();
});


function generateLocalExternals(externalsList) {
    let externals = "";
    for (var i = 0; i < externalsList.length; ++i) {
        switch (externalsList[i].externalType) {
            case 0: // css
                externals += `<link type="text/css" rel="stylesheet" href='${externalsList[i].url}' />`
                break;
            case 1: // js
                externals += `<script type="text/javascript" src='${externalsList[i].url}'></script>`
                break;
        }

        externals += "\n"
    }

    // console.log("externals string: ", externals);
    return externals;
}

function returnRenderContentForiFrame(html, css, javascript, externalString) {

    const template = `<html>
    <head>
    ${externalString}
    <style>${css}</style>
    </head>
    <body>${html}
        <script>${javascript}</script>
    </body>
</html>`;

    console.log("generated:", template);



    return template;
}

function handleEditorUpdate() {
    if (updateTimerRef) {
        clearTimeout(updateTimerRef);
    }
    updateTimerRef = setTimeout(refreshRenderContent, timeBeforeEditorUpdate);
}





function refreshRenderContent() {
    renderInIframe(
        returnRenderContentForiFrame(
            leftEditor.getValue(),
            centerEditor.getValue(),
            rightEditor.getValue(),
            externalsString)
    );
}

function renderInIframe(content) {
    let iFrame = document.getElementById('results-window');
    iFrame = iFrame.contentWindow || iFrame.contentDocument.document || iFrame.contentDocument;
    iFrame.document.open();
    iFrame.document.write(content);
    iFrame.document.close();
}

// Pen API calls

function postNewPen(userId, penName, htmlContent, cssContent, jsContent, externals) {

    const newPen = {
        penInfo: {
            userId: userId,
            penName: penName,
            numFavorites: 0,
            numComments: 0,
            numViews: 0
        },
        penFragments: [
            {
                fragmentType: 0,
                body: htmlContent,
                htmlClass: null,
                htmlHead: null
            },
            {
                fragmentType: 1,
                body: cssContent,
                htmlClass: null,
                htmlHead: null
            },
            {
                fragmentType: 2,
                body: jsContent,
                htmlClass: null,
                htmlHead: null
            }
        ],
        penExternals: externals
    }

    $.post('/pens', newPen, (data) => {
        window.location.href = `/${userId}/pen/${data.penId}`;
    })

}

function putPenUpdate(penId, penName, htmlContent, cssContent, jsContent, externals) {

    // Update the local pen fragments object.
    for (var i = 0; i < penFragments.length; ++i) {
        switch (penFragments[i].fragmentType) {
            case 0:
                penFragments[i].body = htmlContent;
                break;
            case 1:
                penFragments[i].body = cssContent;
                break;
            case 2:
                penFragments[i].body = jsContent;
                break;
        }
    }

    const updatedPen = {
        penInfo: {
            penId: penId,
            penName: penName,
            numFavorites: 99,   // TODO: implement
            numComments: 99,    // TODO: implement
            numViews: 99        // TODO: implement
        },
        penFragments: penFragments,
        penExternals: externals
    }


    console.log('updated pen:', updatedPen);

    $.put(`/pens/${penId}`, updatedPen, (data) => {
        // TODO: Use this if we need it.
    }).catch(error => {
        // Handle error
    })
}


// Monaco Specific functions:

function monaco_configure() {
    require(['vs/editor/editor.main'], () => {
        monaco.editor.setTheme('vs-dark');
    });
}

function monaco_initializeEditors() {

    require(['vs/editor/editor.main'], () => {

        leftEditor = monaco.editor.create(document.getElementById('editor-1-ide'), {
            value: htmlEditorContent,
            language: 'html',
            automaticLayout: true
        });

        centerEditor = monaco.editor.create(document.getElementById('editor-2-ide'), {
            value: cssEditorContent,
            language: 'css',
            automaticLayout: true

        });

        rightEditor = monaco.editor.create(document.getElementById('editor-3-ide'), {
            value: jsEditorContent,
            language: 'javascript',
            automaticLayout: true
        });

        leftEditor.onDidChangeModelContent(e => {
            htmlEditorContent = leftEditor.getValue();
            handleEditorUpdate();
        })

        centerEditor.onDidChangeModelContent(e => {
            cssEditorContent = centerEditor.getValue();
            handleEditorUpdate();
        })

        rightEditor.onDidChangeModelContent(e => {
            jsEditorContent = rightEditor.getValue();
            handleEditorUpdate();
        })
    });

}

function monaco_refreshContent() {
    leftEditor.layout();
    centerEditor.layout();
    rightEditor.layout();
}

function monaco_resizeWindow() {
    monaco_refreshContent();
}

function monaco_setupMonacoResizing() {

    leftAnchor = $("#editor-resize-1");
    rightAnchor = $("#editor-resize-2");
    bottomAnchor = $("#results-resize");
    leftPane = $("#editor-1");
    centerPane = $("#editor-2");
    rightPane = $("#editor-3");
    editorPane = $("#editor-group");
    bottomPane = $("#result-group");

    bottomPane.height(`${window.innerHeight - editorPane.height()}px`);

    // TODO : Do a RCA to find out why this line is needed
    tHeight = editorPane.height();
    editorPane.height(tHeight);


    bottomAnchor.mousedown(() => {
        resizeLeft = resizeRight = false;
        resizeBottom = true;
    });

    leftAnchor.mousedown(() => {
        resizeRight = resizeBottom = false;
        resizeLeft = true;
        tWidth = leftPane.width() + centerPane.width();
        tHeight = editorPane.height();
    });

    rightAnchor.mousedown(() => {
        resizeRight = true;
        resizeLeft = resizeBottom = false;
        tWidth = centerPane.width() + rightPane.width();
        tHeight = editorPane.height();
    });

    $(document).mouseup(() => {
        resizeLeft = resizeRight = resizeBottom = false;
    })

    $(document).on('mousemove', (e) => {

        if (resizeLeft || resizeRight || resizeBottom) {
            if (resizeLeft) {
                const val = (e.pageX / window.innerWidth) * 100;
                leftPane.width(`${val}%`);
                const val2 = ((tWidth / window.innerWidth) * 100) - val;
                centerPane.width(`${val2}%`);
                editorPane.height(tHeight)
            } else if (resizeRight) {
                const val = ((e.pageX - leftPane.width()) / window.innerWidth) * 100;
                centerPane.width(`${val}%`);
                const val2 = ((tWidth / window.innerWidth) * 100) - val;
                rightPane.width(`${val2}%`);
                editorPane.height(tHeight)
            } else if (resizeBottom) {
                const val = window.innerHeight - e.pageY;
                bottomPane.height(`${val}px`);
                editorPane.height(`${e.pageY}px`);
            }
            monaco_resizeWindow();
        }
    });

}


// Pen externals handling:




var cssExternalListGroup;
var jsExternalListGroup;
var newExternalCount = 0;



function sortLocalExternalsAndPopulate(externalsList) {

    for (var i = 0; i < externalsList.length; ++i) {

        switch (externalsList[i].externalType) {
            case 0:
                cssExternalListGroup.append(generateNewDisplayRow(externalsList[i].externalId, externalsList[i].url));
                break;
            case 1:
                jsExternalListGroup.append(generateNewDisplayRow(externalsList[i].externalId, externalsList[i].url));
                break;
        }

    }

}


function generateNewDisplayRow(id, content) {

    const tempRow = `<li id="${id}" class="collection-item">
    <a href="#!"><i class="material-icons">menu</i></a>    
    <input name="source-${id}" type="text" value="${content}"
required="true" class="external-input validate"/>   
    <div class="row secondary-content">
        <div class="col s12">
            <a href="#!"><i class="material-icons">send</i></a>    
        </div>
        <div class="col s12">
            <a onclick="deleteModalCollectionRow('${id}')" href="#"><i class="material-icons">delete</i></a>   
        </div>
    </div>          
</li>`
    return tempRow;
}

function deleteModalCollectionRow(id) {
    $(`#${id}`).remove();       // Remove from view
    
    // TODO: fix this naive approach of searching the array
    for (var i = 0; i < penExternals.length; ++i) {
        console.log("called on:", id);
        console.log("iterating through ids:", penExternals[i].externalId)
        if (penExternals[i].externalId == id){
            penExternals[i].delete = true;
            console.log("found, set remove param to true");
            break;
        }
    }

}


function generateExternalsObject(tempExtId, type) {

    const newObj = {
        externalId: tempExtId,
        externalType: type
    }

    return newObj;
}

function setupExternalModals() {

    cssExternalListGroup = $("#modal-css-externals");
    jsExternalListGroup = $("#modal-js-externals");

    $("#modal-css-externals-add").click(() => {
        newExternalCount++;
        id = `new-external-${newExternalCount}`;
        cssExternalListGroup.append(
            generateNewDisplayRow(id, '<link>'));
        penExternals.push(generateExternalsObject(id, 0))
    });

    $("#modal-js-externals-add").click(() => {
        newExternalCount++;
        id = `new-external-${newExternalCount}`;
        jsExternalListGroup.append(
            generateNewDisplayRow(null, "<script>"));
        penExternals.push(generateExternalsObject(id, 1))
    });


    // Set up links to the modals 
    $('#modal-css-link').click(() => {
        $('.tabs').tabs('select', 'tab-css');
    });

    $('#modal-html-link').click(() => {
        $('.tabs').tabs('select', 'tab-html');
    });

    $('#modal-js-link').click(() => {
        $('.tabs').tabs('select', 'tab-js');
    });





    sortLocalExternalsAndPopulate(penExternals);

}