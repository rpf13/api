const API_KEY = 'aIRtdxGZ0VSCi8O66CGJI-q6Cds';
const API_URL = 'https://ci-jshint.herokuapp.com/api';
const resultsModal = new bootstrap.Modal(document.getElementById('resultsModal'));

// The code below is for the GET request

document.getElementById('status').addEventListener('click', e => getStatus(e));

async function getStatus(e) {
    const queryString = `${API_URL}?api_key=${API_KEY}`;
    const response = await fetch(queryString);
    const data = await (response).json();
    if (response.ok) {
        displayStatus(data);
    } else {
        displayException(data);
        // We need to run the display exception function before a error gets thrown
        // because a throw will stop JS from executing any other data
        throw new Error(data.error);
    }
};

// The status function will take the api data as input and display it via the 
// (bootstrap) modal.
function displayStatus(data) {
    let heading = "API Key Status";
    let results = `<div>Your key is valid until</div>`;
    results += `<div class="key-status">${data.expiry}</div>`;

    document.getElementById('resultsModalTitle').innerText = heading;
    document.getElementById('results-content').innerHTML = results;

    resultsModal.show();

}

// The code below is for the POST request

document.getElementById('submit').addEventListener('click', e => postForm(e));

// the process options function will push the options into a temp array
// and then stitches the array together.
function processOptions(form) {

    let optArray = [];
    for (let entry of form.entries()) {
        // if the first entry is options, which it is since we return "options, value" for each
        // of the options lines, we will use the second entry (the value) and add it to the optArray
        if (entry[0] === 'options') {
            optArray.push(entry[1]);
        }
    }
    // The next line will delete all occurences of options in the form data
    form.delete('options');
    // Next line will create our new options into the form data
    form.append('options', optArray.join());
    return form;
}

async function postForm(e) {
    // first we need to get the form data of the input, which can be done via the
    // form data object via JS.
    const form = processOptions(new FormData(document.getElementById('checksform')));

    // loop to test the outputs, send them to the console:
    // for (let entry of form.entries()) {
    //     console.log(entry);
    // }

    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Authorization": API_KEY,
        },
        // The form argument will send the form data to the api.
        body: form,
    });

    // The respnse will be converted into json.
    const data = await response.json();
    if (response.ok) {
        displayErrors(data);
    } else {
        // We need to run the display exception function before a error gets thrown
        // because a throw will stop JS from executing any other data
        displayException(data);
        throw new Error(data.error);
    }
}

function displayErrors(data) {
    let heading = `JSHint Results for ${data.file}`;

    if (data.total_errors === 0) {
        results = `<div class="no_errors>No errors reported!</div>`
    } else {
        results = `<div>Total Errors: <span class="error_count>${data.total_errors}</span></div>`
        for (let error of data.error_list) {
            results += `<div>At line <span class="line">${error.line}</span>, `;
            results += `column <span class="column>${error.col}</span></div>`;
            results += `<div class="error">${error.error}</div>`;
        }
    }
    document.getElementById('resultsModalTitle').innerText = heading;
    document.getElementById('results-content').innerHTML = results;
    resultsModal.show();
}

// Function is used to disply the errors to the modal, all three errors available in the
// API: status code, error no & error text
function displayException(data) {
    let heading = `An Exception Occured`;

    results = `<div>The API returned status code ${data.status_code}</div>`;
    results += `<div>Error number: <strong>${data.error_no}</strong></div>`;
    results += `<div>Error text: <strong>${data.error}</strong></div>`;

    document.getElementById('resultsModalTitle').innerText = heading;
    document.getElementById('results-content').innerHTML = results;

    resultsModal.show();
}