
// Possible flags (not all are used)
let alts = {
    CTRL: {pressed: false},
    SHIFT: {pressed: false},
    ALT: {pressed: false},
    LCTRL: {pressed: false},
    LSHIFT: {pressed: false},
    LALT: {pressed: false},
    CLOCK: {pressed: false} // Caps lock ACTIVE
};

// Preprocessor flags to make key map creation a little more
// streamlined
const macros = {
    // Expansions listed afterwards
    TAKE_SUB: 0, // print: [{text: `${cell.subtext}`, mods: [alts.CLOCK]}, {text: `${cell.text}`}]
    TAKE_CAP: 1, // print: [{text: `${cell.text}`, mods: [alts.CLOCK]}, {text: `${String.fromCharCode(cell.text.charCodeAt(0) | 0x20)}`}]
};

// Class name of the key elements
const keyClass = "key";
// The element ID of the output div
const outputID = "output";
// Character used to represent the cutsor
const cursorDisp = "|";
// The position of the cursor
// (-outputText.length < cursorPos <= 0)
let cursorPos = 0;
// The raw text displayed in the output, omitting the cursor
let outputText = "";
// Current color setting of the keys
let keyColor = "#dadada";
// Current color setting of the background
let bgColor = "white";

// Two-dimensional array.
// First dimension is the row (y) of the key.
// Second dimension is the column if the key (x).
// Select via y, x position (keyMap[y][x])
// Get array with conditions and keys.
// All attributes in keyMap[y][x] are optional
// Syntax:
/*
{
    text: "This is displayed",
    subtext: "This is displayed [small]",
    callback: (element) => {
        // Do something ...
    },
    print: [
        // As soon as one object's text is printed,
        // it exits.
        {
            text: "This is printed if CTRL and SHIFT are down",
            mods: [alts.CTRL, alts.SHIFT] // etc...
        },
        {
            text: "This is always printed if CTRL and SHIFT aren't down"
        }
        // .. etc ..
    ],
    macros = [
        // see "macros"
    ]
}
*/
// The default key map
const keyMap = [
    [
        {text: "esc"},
        {text: "f1"},
        {text: "f2"},
        {text: "f3"},
        {text: "f4"},
        {text: "f5"},
        {text: "f6"},
        {text: "f7"},
        {text: "f8"},
        {text: "f9"},
        {text: "f10"},
        {text: "f11"},
        {text: "f12"},
        {text: "insert"},
        {text: "prt sc", callback: (e) => {
            print(); // Literally
        }},
        {text: "delete"}
    ], [
        {text: "`", subtext: "~", macros: [macros.TAKE_SUB]},
        {text: "1", subtext: "!", macros: [macros.TAKE_SUB]},
        {text: "2", subtext: "@", macros: [macros.TAKE_SUB]},
        {text: "3", subtext: "#", macros: [macros.TAKE_SUB]},
        {text: "4", subtext: "$", macros: [macros.TAKE_SUB]},
        {text: "5", subtext: "%", macros: [macros.TAKE_SUB]},
        {text: "6", subtext: "^", macros: [macros.TAKE_SUB]},
        {text: "7", subtext: "&", macros: [macros.TAKE_SUB]},
        {text: "8", subtext: "*", macros: [macros.TAKE_SUB]},
        {text: "9", subtext: "(", macros: [macros.TAKE_SUB]},
        {text: "0", subtext: ")", macros: [macros.TAKE_SUB]},
        {text: "-", subtext: "_", macros: [macros.TAKE_SUB]},
        {text: "=", subtext: "+", macros: [macros.TAKE_SUB]},
        {text: "backspace", subtext: "<-", callback: (e) => {
            if (Math.abs(cursorPos) < outputText.length) {
                outputText = outputText.slice(0, cursorPos) + outputText.slice(cursorPos + 1);
                refreshCursorPos();
            }
        }},
        {text: "home"}
    ], [
        {text: "tab ->|", print: [{text: "    "}]},
        {text: "Q", macros: [macros.TAKE_CAP]},
        {text: "W", macros: [macros.TAKE_CAP]},
        {text: "E", macros: [macros.TAKE_CAP]},
        {text: "R", macros: [macros.TAKE_CAP]},
        {text: "T", macros: [macros.TAKE_CAP]},
        {text: "Y", macros: [macros.TAKE_CAP]},
        {text: "U", macros: [macros.TAKE_CAP]},
        {text: "I", macros: [macros.TAKE_CAP]},
        {text: "O", macros: [macros.TAKE_CAP]},
        {text: "P", macros: [macros.TAKE_CAP]},
        {text: "[", subtext: "{", macros: [macros.TAKE_SUB]},
        {text: "]", subtext: "}", macros: [macros.TAKE_SUB]},
        {text: "\\", subtext: "|", macros: [macros.TAKE_SUB]},
        {text: "pg up"}
    ], [
        {text: "caps lock", callback: (e) => {
            alts.CLOCK.pressed = !alts.CLOCK.pressed;
            highlight(alts.CLOCK.pressed, e);
        }},
        {text: "A", macros: [macros.TAKE_CAP]},
        {text: "S", macros: [macros.TAKE_CAP]},
        {text: "D", macros: [macros.TAKE_CAP]},
        {text: "F", macros: [macros.TAKE_CAP]},
        {text: "G", macros: [macros.TAKE_CAP]},
        {text: "H", macros: [macros.TAKE_CAP]},
        {text: "J", macros: [macros.TAKE_CAP]},
        {text: "K", macros: [macros.TAKE_CAP]},
        {text: "L", macros: [macros.TAKE_CAP]},
        {text: ";", subtext: ":", macros: [macros.TAKE_SUB]},
        {text: "'", subtext: "\"", macros: [macros.TAKE_SUB]},
        {text: "ENTER", callback: (e) => {
            outputText = "";
            cursorPos = 0;
            updateCursorPos();
        }},
        {text: "pg dn"}
    ], [
        {text: "SHIFT"},
        {text: "Z", macros: [macros.TAKE_CAP]},
        {text: "X", macros: [macros.TAKE_CAP]},
        {text: "C", macros: [macros.TAKE_CAP]},
        {text: "V", macros: [macros.TAKE_CAP]},
        {text: "B", macros: [macros.TAKE_CAP]},
        {text: "N", macros: [macros.TAKE_CAP]},
        {text: "M", macros: [macros.TAKE_CAP]},
        {text: ",", subtext: "<", macros: [macros.TAKE_SUB]},
        {text: ".", subtext: ">", macros: [macros.TAKE_SUB]},
        {text: "/", subtext: "?", macros: [macros.TAKE_SUB]},
        {text: "SHIFT", subtext: "pause"},
        {text: "UP"},
        {text: "end"}
    ], [
        {text: "ctrl"},
        {text: "fn"},
        {text: "WIN"},
        {text: "alt"},
        {text: "SPACE", print: [{text: " "}]},
        {text: "alt"},
        {text: "ctrl"},
        {text: "LEFT", callback: (e) => {
            if (Math.abs(cursorPos) < outputText.length) {
                cursorPos--;
                refreshCursorPos();
            }
        }},
        {text: "DOWN"},
        {text: "RIGHT", callback: (e) => {
            if (cursorPos < 0) {
                cursorPos++;
                refreshCursorPos();
            }
        }}
    ]
];

