const countryInput = document.getElementById('country-input');
const searchBtn = document.getElementById('search-btn');
const loadingSpinner = document.getElementById('loading-spinner');
const countryInfo = document.getElementById('country-info');
const borderingCountries = document.getElementById('bordering-countries');
const errorMessage = document.getElementById('error-message');   

loadingSpinner.classList.add('hidden');
errorMessage.classList.add('hidden'); 


async function searchCountry(countryName) {
    
    countryInfo.innerHTML = '';
    borderingCountries.innerHTML = '';
    errorMessage.classList.add('hidden');
    
    
    loadingSpinner.classList.remove('hidden');
    
    try {
        
        const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
        
        if (!response.ok) {
            throw new Error('Country not found. Please try again.');
        }
        
        const data = await response.json();
        const country = data[0]; 
        
        
        countryInfo.innerHTML = `
            <h2>${country.name.common}</h2>
            <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : 'N/A'}</p>
            <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
            <p><strong>Region:</strong> ${country.region}</p>
            <img src="${country.flags.svg}" alt="${country.name.common} flag" width="100">
        `;
        
        
        if (country.borders && country.borders.length > 0) {
            
            const borderPromises = country.borders.map(async (borderCode) => {
                const borderResponse = await fetch(`https://restcountries.com/v3.1/alpha/${borderCode}`);
                const borderData = await borderResponse.json();
                return borderData[0];
            });
            
            const borderCountries = await Promise.all(borderPromises);
            
            
            borderingCountries.innerHTML = '<h3>Bordering Countries:</h3>';
            borderCountries.forEach(border => {
                borderingCountries.innerHTML += `
                    <div class="border-country">
                        <img src="${border.flags.svg}" alt="${border.name.common} flag" width="50">
                        <p>${border.name.common}</p>
                    </div>
                `;
            });
        } else {
            borderingCountries.innerHTML = '<p>No bordering countries</p>';
        }
        
    } catch (error) {
        // Show error message
        errorMessage.textContent = error.message;
        errorMessage.classList.remove('hidden');
    } finally {
        // Hide loading spinner
        loadingSpinner.classList.add('hidden');
    }
}     
searchBtn.addEventListener('click', () => {
    const country = countryInput.value.trim();
    if (country) {
        searchCountry(country);
    } else {
        errorMessage.textContent = 'Please enter a country name';
        errorMessage.classList.remove('hidden');
    }
});


countryInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        const country = countryInput.value.trim();
        if (country) {
            searchCountry(country);
        } else {
            errorMessage.textContent = 'Please enter a country name';
            errorMessage.classList.remove('hidden');
        }
    }
});    

