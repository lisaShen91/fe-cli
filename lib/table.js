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
            tip.warn('当前支持的模板列表: ')
            console.log(`${list}\n`);
        } else {
            tip.fail('模板列表为空，请先新建模板!');
            tip.warn('cmd: fe-cli add');
        }
    } else {
        console.log(`${table.toString()}\n`);
        tip.fail('模板列表为空，请先新建模板!');
        tip.warn('cmd: fe-cli add');
    }
};