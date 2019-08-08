const co = require('co');
const prompt = require('co-prompt');
const fs = require('fs');

const table = require('../table');
const tip = require('../tip');
const tpls = require('../../templates');

const cb = (err) => {
    if (err) {
        console.log(err);
        tip.fail('Please restart!');
        process.exit();
    }
    tip.suc('Template deleted successfully!');

    if (JSON.stringify(tpls) !== '{}') {
        table(tpls);
    } else {
        tip.info(`You don't have any templates at the moment, so add them with fe - cli add.`);
    }
    process.exit();
};

const resolve = (tplName) => {
    // 删除对应的模板
    if (tpls[tplName]) {
        delete tpls[tplName];
    } else {
        tip.fail(`Deletion failed: template ${tplName} does not exist！`);
        process.exit();
    }

    // 写入template.json
    fs.writeFile(__dirname + '/../../templates.json', JSON.stringify(tpls), 'utf-8', cb);
};

module.exports = () => {
    co(function*() {
        // 分步接收用户输入的参数
        const tplName = yield prompt('Enter the name of the template to be deleted: ');
        return new Promise((resolve, reject) => {
            resolve(tplName);
        });
    }).then(resolve);
};