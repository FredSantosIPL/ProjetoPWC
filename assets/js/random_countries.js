document.addEventListener('DOMContentLoaded', () => {
    const randomGrid = document.getElementById('random-grid');

    fetch('https://restcountries.com/v3.1/all')
        .then(response => response.json())
        .then(countries => {
            const randomCountries = getRandomCountries(countries, 3);
            randomCountries.forEach(country => {
                const card = document.createElement('div');
                card.className = 'col-md-4 d-flex align-items-stretch';
                card.innerHTML = `
                    <div class="card shadow-sm h-100" style="width: 18rem;">
                        <img src="${country.flags.svg}" class="card-img-top" alt="${country.name.common}" style="height: 200px; object-fit: cover;">
                        <div class="card-body">
                            <h5 class="card-title">${country.name.common}</h5>
                            <p><strong>Região:</strong> ${country.region}</p>
                            <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : 'N/A'}</p>
                        </div>
                    </div>
                `;
                randomGrid.appendChild(card);
            });
        })
        .catch(error => console.error('Error fetching countries:', error));
});

function getRandomCountries(countries, count) {
    const shuffled = countries.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}
