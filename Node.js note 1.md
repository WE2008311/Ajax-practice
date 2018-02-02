# Node.js学习笔记（一）
#JavaScript# #node.js#

## Node.js 安装与更新
Node.js可以通过在官网下载更新，第一次安装我们只要跟着下一步就可以安装完成了。

重要的是后续的更新。

我们可以通过在终端中输入：`node -v`回车来查看当前的版本。如果版本过低，我们则需要更新我们的node.js。步骤如下：
1. 清理npm缓存：
`sudo npm cache clean -f`
2. 安装n包升级node.js。n包是node.js中负责管理版本的模块。
`sudo npm install -g n`
3. 安装好n包以后，可以选择安装最新的稳定版本，也可以指定安装某个版本。
`sudo n stable`
`sudo n 7.6.0`

### npm和cnpm
npm(node package manager)是node.js的包管理工具。

为啥我们需要一个这个玩意儿？因为我们在开发的过程中，会用到很多别人的JS代码，如果每次都搜索、下载、使用，就会很麻烦。而有了npm后，我们可以直接在npm上下载，而不用操心其他代码之外的问题。

npm在我们安装node.js的时候就已经安装好了，查看一下版本：`npm -v`。
在我们更新node.js的时候，我们的npm也会随之更新。

因为npm安装需要从国外下载，所以网络不是很稳定，这很不方便。因此也就有了npm的国内镜像：cnpm，这是淘宝的前端团队对npm仓库的拷贝。

它的安装：
`npm install -g cnpm --registry=https://registry.npm.taobao.org`

安装成功后，输入`cnpm -v`查看版本。

## 第一个Node程序
> 要注意的是，我们写的JavaScript将在Node环境中执行。而执行将通过命令行`node XXX.js`运行。

让我们来试一下，先在编辑器中新建一个JS文件：hello.js。写一段最简单的代码：
```js
'use strict'

console.log('Hello World');
```

保存到任意目录，接着我们只要用终端进入到这个路径，输入                    `node hello.js`即可。
                                  
我们看到：`Hello，world`被打印出来了。

这里推荐一下VS Code，它集成了终端，只要写好保存一下，然后直接输入node代码就好了，而不用像Mac的终端，还需要先输入路径。

## Node交互模式
在上面的命令行中，我们输入node就进入了Node交互模式，在Node交互模式中，我们可以执行JS文件。

此外，在Node交互模式中，我们还可以直接输入JS代码,例如：
```
>100+200;
300
```
我们可以看到，直接输出了300。但是如果我们把`100+200`写在JS文件，比如上面的hello.js里：
```js
'use strict'

console.log('Hello World');

100+200;

```
结果只会输出`Hello World`，而不会输出300，如果想要输出300，则必须手动加个`console.log()`。

因此，我们说：**Node交互环境会把每一行JavacScript代码结果自动打印出来，但是直接运行JS文件却不会**。