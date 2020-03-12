var leftPane;
var centerPane;
var rightPane;

var leftAnchor;
var rightAnchor;

var resizeLeft = false;
var resizeRight = false;

var bottomPane;
var bottomAnchor;
var resizeBottom = false;

var tWidth;

var tHeight;

$(function () {

    leftAnchor = $("#editor-resize-1");
    rightAnchor = $("#editor-resize-2");
    bottomAnchor = $("#results-resize");

    leftPane = $("#editor-1");
    centerPane = $("#editor-2");
    rightPane = $("#editor-3");
    
    bottomPane = $("#results-window");
    topPane = $("#results-hidden");
    editorPane = $("#editor-group");



    bottomPane.height(window.innerHeight - topPane.height());
    editorPane.height(window.innerHeight);

    bottomAnchor.mousedown(() => {
        console.log("left pressed down");
        resizeLeft = resizeRight = false;
        resizeBottom = true;
    });


    leftAnchor.mousedown(() => {
        console.log("left pressed down");
        resizeLeft = true;
        resizeRight = false;
        resizeBottom = false;
        tWidth = leftPane.width() + centerPane.width();
    });

    rightAnchor.mousedown(() => {
        console.log("right pressed down");
        resizeRight = true;
        resizeLeft = false;
        resizeBottom = false;
        tWidth = centerPane.width() + rightPane.width();
    });

    $(document).mouseup(() => {
        console.log("release");
        resizeLeft = resizeRight = resizeBottom = false;
    })

    $(document).on('mousemove', (e) => {


        if (resizeLeft) {

            var val = (e.pageX / window.innerWidth) * 100;
            leftPane.width(`${val}%`);

            var val2 = ((tWidth / window.innerWidth) * 100) - val;
            centerPane.width(`${val2}%`);
        }

        if (resizeRight) {

            var val = ((e.pageX - leftPane.width()) / window.innerWidth) * 100;
            centerPane.width(`${val}%`);

            var val2 = ((tWidth / window.innerWidth) * 100) - val;
            rightPane.width(`${val2}%`);
        }

        if (resizeBottom) {

            var val = window.innerHeight - e.pageY;
            bottomPane.height(`${val}px`);
            
            topPane.height(`${e.pageY}px`);

        }
    });


});