// Highlights a element based on a boolean flag.
// Params:
// toggle - boolean flag, true = highlight
// element - reference to the target DOM element
function highlight(toggle, element) {
    if (toggle) {
        console.log("set");
        element.style = "background-color: #222277;";
    } else {
        console.log("return");
        element.style = `background-color: ${keyColor};`;
    }
}

// Refreshes the output text, adding the cursor
// based on its position
function refreshCursorPos() {
    let element = document.getElementById(outputID);
    if (cursorPos < 0) {
        element.innerHTML = outputText.slice(0, cursorPos) + cursorDisp + outputText.slice(cursorPos);        
    } else {
        element.innerHTML = outputText + cursorDisp;
    }
}

// Called when a key is released
// Params:
// element - The DOM element
// y - The row
// x - The column
function keyPress(element, y, x) {
    const cell = keyMap[y][x];
    if (cell.callback != undefined) {
        cell.callback(element);
    }
    if (cell.print != undefined) {
        for (let i = 0; i < cell.print.length; i++) {
            const prt = cell.print[i];
            let pass = true;
            if (prt.mods != undefined) {
                // Test conditions, will always just test if
                // a key is active.
                for (let c = 0; c < prt.mods.length && pass; c++) {
                    pass = prt.mods[c].pressed;
                }
            }
            if (pass) {
                let element = document.getElementById(outputID);
                if (cursorPos < 0) {
                    outputText = outputText.slice(0, cursorPos) + prt.text + outputText.slice(cursorPos);
                } else {
                    outputText += prt.text;
                }
                refreshCursorPos();
                break;
            }
        }
    }
}

