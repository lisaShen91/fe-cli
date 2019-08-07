const co = require('co');
const prompt = require('co-prompt');
const fs = require('fs');

const table = require('../table');
const tip = require('../tip');
const tpls = require('../../templates');

const cb = (err) => {
    if (err) {
        console.log(err);
        tip.fail('请重新运行!');
        process.exit();
    }
    tip.suc('模板删除成功!');

    if (JSON.stringify(tpls) !== '{}') {
        table(tpls);
    } else {
        tip.info('您当前没有模板了， 赶快使用fe-cli add 添加模板吧!');
    }
    process.exit();
};

const resolve = (tplName) => {
    // 删除对应的模板
    if (tpls[tplName]) {
        delete tpls[tplName];
    } else {
        tip.fail(`删除失败：模板 ${tplName} 不存在！`);
        process.exit();
    }

    // 写入template.json
    fs.writeFile(__dirname + '/../../templates.json', JSON.stringify(tpls), 'utf-8', cb);
};

module.exports = () => {
    co(function*() {
        // 分步接收用户输入的参数
        const tplName = yield prompt('请输入要删除的模板名: ');
        return new Promise((resolve, reject) => {
            resolve(tplName);
        });
    }).then(resolve);
};