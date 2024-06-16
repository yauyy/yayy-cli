import {
  printHeader,
  helpCmd,
  inqurieProject,
  verifyDirectory,
  downloadTemplate,
} from './tools.js';

async function main() {
  const projectName = await helpCmd();
  const anwers = await inqurieProject(projectName);
  verifyDirectory(anwers.projectName)
  downloadTemplate(anwers);
}

main();