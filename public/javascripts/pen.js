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
                putPenUpdate(penInfo.penId, updatedPenName, htmlEditorContent, cssEditorContent, jsEditorContent);
            } else {
                postNewPen(userId, updatedPenName, htmlEditorContent, cssEditorContent, jsEditorContent);
            }
            penShowContainer.show();
            penEditContainer.hide();
        }

    })

    // Pen creation/saving logic 
    $("#save-pen").click(() => {

        if (typeof penInfo !== 'undefined' && typeof penFragments !== 'undefined') {
            putPenUpdate(penInfo.penId, penInfo.penName, htmlEditorContent, cssEditorContent, jsEditorContent);
        } else {
            postNewPen(userId, penNameView.val(), htmlEditorContent, cssEditorContent, jsEditorContent);
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
        htmlEditorContent = cssEditorContent = jsEditorContent = "";
    }


    // Setup Monaco Editor view
    monaco_setupMonacoResizing();
    monaco_configure();

    // Render content provided from remote
    monaco_initializeEditors();


    console.log("done loading")

});


function returnRenderContentForiFrame(html, css, javascript) {
    return `<html>
                <head>
                <style>${css}</style>
                </head>
                <body>${html}
                    <script>${javascript}</script>
                </body>
            </html>`;
}

function handleEditorUpdate() {
    if (updateTimerRef) {
        clearTimeout(updateTimerRef);
    }
    updateTimerRef = setTimeout(refreshRenderContent, timeBeforeEditorUpdate);
}

function refreshRenderContent() {
    renderInIframe(returnRenderContentForiFrame(
        leftEditor.getValue(),
        centerEditor.getValue(),
        rightEditor.getValue()));
}

function renderInIframe(content) {
    let iFrame = document.getElementById('results-window');
    iFrame = iFrame.contentWindow || iFrame.contentDocument.document || iFrame.contentDocument;
    iFrame.document.open();
    iFrame.document.write(content);
    iFrame.document.close();
}

// Pen API calls

function postNewPen(userId, penName, htmlContent, cssContent, jsContent) {

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
        ]
    }

    $.post('/pens', newPen, (data) => {
        window.location.href = `/${userId}/pen/${data.penId}`;
    })

}

function putPenUpdate(penId, penName, htmlContent, cssContent, jsContent) {

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
        penFragments: penFragments
    }

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

    console.log("monaco_setupMonacoResizing")

    leftAnchor = $("#editor-resize-1");
    rightAnchor = $("#editor-resize-2");
    bottomAnchor = $("#results-resize");
    leftPane = $("#editor-1");
    centerPane = $("#editor-2");
    rightPane = $("#editor-3");
    editorPane = $("#editor-group");
    bottomPane = $("#result-group");

    bottomPane.height(`${window.innerHeight - editorPane.height()}px`);

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