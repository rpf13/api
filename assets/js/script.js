const API_KEY = 'aIRtdxGZ0VSCi8O66CGJI-q6Cds';
const API_URL = 'https://ci-jshint.herokuapp.com/api';
const resultsModal = new bootstrap.Modal(document.getElementById('resultsModal'));

// The code below is for the GET request

document.getElementById('status').addEventListener('click', e => getStatus(e));

async function getStatus(e) {
    const queryString = `${API_URL}?api_key=${API_KEY}`;
    const response = await fetch(queryString);
    const data = await (await response).json();
    if (response.ok) {
        displayStatus(data);
    } else {
        throw new Error(data.error);
    }
};

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

function processOptions(form) {

    let optArray = [];
    for (let entry of form.entries()) {
        if (entry[0] === 'options') {
            optArray.push(entry[1]);
        }
    }
    form.delete('options');
    form.append('options', optArray.join());
    return form;
}

async function postForm(e) {
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
        body: form,
    });
    const data = await response.json();
    if (response.ok) {
        displayErrors(data);
    } else {
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