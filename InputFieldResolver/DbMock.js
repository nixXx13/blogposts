const users = [
    { id: '1', name: 'Ash ketchum', address: '5th av', role: 'ADMIN' },
    { id: '2', name: 'Brock', address: '6th av', role: 'EMPLOYEE' },
];

let sensitiveData = '';

class DbMock {

    static async getUsersData( ids ) {
        const _users = users.filter( user => ids.includes(user.id) );
        return Promise.resolve(_users);
    }

    static async updateUser(id, user) {
        const currentUserIndex = users.findIndex( user => user.id === id );
        if ( currentUserIndex === -1 ) console.error(`User with id ${id} wasnt found`);
        const currentUser = users[currentUserIndex];
        const updatedUser = { ...currentUser, ...user };
        users[currentUserIndex] = updatedUser;
        return Promise.resolve(updatedUser);
    }
    
    static async getSensitiveData() { 
        return sensitiveData;
    }

    static async setSensitiveData(data) { 
        sensitiveData = data;
        return data;
    }
}

module.exports = {
    DbMock
}