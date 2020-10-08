
let questions = {
    data: undefined,
    active: undefined,
    index: -1
};
let totalQuestions = 0;
let correctQuestions = 0;
let streak = 0;
let correctIndex = 0;
let difficulty = "all";
const BUFFER_SIZE = 10;

$(document).ready(() => {
    $(".start").on("click", function() {
        difficulty = $(this).val();
        loadQuestions();
    });
    $("#send").click(() => {
        runQuestion();
    });
});

function loadQuestions() {
    questions.data = undefined;
    questions.index = 0;
    let url = "https://opentdb.com/api.php?";
    url += `amount=${BUFFER_SIZE}`;
    if (difficulty != "all") {
        url += `&difficulty=${difficulty}`;
    }
    $.ajax({
        url: url,
        dataType: "json",
        success: process
    });
}

// Refill the question buffer and continue
// to the next question
function process(data) {
    console.log("Return: " + data.response_code);
    questions.data = data.results;
    next();
}

function runQuestion() {
    let element = $("#selectionForm input:checked");
    let fback = $("#feedback");
    let index = element.val().charCodeAt(0) - 0x61;
    totalQuestions++;
    if (index == correctIndex) {
        correctQuestions++;
        streak++;
        fback.html("Correct!");
        fback.css("color", "green");
    } else {
        streak = 0;
        fback.html(`Incorrect... was "${questions.active.correct_answer}"`);
        fback.css("color", "red");
    }
    element.prop("checked", false);
    next();
}

function updateUI() {
    $("#menu").css("display", "none");
    $("#game").css("display", "block");

    $("#total #corr").html(correctQuestions);
    $("#total #qtotal").html(totalQuestions);
    $("#streak #streakval").html(streak);

    if (questions.active != undefined) {
        if (difficulty == "all") {
            $("#diffWrap").css("display", "block");
            $("#diff").html(questions.active.difficulty);
        } else {
            $("#diffWrap").css("display", "none");
        }
        $("#category").html(questions.active.category);
        $("#quest").html(questions.active.question);

        let a = $("#selectionForm label#la");
        let b = $("#selectionForm label#lb");
        let c = $("#selectionForm label#lc");
        let d = $("#selectionForm label#ld");
        let ia = $("#selectionForm input#a");
        let ib = $("#selectionForm input#b");
        let ic = $("#selectionForm input#c");
        let id = $("#selectionForm input#d");

        let slots = [
            {a: a, b: ia},
            {a: b, b: ib},
            {a: c, b: ic},
            {a: d, b: id}
        ];
        let responses = [
            {val: questions.active.correct_answer, done: false}
        ];
        for (let i = 0; i < questions.active.incorrect_answers.length; i++) {
            responses.push({val: questions.active.incorrect_answers[i], done: false});
        }

        // console.log(responses.length);

        // The slot index
        let f = 0;
        while (f < responses.length) {
            // The response index
            let i = 0;
            do {
                i = Math.floor(Math.random() * responses.length);
                // console.log("loop2");
            } while (responses[i].done);
            // Found one that was open
            responses[i].done = true;
            // console.log("fo: " + responses[i].val);
            // console.log("mm: " + slots[f].html());
            slots[f].a.html(responses[i].val);
            slots[f].a.css("display", "inline");
            slots[f].b.css("display", "inline");
            // First response is the correct one
            if (i == 0) {
                correctIndex = f;
            }
            // console.log("loop");
            f++;
        }

        // Clear and hide the unused ones
        for (; f < slots.length; f++) {
            slots[f].a.html("");
            slots[f].a.css("display", "none");
            slots[f].b.css("display", "none");
        }
    }
}

function next() {
    if (questions.index < questions.data.length) {
        questions.active = questions.data[questions.index];
        updateUI();
        questions.index++;
    } else {
        // Buffer exhausted
        loadQuestions();
    }
}

// checks the users answers vs the correct answers - complete later
function checkAnswers() {

}
