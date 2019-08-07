const table = require('../table');
const tpls = require('../../templates')
module.exports = () => {
    table(tpls);
    process.exit();
};