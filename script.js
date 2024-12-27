const searchInput = document.querySelector("#search-input");
const searchBtn = document.querySelector("#search-button");
const divPokemonInfo = document.querySelector("#pokemon-info");

let pokemonArr = [];

// Fetch data from the Pokémon API
fetch('https://pokeapi-proxy.freecodecamp.rocks/api/pokemon?limit=151') // Limit to first 151 Pokémon
    .then(response => response.json())
    .then(data => {
        pokemonArr = data.results; // Store Pokémon data in pokemonArr
    })
    .catch(error => console.error('Error fetching Pokemon data:', error));

// Function to fetch Pokémon details by URL
async function pokemonFound(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching Pokémon details:', error);
        return null;
    }
}

// Function to update Pokémon details in the DOM
function updatePokemonInfo(pokemonDetails) {
    // Update name and sprite
    document.querySelector("#pokemon-name").textContent = pokemonDetails.name.toUpperCase();
    document.querySelector("#sprite").src = pokemonDetails.sprites.front_default;

    // Update ID, weight, and height
    document.querySelector("#pokemon-id").textContent = `#${pokemonDetails.id}`;
    document.querySelector("#weight").textContent = `Weight: ${pokemonDetails.weight}`;
    document.querySelector("#height").textContent = `Height: ${pokemonDetails.height}`;

    // Update types
    const typesContainer = document.querySelector("#types");
    typesContainer.innerHTML = ""; // Clear previous types

    pokemonDetails.types.forEach(typeInfo => {
        const typeElement = document.createElement("p");
        const typeName = typeInfo.type.name.toUpperCase();

        typeElement.textContent = typeName;
        typeElement.classList.add("pokemon-type", typeName.toLowerCase()); // Add type-specific class

        typesContainer.appendChild(typeElement);
    });

    // Update stats
    const statsMap = {
        hp: pokemonDetails.stats[0].base_stat,
        attack: pokemonDetails.stats[1].base_stat,
        defense: pokemonDetails.stats[2].base_stat,
        "special-attack": pokemonDetails.stats[3].base_stat,
        "special-defense": pokemonDetails.stats[4].base_stat,
        speed: pokemonDetails.stats[5].base_stat,
    };

    Object.entries(statsMap).forEach(([statName, value]) => {
        document.querySelector(`#${statName}`).textContent = value;
    });
}




// Function to search for Pokémon
async function pokemonSearch() {
    const valueInput = searchInput.value.toLowerCase();
    const foundPokemon = pokemonArr.find(pokemon => pokemon.name == valueInput || pokemon.id.toString() == valueInput);

    if (foundPokemon) {
        const pokemonDetails = await pokemonFound(foundPokemon.url);
        if (pokemonDetails) {
            // Show Pokémon details in console (or update your UI here)
            updatePokemonInfo(pokemonDetails);
        } else {
            alert('Error fetching Pokémon details.');
        }
    } else {
        alert('Pokémon not found');
    }
}

// Add click event to search button
searchBtn.addEventListener('click', () => {
    divPokemonInfo.style.display = 'flex'
    pokemonSearch(); // Call pokemonSearch when search button is clicked
});
