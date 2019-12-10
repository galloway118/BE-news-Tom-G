const connection = require('../db/client');

const fetchTopics = () => {
return connection('topic')
.select('*')
.then(topics => {
    return {topics: topics};
});
}

module.exports = {fetchTopics};