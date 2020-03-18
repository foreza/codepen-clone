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
var leftEditorContent;                          // Content for left monaco editor
var centerEditorContent;                        // Content for center monaco editor
var rightEditorContent;                         // Content for right monaco editor

// Monaco Editor config
require.config({ paths: { 'vs': '../javascripts/monaco-editor/min/vs' } });

function formatDocument(html, css, javascript) {
    return `<html><head><style>${css}</style><body>${html}<script>${javascript}<\/script></body></html>`;
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

function monaco_loadContentFromRemote() {

    leftEditorContent = [
        '<html><h1>peace in my bodyyy</html>'
    ].join('\n');

    centerEditorContent = [
        'body {',
        '\t margin-left: 0;',
        '}'
    ].join('\n');

    rightEditorContent = [
        'function x() {',
        '\tconsole.log("Hello world!");',
        '}'
    ].join('\n');
}

function monaco_initializeEditors() {

    require(['vs/editor/editor.main'], () => {

        leftEditor = monaco.editor.create(document.getElementById('editor-1'), {
            value: leftEditorContent,
            language: 'html',
            automaticLayout: true
        });

        centerEditor = monaco.editor.create(document.getElementById('editor-2'), {
            value: centerEditorContent,
            language: 'css',
            automaticLayout: true

        });

        rightEditor = monaco.editor.create(document.getElementById('editor-3'), {
            value: rightEditorContent,
            language: 'javascript',
            automaticLayout: true
        });

        leftEditor.onDidChangeModelContent(e => {
            leftEditorContent = leftEditor.getValue();
            refreshRenderContent();
        })

        centerEditor.onDidChangeModelContent(e => {
            centerEditorContent = centerEditor.getValue();
            refreshRenderContent();
        })

        rightEditor.onDidChangeModelContent(e => {
            rightEditorContent = rightEditor.getValue();
            refreshRenderContent();
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

$(function () {

    $('.dropdown-trigger').dropdown();
    $('.modal').modal();
    $('.tabs').tabs();

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

    monaco_configure();
    monaco_loadContentFromRemote();
    monaco_initializeEditors();

});






