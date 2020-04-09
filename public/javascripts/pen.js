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
let htmlClassInput;                             // Global Reference to modal's html class content
let htmlHeadInput;                              // Global Reference to modal's html head content
let htmlClassValue = "";
let htmlHeadValue = "";
let externalsString = "";
const timeBeforeEditorUpdate = 1000;            // Default time                     
var updateTimerRef;
let currentHash;



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

    htmlClassInput = $("#modal-html-classes");
    htmlHeadInput = $("#modal-html-content");




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
                putPenUpdate(penInfo.penId, updatedPenName,
                    htmlEditorContent, cssEditorContent, jsEditorContent,
                    penExternals, htmlClassValue, htmlHeadValue);
            } else {
                postNewPen(userId, updatedPenName,
                    htmlEditorContent, cssEditorContent, jsEditorContent,
                    penExternals, htmlClassValue, htmlHeadValue);
            }
            penShowContainer.show();
            penEditContainer.hide();
        }

    })

    // Pen creation/saving logic 
    $("#save-pen").click(() => {

        if (checkHasHashChanged()){
            updateStoredHashForEditor();
            $("#save-pen").removeClass("save-indicator");

            if (typeof penInfo !== 'undefined' && typeof penFragments !== 'undefined') {
                putPenUpdate(penInfo.penId, penInfo.penName,
                    htmlEditorContent, cssEditorContent, jsEditorContent,
                    penExternals, htmlClassValue, htmlHeadValue);
            } else {
                postNewPen(userId, penNameView.text().trim(),
                    htmlEditorContent, cssEditorContent, jsEditorContent,
                    penExternals, htmlClassValue, htmlHeadValue);
            }


        } else {
            // No change detected
        }

    });

    // If 'pen' was provided, set content
    if (typeof penInfo !== 'undefined' && typeof penFragments !== 'undefined') {

        htmlClassValue = (penInfo.htmlClass != null) ? penInfo.htmlClass : "";
        htmlHeadValue = (penInfo.htmlHead != null) ? penInfo.htmlHead : "";

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
        alert("Let's make a new pen!");
        htmlEditorContent = cssEditorContent = jsEditorContent = "";
        htmlHeadValue = htmlClassValue = "";
        $("#pen-save-status-content").text("Remember to save often!");
    }





    // Setup Monaco Editor view
    monaco_setupMonacoResizing();
    monaco_configure();

    // Render content provided from remote
    monaco_initializeEditors();

    // Setup modals (also sets up externalsDictionary)
    setupExternalModals();

    // Import remote externals and make string for template:
    externalsString = generateExternalsRenderString(externalsDictionary);

    // Use all the values set above to set an initial hash for our editor
    updateStoredHashForEditor();

});

function generateExternalsRenderString(externalsList) {

    let keys = Object.keys(externalsList);
    let externals = "";

    for (var i = 0; i < keys.length; ++i) {
        // https://stackoverflow.com/questions/1410311/regular-expression-for-url-validation-in-javascript

        const targetURL = externalsList[keys[i]].url;

        // Skip rendering anything marked for deletion and that isn't a proper URL
        if (!externalsList[keys[i]].delete && validateURL(targetURL)) {

            switch (externalsList[keys[i]].externalType) {
                case 0: // css
                    externals += `<link type="text/css" rel="stylesheet" href='${externalsList[keys[i]].url}' />`
                    break;
                case 1: // js
                    externals += `<script type="text/javascript" src='${externalsList[keys[i]].url}'></script>`
                    break;
            }
        }

        externals += "\n"

    }

    return externals;
}

// Function that returns content to be rendered given snippets/external sources
function returnRenderContentForiFrame(html, css, javascript,
    externalString, htmlClass, htmlHead) {

    const template = `<html class="${htmlClass}">
    <head>
    ${htmlHead}
    ${externalString}
    <style>${css}</style>
    </head>
    <body>${html}
        <script>${javascript}</script>
    </body>
</html>`;

    return template;
}

// Resets timer before a new iFrame render
function handleEditorUpdate() {
    if (updateTimerRef) {
        clearTimeout(updateTimerRef);
    }
    updateTimerRef = setTimeout(refreshRenderContent, timeBeforeEditorUpdate);
}

// Function to invoke rendering with provided content + externals in iframe
function refreshRenderContent() {

    if (checkHasHashChanged()) {
        $("#pen-save-status-content").text("Remember to save!");
        $("#save-pen").addClass("save-indicator");

        renderInIframe(
            returnRenderContentForiFrame(
                leftEditor.getValue(),
                centerEditor.getValue(),
                rightEditor.getValue(),
                externalsString,
                htmlClassValue,
                htmlHeadValue
            )
        );

    } else {
        $("#save-pen").removeClass("save-indicator");
        $("#pen-save-status-content").text("");
    }


}

