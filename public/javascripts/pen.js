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
var leftEditor;                                 // Reference to left monaco editor
var centerEditor;                               // Reference to center monaco editor
var rightEditor;                                // Reference to right monaco editor
var htmlEditorContent;                          // Content for left monaco editor
var cssEditorContent;                        // Content for center monaco editor
var jsEditorContent;                         // Content for right monaco editor
const timeBeforeEditorUpdate = 1000;            // Default time                     
var updateTimerRef;

// Monaco Editor config
require.config({ paths: { 'vs': '/min/vs' } });

function formatDocument(html, css, javascript) {
    return `<html><head><style>${css}</style><body>${html}<script>${javascript}<\/script></body></html>`;
}

function handleEditorUpdate() {
    if (updateTimerRef) {
        clearTimeout(updateTimerRef);
    }
    updateTimerRef = setTimeout(refreshRenderContent, timeBeforeEditorUpdate);
}

function refreshRenderContent() {
    renderInIframe(formatDocument(leftEditor.getValue(), centerEditor.getValue(), rightEditor.getValue()));
}

function renderInIframe(content) {
    let iFrame = document.getElementById('results-window');
    iFrame = iFrame.contentWindow || iFrame.contentDocument.document || iFrame.contentDocument;
    iFrame.document.open();
    iFrame.document.write(content);
    iFrame.document.close();
}

function monaco_configure() {
    require(['vs/editor/editor.main'], () => {
        monaco.editor.setTheme('vs-dark');
    });
}


function displayPenContent(htmlContent, cssContent, jsContent) {
    htmlEditorContent = [htmlContent].join('\n');
    cssEditorContent = [cssContent].join('\n');
    jsEditorContent = [jsContent].join('\n');
}


// Pen API calls  - to finish

function getPenForUser(penId) {

    // TODO: implement
    $.get(`/pens/${penId}`, (data) => {

        // undo any special encode/decoding we've done 
        const html = util_decodeSingleQuote(data.htmlContent);
        const css = util_decodeSingleQuote(data.cssContent);
        const js = util_decodeSingleQuote(data.jsContent);

        displayPenContent(html, css, js);
    }).catch(error => {
        alert(`${error.responseText} No valid pen found with the provided information. `);
    })
}


function createNewPen(userId, penName, htmlContent, cssContent, jsContent) {

    var newPen = {
        userId: userId,
        penName: penName,
        cssContent: util_encodeSingleQuote(cssContent),
        jsContent: util_encodeSingleQuote(jsContent),
        htmlContent: util_encodeSingleQuote(htmlContent)
    }

    $.post('/pens', newPen, (data) => {
        window.location.href = `/${userId}/pen/${data.penId}`;
    })

}

function updatePenContent(penId, penName, htmlContent, cssContent, jsContent) {

 
    const updatedPen = {
        penId: penId,
        penName: penName,
        cssContent: util_encodeSingleQuote(cssContent),
        jsContent: util_encodeSingleQuote(jsContent),
        htmlContent: util_encodeSingleQuote(htmlContent)
    }

    $.put(`/pens/${penId}`, updatedPen, (data) => {
        // TODO
    }).catch(error => {
        // Handle error
    })
}

function monaco_initializeEditors() {

    require(['vs/editor/editor.main'], () => {

        leftEditor = monaco.editor.create(document.getElementById('editor-1'), {
            value: htmlEditorContent,
            language: 'html',
            automaticLayout: true
        });

        centerEditor = monaco.editor.create(document.getElementById('editor-2'), {
            value: cssEditorContent,
            language: 'css',
            automaticLayout: true

        });

        rightEditor = monaco.editor.create(document.getElementById('editor-3'), {
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

function updateForResize() {
    monaco_refreshContent();
}

function setupMonacoResizing() {

    leftAnchor = $("#editor-resize-1");
    rightAnchor = $("#editor-resize-2");
    bottomAnchor = $("#results-resize");
    leftPane = $("#editor-1");
    centerPane = $("#editor-2");
    rightPane = $("#editor-3");
    editorPane = $("#editor-group");
    bottomPane = $("#result-group");

    bottomPane.height(window.innerHeight - editorPane.height());

    bottomAnchor.mousedown(() => {
        resizeLeft = resizeRight = false;
        resizeBottom = true;
    });

    leftAnchor.mousedown(() => {
        resizeRight = resizeBottom = false;
        resizeLeft = true;
        tWidth = leftPane.width() + centerPane.width();
    });

    rightAnchor.mousedown(() => {
        resizeRight = true;
        resizeLeft = resizeBottom = false;
        tWidth = centerPane.width() + rightPane.width();
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
            } else if (resizeRight) {
                const val = ((e.pageX - leftPane.width()) / window.innerWidth) * 100;
                centerPane.width(`${val}%`);
                const val2 = ((tWidth / window.innerWidth) * 100) - val;
                rightPane.width(`${val2}%`);
            } else if (resizeBottom) {
                const val = window.innerHeight - e.pageY;
                bottomPane.height(`${val}px`);
                editorPane.height(`${e.pageY}px`);
            }
            updateForResize();
        }
    });

}

$(() => {


    if (typeof penId !== 'undefined') {
        getPenForUser(penId);
    }

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

    $('.dropdown-trigger').dropdown();
    $('.modal').modal();
    $('.tabs').tabs();

    // Pen creation/saving logic 
    $("#save-pen").click(() => {
        if (typeof penId !== 'undefined') {
            // TODO: Change this to actually reflect the title edit / change
            updatePenContent(penId, "i modified dis", htmlEditorContent, cssEditorContent, jsEditorContent);
        } else {
            // TODO: Change this to actually do title edit / change
            createNewPen(userId, "default name", htmlEditorContent, cssEditorContent, jsEditorContent);
        }

    });

    setupMonacoResizing();
    monaco_configure();
    monaco_initializeEditors();

});


function util_encodeSingleQuote(string){
    return string.replace(/'/g, "%27");
}

function util_decodeSingleQuote(string){
    return string.replace(/%27/g, "'");
}








