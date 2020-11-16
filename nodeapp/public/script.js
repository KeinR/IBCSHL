//create a document.ready that sets up click handlers 
//for your two buttons and passes off to the functions below

document.ready(() => {
    $("button#read").on('click', e => {
        read();
    });
    $("button#list").on('click', e => {
        list();
    });
});

function read() {

//make an ajax call to your /read route and then pass
//off to your readHandler function
    $.ajax({
        url: '/read',
        dataType: "json",
        success: readHandler
    });

}

function list() {

//make an ajax call to your /list route and then pass
//off to your listHandler function
    $.ajax({
        url: '/list',
        dataType: "json",
        success: listHandler
    });

}

function readHandler(response) {

//replace the content of the output div with the 
//contents of the response
    $("div#output").html(response);

}

function listHandler(response) {

//write an array.map that will
//append the contents of the response to 
//the output div - format it pretty like
    $("div#output").html("");
    response.map(e => {
        $("div#output").append(```
        ------------------------------ <br>
        id = ${e.id} <br>
        name = ${e.name} <br>
        spirit animal = ${e.spiritAnimal} <br>
        ```);
    });

}
