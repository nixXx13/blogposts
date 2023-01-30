const pokemonData = new Map([
    ['1',  [
        { id: '10', name: 'Pikachu' },
        { id: '20', name: 'Eevee' },
        { id: '31', name: 'Snorlax' },
    ]],
    ['2',  [
        { id: '12', name: 'Ditto' },
        { id: '23', name: 'Charizard' },
        { id: '25', name: 'squirtle' },
    ]],
    ['3',  [
        { id: '120', name: 'Psyduck' }, 
    ]],
]);

const trainersData = new Map([
    ['1',
        { id: '1', name: 'Ash ketchum' },
    ],
    ['2',
        { id: '2', name: 'Jojo' },
    ],
    ['3',
        { id: '3', name: 'Lilo' },
    ],
]);

class DbMock {

    static async getPokemonsForTrainer( trainerId ) {
        console.log(`Fetching pokemons for trainer ${trainerId}`);
        const result = pokemonData.get(trainerId) || [];
        return Promise.resolve(result);
    }

    static async getPokemonsForTrainers( trainerIds ) {
        console.log(`Fetching pokemons for trainers ${trainerIds}`);
        const result = {};
        trainerIds.forEach( trainerId => {
            const pokemons = pokemonData.get(trainerId) || [];
            result[trainerId] = pokemons;
        });
        return Promise.resolve(result);
    }

    static async getTrainers(ids) {
        const trainers = Array.from(trainersData.values()).filter( trainer => ids.includes(trainer.id));
        return Promise.resolve(trainers);
    }

}

module.exports = {
    DbMock
}