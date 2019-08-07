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
        tip.fail('请重新运行!');
        process.exit();
    }

    table(tpls);
    tip.suc('新模板添加成功!');
    process.exit();
};

const resolve = result => {
    let err = ['添加模板失败：'];
    const { tplName, gitUrl, branch, description } = result;
    isEmpty(tplName) && err.push('template name can not be empty.');
    isEmpty(gitUrl) && err.push('git url can not be empty.');
    isEmpty(branch) && err.push('branch can not be empty.');
    isEmpty(description) && err.push('template description can not be empty.');

    if (err.length > 1) {
        tip.fail(err.join('\n'));
        process.exit();
    }
    // 避免重复添加
    if (tpls[tplName]) {
        tip.fail('模板已经存在!');
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
        isEmpty(tplName)
        const gitUrl = yield prompt('git https link: ');
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