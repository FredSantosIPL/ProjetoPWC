const apiUrl = 'https://restcountries.com/v3.1/all';
const countriesPerPage = 9;
let allCountries = [];
let filteredCountries = [];
let currentPage = 1;

async function fetchCountries() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        allCountries = data;
        filteredCountries = allCountries;
        renderCountries();
        renderPagination();
    } catch (error) {
        console.error('Error fetching countries:', error);
    }
}

function renderCountries() {
    const grid = document.getElementById('countries-grid');
    grid.innerHTML = '';
    const start = (currentPage - 1) * countriesPerPage;
    const end = start + countriesPerPage;
    const countriesToShow = filteredCountries.slice(start, end);

    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    countriesToShow.forEach((country) => {
        const isFavorite = favorites.includes(country.cca3);
        const card = document.createElement('div');
        card.className = 'col-md-4 d-flex align-items-stretch';
        card.innerHTML = `
            <div class="card shadow-sm h-100" style="width: 18rem;">
                <img src="${country.flags.svg}" class="card-img-top" alt="${country.name.common}" style="height: 200px; object-fit: cover;">
                <div class="card-body">
                    <h5 class="card-title">${country.name.common}</h5>
                    <button class="btn btn-primary mt-2" onclick="showMoreInfo('${country.cca3}')">Mais Informação</button>
                    <div id="info-${country.cca3}" class="mt-3" style="display: none;">
                        <table class="table table-bordered">
                            <tr><th>Nome Oficial</th><td>${country.name.official}</td></tr>
                            <tr><th>População</th><td>${country.population.toLocaleString()}</td></tr>
                            <tr><th>Área</th><td>${country.area.toLocaleString()} km²</td></tr>
                            <tr><th>Sub-Região</th><td>${country.subregion}</td></tr>
                            <tr><th>Moeda</th><td>${country.currencies ? Object.values(country.currencies)[0].name : 'N/A'}</td></tr>
                            <tr><th>Fuso Horário</th><td>${country.timezones[0]}</td></tr>
                            <tr><th>Capital</th><td>${country.capital ? country.capital[0] : 'N/A'}</td></tr>
                            <tr><th>Continente</th><td>${country.continents}</td></tr>
                        </table>
                    </div>
                    <button class="btn ${isFavorite ? 'btn-danger' : 'btn-light'} mt-2" onclick="toggleFavorite('${country.cca3}', this)">
                        <i class="bi ${isFavorite ? 'bi-heart-fill' : 'bi-heart'}"></i>
                    </button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

function renderPagination() {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';
    const totalPages = Math.ceil(filteredCountries.length / countriesPerPage);

    for (let i = 1; i <= totalPages; i++) {
        const pageItem = document.createElement('li');
        pageItem.className = 'page-item' + (i === currentPage ? ' active' : '');
        pageItem.innerHTML = `
            <button class="page-link">${i}</button>
        `;
        pageItem.addEventListener('click', () => {
            currentPage = i;
            renderCountries();
            renderPagination();
        });
        pagination.appendChild(pageItem);
    }
}

document.getElementById('search-input').addEventListener('input', (event) => {
    const query = event.target.value.toLowerCase();
    filteredCountries = allCountries.filter((country) =>
        country.name.common.toLowerCase().includes(query)
    );
    currentPage = 1;
    renderCountries();
    renderPagination();
});

function showMoreInfo(countryId) {
    const infoDiv = document.getElementById(`info-${countryId}`);
    if (infoDiv.style.display === 'none') {
        infoDiv.style.display = 'block';
    } else {
        infoDiv.style.display = 'none';
    }
}

function toggleFavorite(countryId, button) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    if (favorites.includes(countryId)) {
        favorites = favorites.filter(id => id !== countryId);
        button.classList.remove('btn-danger');
        button.classList.add('btn-light');
        button.innerHTML = '<i class="bi bi-heart"></i>';
    } else {
        favorites.push(countryId);
        button.classList.remove('btn-light');
        button.classList.add('btn-danger');
        button.innerHTML = '<i class="bi bi-heart-fill"></i>';
    }

    localStorage.setItem('favorites', JSON.stringify(favorites));
}

fetchCountries();