// Called when a key is pressed
// Params:
// element - The DOM element
// y - The row
// x - The column
function keyDown(element, y, x) {
    // Placeholder
}

// Expands the macros present in the given cell
// (key at keyMap[y][x]).
// Does NOT remove the macros.
// Params:
// cell - The cell
function expandMacros(cell) {
    for (let i = 0; i < cell.macros.length; i++) {
        switch (cell.macros[i]) {
            case macros.TAKE_SUB:
                cell.print = [{text: `${cell.subtext}`, mods: [alts.CLOCK]}, {text: `${cell.text}`}];
                break;
            case macros.TAKE_CAP:
                cell.print = [{text: `${cell.text}`, mods: [alts.CLOCK]}, {text: `${String.fromCharCode(cell.text.charCodeAt(0) | 0x20)}`}];
                break;
            default:
                assert(false);
                break;
        }
    }
}

// Loads the given map configuration and returns
// the generated HTML.
// Params:
// map - The map configuration (see keyMap)
// Return:
// HTML generated for the map
function loadMap(map) {
    let result = "";
    // Constants to make refactoring easier.
    // Is this normal? I'm used to doing this kind
    // of stuff in compiled langs (C++, etc), but
    // I don't know really the convention for
    // interpreted ones...
    const rowClass = "keyboardRow";
    const rowIdPrefix = "keyboardRowId";
    const keyIdPrefix = "keyId";
    const keyPressFunc = "keyPress";
    const keyDownFunc = "keyDown";
    const subtextClass = "keySubtext";
    for (let y = 0; y < map.length; y++) {
        // Table row
        result += `<tr class="${rowClass}" id="${rowIdPrefix + y}">`;
        for (let x = 0; x < map[y].length; x++) {
            const cell = map[y][x];
            // Expand macros
            if (cell.macros != undefined) {
                expandMacros(cell);
                cell.macros = undefined;
            }
            // Determine inner HTML
            let inner = "";
            if (cell.subtext != undefined) {
                // This is the smaller "second" option on your keyboard
                inner += `<span class="${subtextClass}">${cell.subtext}</span>`;
            }
            if (cell.text != undefined) {
                inner += cell.text;
            }
            result +=`<td class="${keyClass}" id="${keyIdPrefix+y+"_"+x}" onmousedown="${keyDownFunc}(this, ${y}, ${x})" onmouseup="${keyPressFunc}(this, ${y}, ${x})">${inner}</td>`;
        }
        result += "</tr>";
    }
    return result;
}

// Called when the background color <select> element
// is changed.
// Changes the background color.
// Params:
// element - The <select> element
function changeColor(element) {
    const value = element.options[element.selectedIndex].value;
    bgColor = `background-color: ${value};`;
    document.getElementById("content").style = bgColor;
}

// Called when the key background color <select> element
// is changed.
// Changes the key background color.
// Params:
// element - The <select> element
function changeKeyColor(element) {
    const value = element.options[element.selectedIndex].value;
    let keys = document.getElementsByClassName(keyClass);
    keyColor = `background-color: ${value};`;
    for (let i = 0; i < keys.length; i++) {
        keys[i].style = keyColor;
    }
}

// Initializer function for the program.
// Called once on startup.
function start() {
    let content = loadMap(keyMap);
    let element = document.getElementById("content");
    element.innerHTML = `
    <table id="keyboard">
        <thead>
            <tr>
                <th>A keyboard</th>
            </tr>
            <tr>
                <th id="${outputID}"></th>
            </tr>
        </thead>
        <tbody class="noselect">
            ${content}
        </tbody>
    </table>
    `;
}

start();
