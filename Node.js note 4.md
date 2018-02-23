# Node.js 学习笔记（四）

## stream
`stream`是Node.js提供的在且仅在服务端的模块，为了支持“流”这种数据结构。

流是一种抽象的数据结构，它的特点是**数据有序、依次写入读取**。

在Node.js中，流也是一个对象，我们需要响应流的事件就可以了：`data`表示流的数据已经可以读取了；`end`表示这个流已经到末尾了；`error`表示出错了。

### 读取文件
下面是一个从文件流读取文本内容的示例：
```js
'use strict';

var fs=require('fs');

var rs=fs.createReadStream('sample.txt','utf-8');

rs.on('data',function(chunk){
    console.log('DATA:');
    console.log(chunk);
});

rs.on('end',function(){
    console.log('END');
});

rs.on('error',function(err){
    console.log('ERROR'+err);
});
```

### 写入文件
要用流的形式写入文件，只要调用`write()`，最后用`end()`结束即可：
```js
'use strict';

var fs=require('fs');

var ws1=fs.createWriteStream('output.txt','utf-8');
ws1.write('使用Stream写入文本数据...、\n');
ws1.write('END');
ws.end();

```

> 要注意的是：在上面的`rs`就是一个可读流，它继承自`stream.Readable`。而`ws1`就是一个可写流，它继承自`stream.Writable`。
> 
> 可读流和可写流的内容还很复杂，这里我们暂时不做过多解释，后续会陆续更新相关内容。

### pipe
我们可以把两个流串起来，就好像把两根水管连接起来一样。把一个`Readable`和一个`Writable`“串”起来，数据就能从`Readable`流进入`Writable`流中，这种操作就叫做`pipe`。

`pipe()`是一个属于`Readable`流的方法。它的本质是一个复制操作。

看下面的例子：
```
'use strict';

var fs=require('fs');

var rs=fs.createReadStream('sample.txt');
var ws=fs=createWriteStream('copied.txt');

rs.pipe(ws);
```