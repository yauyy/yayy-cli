# yayy CLI

## Install

```bash
npm install -g yayy-cli
```

## Usage

```bash
ya create <project-name>
# or
yayy create <project-name>
```

## Related

- figlet: 它可以生成 ASCII 艺术字。你可以使用它来在命令行界面显示大型的文本标题
- cac: 是一个用于构建 CLI 应用程序的 JavaScript 库
- inquirer: 是一个用于创建交互式命令行界面的库
- fs-extra: 是一个用于操作文件的库，它是 Node.js 的 fs 模块的扩展
- ora: 是一个在命令行界面创建优雅的 loading 库
- picocolors: 是一个用于在终端中添加颜色的库,比chalk更轻量
- download-git-repo: 是一个用于下载 Git 仓库的库

## FAQ

### 1.Error: 'git clone' failed with status 128

```txt
解决：地址要保证使用的是https模式，地址加前缀。
例如：
direct:https://github.com/usename/XXX.git
```

### 2.Error: 'git checkout' failed with status 1

```txt
解决：下载一个指定分支。
例如：
direct:<https://github.com/luochenLing/XXX.git#main>

```
