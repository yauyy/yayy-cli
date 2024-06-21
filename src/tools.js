import path from 'node:path';
import figlet from 'figlet';
import pico from 'picocolors';
import cac from 'cac';
import iq from 'inquirer';
import fs from 'fs-extra';
import ora from 'ora';
import axios from 'axios';
import AdmZip from 'adm-zip';
import { PROJECT_TEMPLATES } from './constants.js';

const version = fs.readJsonSync(
  new URL('../package.json', import.meta.url)
).version;

export const printHeader = () => {
  const text = figlet.textSync('hi~ Ya cli.', {
    horizontalLayout: 'full',
  });

  console.log(pico.green(text));
};

export const helpCmd = (cb) => {
  return new Promise((resolve) => {
    const cli = cac('ya');
    cli.command('create [projectName]', '创建项目名称').action(resolve);
    cli.command('').action(() => {
      cli.outputHelp();
    });
    cli.help((args) => {
      if (args.length > 3) {
        printHeader();
      }
    });
    cli.version(version);
    cli.parse();
  });
};

export const inqurieProject = async (projectName) => {
  const res = await iq.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: '请输入项目名称',
      when: !projectName,
    },
    {
      type: 'list',
      name: 'template',
      message: '请选择项目模板',
      choices: [
        {
          name: 'vue3+ts+eslint9+prettier+husky+lint-staged+commitlint+stylelint',
          value: 'vue3+ts',
        },
        {
          name: 'vue3',
          value: 'vue3',
        },
      ],
    },
  ]);
  return {
    ...res,
    projectName: projectName || res.projectName,
  };
};

export const verifyDirectory = (projectName) => {
  const cwd = process.cwd();
  const targetDir = path.resolve(cwd, projectName || '.');
  if (fs.existsSync(targetDir)) {
    console.log(pico.red(`项目${projectName}已存在，请重新输入项目名称`));
    process.exit(1);
  }
};

export const downloadTemplate = async (anwers) => {
  const rpo = PROJECT_TEMPLATES.find((item) => item.name === anwers.template);
  if (!rpo) {
    console.log(pico.red('模板正在开发中...'));
    process.exit(1);
  }
  const spinner = ora('正在下载模板').start();
  try {
    await downloadRepo(rpo, anwers.projectName);
    spinner.succeed(pico.green('模板下载成功'));

    console.log(pico.cyan(`Run: cd ${anwers.projectName} && pnpm install`));
  } catch (error) {
    console.log(error, 'error');
    spinner.fail(pico.red('模板下载失败'));
    process.exit(1);
  }
};

async function downloadRepo(repo, projectName) {
  const response = await axios({
    method: 'get',
    url: repo.zipUrl,
    responseType: 'arraybuffer',
  });
  const zip = new AdmZip(response.data);
  const projectZipPath = path.join(projectName);
  const mainEntry = zip.getEntries()[0].entryName;
  zip.extractAllTo(projectZipPath, true);
  const targetPath = path.join(projectZipPath, mainEntry);
  fs.copySync(targetPath, projectZipPath, {
    overwrite: true,
  });
  fs.removeSync(targetPath);
}
