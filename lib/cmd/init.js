// 操作命令行
const exec = require('child_process').exec;
const co = require('co');
const ora = require('ora');
const prompt = require('co-prompt');
const tip = require('../tip');
const tpls = require('../../templates');
const table = require('../table')

const spinner = ora('正在生成...');

const resolve = (result) => {
    const { url, branch, projectName } = result;
    // git命令，远程拉取项目并自定义项目名
    const cmdStr = `git clone ${url} ${projectName} && cd ${projectName} && git checkout ${branch}`;

    spinner.start();

    exec(cmdStr, err => {
        clearOldGit(err, projectName);
    });
};

const clearOldGit = (err, projectName) => {
    if (err) {
        console.log(err);
        tip.fail('请重新运行!');
        spinner.stop();
        process.exit();
    }
    // 删除 git 文件
    exec('cd ' + projectName + ' && rm -rf .git', error => {
        execRm(error, projectName);
    });
}

const execRm = (err, projectName) => {
    spinner.stop();

    if (err) {
        console.log(err);
        tip.fail('请重新运行!');
        process.exit();
    }

    tip.suc('初始化完成！');
    tip.info(`cd ${projectName} && npm install`);
    process.exit();
};

module.exports = () => {
    co(function*() {
        // 处理用户输入
        table(tpls);
        if (Object.keys(tpls).length === 0) process.exit();
        const tplName = yield prompt('template name: ');
        if (!tpls[tplName]) {
            tip.fail('模板不存在!');
            process.exit();
        }
        const projectName = yield prompt('project name: ');
        return Promise.resolve({
            projectName,
            ...tpls[tplName],
        });
    }).then(resolve);
}