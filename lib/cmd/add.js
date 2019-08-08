'use strict'
const co = require('co');
const prompt = require('co-prompt');
const fs = require('fs');
const table = require('../table');
const tip = require('../tip');
const tpls = require('../../templates');

const cb = err => { // 处理错误
    if (err) {
        console.log(err);
        tip.fail('Please restart!');
        process.exit();
    }

    table(tpls);
    tip.suc('New template added successfully!');
    process.exit();
};

const resolve = result => {
    let err = ['Template added failed: '];
    const { tplName, gitUrl, branch, description } = result;
    isEmpty(tplName) && err.push('name can not be empty.');
    isEmpty(gitUrl) && err.push('git url can not be empty.');
    isEmpty(branch) && err.push('branch can not be empty.');
    isEmpty(description) && err.push('description can not be empty.');

    if (err.length > 1) {
        tip.fail(err.join('\n'));
        process.exit();
    }
    // 避免重复添加
    if (tpls[tplName]) {
        tip.fail('Templates already exist!');
        process.exit();
    }
    tpls[tplName] = {
        url: gitUrl.replace(/[\u0000-\u0019]/g, ''), // 过滤unicode字符
        branch,
        description
    };

    // 把模板信息写入templates.json
    fs.writeFile(__dirname + '/../../templates.json', JSON.stringify(tpls), 'utf-8', cb);
};
const isEmpty = val => String(val).trim() === '';

module.exports = () => {
    co(function*() {
        // 分步接收用户输入的参数
        const tplName = yield prompt('template name: ');
        const gitUrl = yield prompt('git url: ');
        const branch = yield prompt('git branch: ');
        const description = yield prompt('template description: ');
        return Promise.resolve({
            tplName,
            gitUrl,
            branch,
            description,
        });
    }).then(resolve);
};