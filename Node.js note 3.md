# Node.js 学习笔记（三）
## global
JS在浏览器中的全局对象是`window`对象。在Node.js环境中，全局对象则叫`global`。我们可以用它来区分当前JavaScript的执行环境：
```js
if(typeof(window)==='undefined'){
  console.log('node.js');
}else{
  console.log('browser');
}
```

## process
`process`是Node.js提供的一个对象，它代表当前Node.js的进程。

JavaScript程序是由事件驱动执行的单线程模型，Node.js也不例外。Node.js不断执行响应事件的JavaScript函数，直到没有任何响应事件的函数可以执行，Node就退出了。

### nextTick方法
此方法可以在下一次事件响应中执行代码。

## fs模块
fs模块是Node.js的内置模块，是负责处理读写文件的。它同时提供了异步和同步方法。

### 异步和同步
异步是在JS执行IO操作时，无需等待执行结果，而是传入回调函数后，继续执行下面的代码，以jQuery的`getJSON()`为例：
```js
$.getJSON('http://example.com/ajax',function(data){
  console.log('IO结果返回后执行……');
});
console.log('不等待IO结果直接执行后续代码‘）；
```

而同步则是线形的，需要等待IO操作返回结果后，再执行后续代码：
`var data=getJSONSync('http://example.com/ajax');`

同步代码更少，但是异步在实际的用户体验更好。

### 异步读文件
以下是一个异步读取文本文件的实例：
```js
‘use strict';

var fs=require('fs');

fs.readFile('sample.txt','utf-8',function(err,data){
    if(err){
        console.log(err);
    }else{
        console.log(data)
    }
})
```
要注意的是，`sample.txt`必须在当前的目录之下，且文件的编码格式为utf-8。

如果我们要读取的是二进制文件呢？下面是一个读取图片的例子：
```js
'use strict';

var fs = require('fs');

fs.readFile('sample.png', function (err, data) {
    if (err) {
        console.log(err);
    } else {
        console.log(data);
        console.log(data.length + ' bytes');
    }
});
```
当读取二进制文件时，不传入文件编码（如utf-8）时，data会返回一个`Buffer`对象。

> 这里提一下`Buffer`对象，它是Node处理二进制数据的一个接口，也是Node原生的全局对象，可以直接使用，不需要`require(‘buffer’)`。它的作用类似于数组。

### 同步读文件
同步读文件相比异步读文件，只是在`readFile`上加了一个`sync`，看下面的例子：
```js
'use strict'

var fs=require('fs');
try{
  var data=fs.readFileSync('sample.txt','utf-8');
  console.log(data);
}
catch(err){
  //错误信息
}
```
如果发生错误，只能通过`try...catch`捕获。

### 写文件
通过`fs.writeFile()`实现。
```js
'use strict'

var fs=require('fs');

var data='Hello Node.js！';
fs.writeFile('output.txt',data,function(err){
  if(err){
    console.log(err);
  }else{
    console.log('ok');
  }
});
```
和读文件相同，`writeFile()`也有一个同步方法`writeFileSync()`。
```js
'use strict';
var fs=require('fs');

var data='hello Node.js';
fs.writeFileSync('output.txtx',data);
```

### stat
可以通过`fs.stat()`获取文件大小、创建时间等信息。它会返回一个stat对象，告诉我们文件的详细信息。
```js
'use strict';

var fs=require('fs');
fs.stat('sample.txt',function(err,stat){
  if(err){
    console.log(err);
  }else{
    // 是否是文件:
        console.log('isFile: ' + stat.isFile());
        // 是否是目录:
        console.log('isDirectory: ' + stat.isDirectory());
        if (stat.isFile()) {
            // 文件大小:
            console.log('size: ' + stat.size);
            // 创建时间, Date对象:
            console.log('birth time: ' + stat.birthtime);
            // 修改时间, Date对象:
            console.log('modified time: ' + stat.mtime);
        }
    }
});
```
同样，它也有一个同步函数`statSync()`：
```js
'use strict';

var fs=require('fs');
var stats=fs.statSync('sample.txt');

console.log(stats.isFile());     //true
```