const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')

const maxRecords = 151 //Primeira geracao de pokemons
const limit = 15
let offset = 0;

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}" id='${pokemon.name}' onclick="openCard(id)">
            <span class="pokemon__number">#${pokemon.number}</span>
            <span class="pokemon__name">${pokemon.name}</span>

            <div class="pokemon__detail">
                <ol class="pokemon__types">
                    ${pokemon.types.map((type) => `<li class="pokemon__type ${type}">${type}</li>`).join('')}
                </ol>

                <img class="pokemon__img" src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `
}

// Load more pokemons
function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml
    })
}

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})

const searchBar = document.getElementById('search-bar')
const msgError = document.createElement('p')
msgError.classList = 'searchBarErrorMessage'
msgError.innerHTML = 'Pokemon not found!'

function searchPokemon(){
    pokemonName = document.getElementById('pokemonSearch').value;
    openCard(pokemonName)
    document.getElementById('pokemonSearch').value = '';
}

//Open Card
function openCard (pokemonName) {

    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
        .then((response) => response.json())
        .then((data) => {
            const card = pokemonToCard(data)
            pokemonList.innerHTML += card
            if (document.body.contains(msgError)) {
                msgError.innerHTML = ''
            }
        }).catch((err) => {
            msgError.innerHTML = 'Pokemon not found!'
            searchBar.append(msgError)
        })
        ;

}

// Função para fechar o card
function closeCard(pokemonCard, pokemonBgOpacity) {
    pokemonCard.remove();
    pokemonBgOpacity.remove();
}

// Função para adicionar o card de Pokémon ao HTML
function pokemonToCard(pokemon) {
    const types = pokemon.types.map(typeSlot => typeSlot.type.name);
    const abilities = pokemon.abilities.map(abilitySlot => abilitySlot.ability.name);

    return `
        <div class="bgOpacityHigh" id="${pokemon.name}CardOpacity" onclick="closeCard(${pokemon.name}Card, ${pokemon.name}CardOpacity)"></div>
        
        <div id="${pokemon.name}Card" class="pokemon card ${types[0]}">
            <span class="pokemon__number">#${pokemon.id}</span>
            <span class="pokemon__name">${pokemon.name}</span>
            <img class="pokemon__img" src="${pokemon.sprites.other.dream_world.front_default}" alt="${pokemon.name}">
            
            <div class="pokemon__detail">
                <ol class="pokemon__types">
                    ${types.map(type => `<li class="pokemon__type ${type}">${type}</li>`).join('')}
                </ol>
            </div>
            
            <div class="pokemon__ability">
                <p>Abilities</p>
                <ol class="pokemon__abilities">
                    ${abilities.map(ability => `<li class="pokemon__ability ${ability}">${ability}</li>`).join('')}
                </ol>
                
                <div class="flex">
                    <ol class="pokemon__abilities">
                        <p>Weight</p>
                        <li>${pokemon.weight}</li>
                    </ol>
                    <ol class="pokemon__abilities">
                        <p>Height</p>
                        <li>${pokemon.height}</li>
                    </ol>
                </div>
                
                <hr>

                <div class="pokemon__stats">
                    ${pokemon.stats.map((stat, index) => `
                        <ol class="pokemon__abilities">
                            <p>${['HP', 'Attack', 'Defense', 'Sp. Atk', 'Sp. Def', 'Speed'][index]}</p>
                            <div class="progress">
                                <div style="width: ${stat.base_stat - 20}%;" class="progress-bar ${types[0]}">
                                    <p>${stat.base_stat}</p>
                                </div>
                            </div>
                        </ol>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}


