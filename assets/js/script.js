const API_KEY = 'aIRtdxGZ0VSCi8O66CGJI-q6Cds';
const API_URL = 'https://ci-jshint.herokuapp.com/api';
const resultsModal = new bootstrap.Modal(document.getElementById('resultsModal'));

document.getElementById('status').addEventListener('click', e => getStatus(e));

async function getStatus(e) {
    const queryString = `${API_URL}?api_key=${API_KEY}`;
    const response = await fetch(queryString);
    const data = await (await response).json();
    if (response.ok) {
        console.log(data.expiry);
    }
}