// Function to render some specified content in iframe
function renderInIframe(content) {
    let iFrame = document.getElementById('results-window');
    iFrame = iFrame.contentWindow || iFrame.contentDocument.document || iFrame.contentDocument;
    iFrame.document.open();
    iFrame.document.write(content);
    iFrame.document.close();
}

// Pen API calls

function postNewPen(userId, penName,
    htmlContent, cssContent, jsContent,
    externals, htmlClass, htmlHead) {


    const newPen = {
        penInfo: {
            userId: userId,
            penName: penName,
            numFavorites: 0,
            numComments: 0,
            numViews: 0,
            htmlClass: htmlClass,
            htmlHead: htmlHead
        },
        penFragments: [
            {
                fragmentType: 0,
                body: htmlContent,
            },
            {
                fragmentType: 1,
                body: cssContent,
            },
            {
                fragmentType: 2,
                body: jsContent,
            }
        ],
        penExternals: externals
    }

    $.post('/pens', newPen, (data) => {
        window.location.href = `/${username}/pen/${data.hashId}`;
    })

}

function putPenUpdate(penId, penName,
    htmlContent, cssContent, jsContent,
    externals, htmlClass, htmlHead) {

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
            numViews: 99,       // TODO: implement
            htmlClass: htmlClass,
            htmlHead: htmlHead
        },
        penFragments: penFragments,
        penExternals: externals
    }


    $("#pen-save-status-content").text("Updating Pen..");

    $.put(`/pens/${penId}`, updatedPen, (data) => {
        console.log("Returned pen external data:", data.penExternals)
        penExternals = data.penExternals;
        sortLocalExternalsAndPopulate(penExternals);
        $("#pen-save-status-content").text("");

    }).catch(error => {
        alert('Error updating pen');
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


        refreshRenderContent();     // do an initial render

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


// Pen externals

var cssExternalListGroup;                   // Global Reference to modal's css external list
var jsExternalListGroup;                    // Global Reference to modal's js external list
var newExternalCount = 0;                   // Keeps track of any new external sources made
const externalsDictionary = {};             // Local collection of externals to sync with `penExternals` provided by the server


// Function to get references to the external list groups, bind click events
// Should be run only once initially on page load
function setupExternalModals() {

    cssExternalListGroup = $("#modal-css-externals");
    jsExternalListGroup = $("#modal-js-externals");

    htmlClassInput.val(htmlClassValue);
    htmlHeadInput.val(htmlHeadValue);

    sortLocalExternalsAndPopulate(penExternals);

    // When the "save" button is clicked, sync the updates with the updated / changed list
    $("#modal-stage-update").click(() => {

        htmlClassValue = (htmlClassInput.val() != null) ? htmlClassInput.val() : "";
        htmlHeadValue = (htmlHeadInput.val() != null) ? htmlHeadInput.val() : "";


        updateExternalsDictionaryFromList(cssExternalListGroup, "CSS");
        updateExternalsDictionaryFromList(jsExternalListGroup, "JavaScript");
        externalsString = generateExternalsRenderString(externalsDictionary);
        syncExternalContentWithPenExternals();
        refreshRenderContent();

        if (checkHasHashChanged()) {
            $("#pen-save-status-content").text("Remember to save!");
            $("#save-pen").addClass("save-indicator");
        }

    })

    // TODO: Exiting out of the modal should revert everything back to a prior state.
    // Currently, this isn't supported.


    // When a new external css/js is added, ensure we're keeping an updated ID in the local object
    $("#modal-css-externals-add").click(() => {
        newExternalCount++;
        const id = `new-external-${newExternalCount}`;
        cssExternalListGroup.append(
            generateNewDisplayRow(id, ''));

        externalsDictionary[id] = generateExternalsObject(id, 0);
    });

    $("#modal-js-externals-add").click(() => {
        newExternalCount++;
        const id = `new-external-${newExternalCount}`;
        jsExternalListGroup.append(
            generateNewDisplayRow(id, ''));

        externalsDictionary[id] = generateExternalsObject(id, 1);
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

}


// Iterates through a provided externalsList (penExternals)
// Should be called ONLY on page load or page update (via put) to do an initial populate
function sortLocalExternalsAndPopulate(externalsList) {

    cssExternalListGroup.empty();
    jsExternalListGroup.empty();

    // Generate under the correct display group (CSS or JS)
    // display this out based off of CSS or JS: O(n)
    for (var i = 0; i < externalsList.length; ++i) {

        switch (externalsList[i].externalType) {
            case 0:
                cssExternalListGroup.append(
                    generateNewDisplayRow(
                        externalsList[i].externalId,
                        externalsList[i].url));
                break;
            case 1:
                jsExternalListGroup.append(
                    generateNewDisplayRow(
                        externalsList[i].externalId,
                        externalsList[i].url));
                break;
        }

        // Populate externalsDictionary, using the DB's external ID as key
        // This allows O(1) lookup time
        externalsDictionary[(externalsList[i].externalId)] = externalsList[i];
    }

}


// Function to generate DOM for a new externals list display row
function generateNewDisplayRow(id, content) {

    const tempRow =
        `<li id="${id}" class="row collection-item">
        <div class="valign-wrapper col s1">
            <a href="#!"><i class="material-icons">menu</i></a>
        </div>
        <div class="valign-wrapper col s10">    
            <input name="source-${id}" type="url" value="${content}" required="true" 
            class="external-input validate"/>
        </div>
        <div class="row secondary-content col s1">
            <div class="col s12">
                <a class="icon-wrapper-link" target="_blank" href="${content}">
                <i class="material-icons">send</i></a>    
            </div>
            <div class="col s12">
                <a class="icon-wrapper-link" onclick="deleteModalCollectionRow('${id}')">
                <i class="material-icons">delete</i></a>   
            </div>
        </div>          
    </li>`

    return tempRow;
}

// Function to delete from DOM and the local dictionary
// Each externals list item will be able to invoke this function
function deleteModalCollectionRow(id) {
    $(`#${id}`).remove();                       // Remove from view
    if (id.indexOf("new-external-") >= 0) {
        delete externalsDictionary[id];         // If it's a new external, remove it
    } else {
        // Otherwise, remove everything else besides the external id
        delete externalsDictionary[id].url;
        delete externalsDictionary[id].penId;
        delete externalsDictionary[id].externalType;
    }
}

// Function to sync the externalsDictionary with the content actually entered
// TODO: A validation step should be done prior
function updateExternalsDictionaryFromList(listGroup, name) {

    inputRows = listGroup.children();               // Get the list of rows for the list group
    let errState = false;
    let errDict = [];

    // For each row, find the relevant entry in the dictionary and update the value (O(n))
    for (var i = 0; i < inputRows.length; ++i) {
        const id = inputRows[i].id;
        const input = $(inputRows[i]).find(".external-input");
        const url = input[0].value;
        externalsDictionary[id].url = url;
        if (!validateURL(url)) {
            $(input[0]).focus();
            errState = true;
            errDict.push(`${name} : ${url}`);
        }
    }

    if (errState) {
        alert(`Please correct the following ${name} errors - the following ${name} sources will be saved, but not be rendered: ` + JSON.stringify(errDict, null, 4));
    }

}


function syncExternalContentWithPenExternals() {

    // externalsDictionary => penExternals on save
    penExternals = [];          // Reset this to empty - our dictionary is source of truth

    let keys = Object.keys(externalsDictionary);

    for (var i = 0; i < keys.length; ++i) {
        const id = externalsDictionary[keys[i]].externalId;

        if (typeof id === 'string') {

              // If this is new content (doesn't have a penId), omit the ID so we can get a proper one from the server
              const insertObj = {
                  externalType: externalsDictionary[keys[i]].externalType,
                  url: externalsDictionary[keys[i]].url
              }
  
              penExternals.push(insertObj);

        } else {
            penExternals.push(externalsDictionary[keys[i]]);
        }

    }

}

// Helper function to generate a new externals object
function generateExternalsObject(tempExtId, type) {
    const newObj = {
        externalId: tempExtId,
        externalType: type
    }
    return newObj;
}

function validateURL(url){
    const validURL = /^(ftp|http|https):\/\/[^ "]+$/.test(url);
    return validURL;
}


function updateStoredHashForEditor() {
    currentHash = generateDirtyHash([htmlClassValue, htmlHeadValue, htmlEditorContent, cssEditorContent, jsEditorContent, externalsString]);
}

function checkHasHashChanged() {
    const tHash = generateDirtyHash([htmlClassValue, htmlHeadValue, htmlEditorContent, cssEditorContent, jsEditorContent, externalsString])
    return (tHash != currentHash);
}

function generateDirtyHash(arr) {
    var stringToHash = arr.join(",");
    return stringToHash.hashCode();
}

// https://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
String.prototype.hashCode = function(){
	var hash = 0;
	if (this.length == 0) return hash;
	for (i = 0; i < this.length; i++) {
		char = this.charCodeAt(i);
		hash = ((hash<<5)-hash)+char;
		hash = hash & hash; 
	}
	return hash;
}