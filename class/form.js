import { sendRequestForm, getCookie, warning } from '/elearning/utils/functions.js';
import { addCell } from '/elearning/class/class.js';

let class_id = document.getElementById('class-id').value;
let form = document.getElementById("create-cell-form");
let form_container = document.getElementById("create-cell-form-container");

//Open button
let open_form_btn = document.getElementById("open-form-button");
open_form_btn.addEventListener("click", () => {
    form_container.style.display = 'block';
});
//Hide open_form_btn from STUDENT
let login_type = getCookie("type");
if (login_type === "STUDENT") {
    open_form_btn.style.display = 'none';
}

//Close button
let close_form_btn = document.getElementById("close-form-button");
close_form_btn.addEventListener("click", () => {
    form_container.style.display = 'none';
});

//Reset button
let reset_btn = document.getElementById("reset-form-button");
reset_btn.addEventListener("click", () => {
    //Default reset
    form.reset();

    //Hide all options
    let options = form.querySelectorAll(".cell-type-option");
    for (let option of options) {
        option.style.display = 'none';
    }

    //Reset characters count
    let count_fields = form.querySelectorAll("[maxlength]");
    let event = new Event('input');
    for (let field of count_fields) {
        field.dispatchEvent(event);
    }
})

let cell_type_selection = document.getElementById("cell-type");
let option_length = document.getElementById("option-container").childElementCount;

//Get all required fields of all options
let required_fields = [];
for (let i = 0; i < option_length; i++) {
    let node = document.getElementById(`cell-type-option-${i}`);
    required_fields[i] = node.querySelectorAll("[required]");
}

//Selection
cell_type_selection.addEventListener("change", () => {
    let option_no = parseInt(cell_type_selection.value);
    form_container.querySelector("[type=hidden][name=option-no]").value = option_no;

    for (let i = 0; i < option_length; i++) {
        let node = document.getElementById(`cell-type-option-${i}`);
        if (i == option_no) {
            node.style.display = 'block';

            //enable required inputs of chosen option
            let fields = required_fields[i];
            fields.forEach(field => field.required = true);
        } else {
            node.style.display = 'none';

            //clear input and disable required inputs of other options
            let inputs = node.querySelectorAll("input");
            inputs.forEach(input => input.value = "");

            let fields = required_fields[i];
            fields.forEach(field => field.required = false);
        }
    }
});

//Create form
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    await createCellCallBack(form);
});

async function createCellCallBack(form) {
    console.log(form.getElementsByTagName("textarea")[0].value);
    let response = await sendRequestForm(form, { 'do': 'create_cell', 'class-id': class_id });
    let data = JSON.parse(response);
    let result = await addCell(data['cell_id']);
    if (result) {
        // alert("Create cell successfully!");

        warning('Create cell successfully!');
    }
}

//Character count
let count_fields = form.querySelectorAll("[maxlength]");
for (let field of count_fields) {   
    field.addEventListener("input", (e) => {
        const target = e.currentTarget;
        const max_length = target.getAttribute("maxlength");
        const curr_length = target.value.length;

        let char_count = document.getElementById(`char-count-${field.id}`);
        char_count.querySelector(".char-curr").innerText = curr_length;

        if (curr_length == max_length) {
            char_count.style.fontWeight = 'bold';
        } else {
            char_count.style.fontWeight = 'normal';
        }
    });
}