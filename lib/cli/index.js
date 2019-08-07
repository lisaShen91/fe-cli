const program = require('commander');
const packageInfo = require('../../package.json');

program
    .version(packageInfo.version);

program
    .command('init') // fe-cli init
    .description('create a new Project') //创建新项目
    .alias('i') // 命令简写
    .action(() => {
        require('../cmd/init')();
    });
program
    .command('add') //fe-cli add 
    .description('add template') //contains(name, branch, url)
    .alias('a')
    .action(() => {
        require('../cmd/add')();
    });
program
    .command('list') // fe-cli list
    .description('list all the templates') //查看模板列表
    .alias('l') // 简写
    .action(() => {
        require('../cmd/list')();
    });
program
    .command('delete') // fe-cli delete
    .description('delete template') //删除模板
    .alias('d') // 简写
    .action(() => {
        require('../cmd/delete')();
    });

//如果没有参数，运行帮助方法
program.parse(process.argv);
if (!program.args.length) {
    program.help()
}