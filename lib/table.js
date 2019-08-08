const Table = require('cli-table');
const tip = require('./tip');

const table = new Table({
    head: ['template name', 'description', 'url', 'branch'],
    style: {
        head: ['cyan']
    }
});

module.exports = (tpls) => {
    const keys = Object.keys(tpls);
    if (keys.length) {
        keys.forEach((key) => {
            let tpl = tpls[key];
            table.push(
                [`${key}`, tpl.description, tpl.url, tpl.branch]
            );
        });
        const list = table.toString();
        if (list) {
            tip.warn('List of current items: ')
            console.log(`${list}\n`);
        } else {
            tip.fail('The template list is empty. Please create a new template first!');
            tip.warn('cmd: fe-cli add');
        }
    } else {
        console.log(`${table.toString()}\n`);
        tip.fail('The template list is empty. Please create a new template first!');
        tip.warn('cmd: fe-cli add');
    }
};