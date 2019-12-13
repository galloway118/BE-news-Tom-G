const connection = require('../db/client');

const fetchUserbyUsername = (username = '') => {

    return connection('users')
    .select('*')
    .where('username', '=', username)
    .then(user => {
        if(!user.length){
            return Promise.reject({
                status:404,
                msg: 'user not found'
            })
        } else {
        return {user: user[0]};
        }
    });
}

module.exports = {fetchUserbyUsername};