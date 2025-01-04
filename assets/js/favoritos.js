document.addEventListener('DOMContentLoaded', () => {
    const favoritesGrid = document.getElementById('favorites-grid');
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    const clearButton = document.createElement('button');
    clearButton.className = 'btn btn-sm btn-danger mb-3';
    clearButton.textContent = 'Eliminar Todos Favoritos';
    clearButton.onclick = clearFavorites;
    favoritesGrid.parentElement.insertBefore(clearButton, favoritesGrid);

    if (favorites.length === 0) {
        favoritesGrid.innerHTML = '<p class="text-center">Não há países favoritos.</p>';
        return;
    }

    fetch('https://restcountries.com/v3.1/all')
        .then(response => response.json())
        .then(countries => {
            const favoriteCountries = countries.filter(country => favorites.includes(country.cca3));
            favoriteCountries.forEach(country => {
                const card = document.createElement('div');
                card.className = 'col-md-4 d-flex align-items-stretch';
                card.innerHTML = `
                    <div class="card shadow-sm h-100" style="width: 18rem;">
                        <div class="card shadow-sm">
                            <img src="${country.flags.svg}" class="card-img-top" alt="${country.name.common}" style="height: 200px; object-fit: cover;">
                            <div class="card-body">
                                <h5 class="card-title">${country.name.common}</h5>
                                <p><strong>Região:</strong> ${country.region}</p>
                                <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : 'N/A'}</p>
                                <button class="btn btn-outline-danger mt-2" onclick="removeFavorite('${country.cca3}', this)">
                                    <i class="bi bi-heart-fill"></i> Remover
                                </button>
                            </div>
                        </div>
                    </div>
                `;
                favoritesGrid.appendChild(card);
            });
        })
        .catch(error => console.error('Error fetching countries:', error));
});

function clearFavorites() {
    localStorage.removeItem('favorites');
    location.reload();
}

function removeFavorite(countryId, button) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites = favorites.filter(id => id !== countryId);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    button.closest('.col-md-4').remove();

    if (favorites.length === 0) {
        document.getElementById('favorites-grid').innerHTML = '<p class="text-center">Não há países favoritos.</p>';
    }
}