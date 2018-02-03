# Node.js学习笔记（二）
#前端##JavaScript##node.js#

> 今天的内容涉及Node的原理、运行机制和CommonJS的内容，会有点沉闷，也会有点困难，建议像我一样做一些笔记。

## 模块
在开发大型应用的时候，我们常常会用到全局变量，例如：`var s="Hello"`。但是，当我们的应用越来越大时，我们可能会不小心重复用了几个相同的变量或者函数名，这就会给我们的应用造成麻烦。为了解决这个困难，于是提出了模块的概念。模块是一种代码的组织形式，就是把实现不同功能的JS代码分开来写，把相同名字的函数或变量存在不同的模块中，这样就可以**避免相同名的函数或变量发生冲突**了。

同时，模块还可以提高代码的**可维护性**。因为你只要关心写好当前的模块，而不必担心会污染或影响到别的模块，模块之间都是隔离的。

在上一节的例子中，我们编写了一个hello.js的代码。在这里，我们把它修改一下：
```js
'use strict';

var s="Hello";

function greet(name){
  console.log(s + "," + name + "!");
}

module.exports=greet;
```
这里，我们用`module.exports`向外输出了一个变量。这个变量就是这个模块与外界的一个出口。这个变量可以是**函数、对象、数组**。

既然有输出，就要有接口。我们再创建一个main.js：
```js
'use strict';

//引入hello模块：
var heat=require('./hello');
var s='Michael';

heat(s);   //Hello,Michael!
```
这里，我们用require函数引入了hello模块。main.js中，变量heat就是在hello.js中暴露的greet函数。接下来`heat(s)``就是直接使用它了。

## Commonjs规范和Node的内部运行
这种模块加载的方式被称为Commonjs规范，除了这种规范之外，还有ES6、AMD、CMD，这里不细谈，我也还没学到，这里只谈谈Commonjs和以前学的闭包知识。

在上文中，我们提到了全局变量的冲突。正如我们在上面的例子中，两个js文件都声明了变量s，但是并没有发生冲突，仍然是按照我们的意愿来执行的，这就是Node实行了模块的隔离。

### 隔离的原理
> Node能够实现模块和变量的隔离，是因为闭包。

JS是一种函数式编程语言，它支持闭包，如果我们用函数把某个变量包起来，这个变量就变成了函数内部的局部变量了。而我们知道，闭包中只要这个函数的生命周期没有结束，这个变量也就可以一直存在，而不会受到其他函数外的其他变量的影响。

我们以上面的例子来解释，在hello模块中，`s="hello"`被保存了起来，只对外开了一个口：`module.exports=greet`，在函数greet中，包含有变量s，所以`”s=hello”`能一直被保存起来，直到greet在main模块中被引用。

这里有一个问题，我们说需要一个函数才能形成闭包，但是我们的代码并没有这个函数呀？这就是Node做的工作了，Node帮我们在内部包装了hello模块：
```js
(function(){
  var s="Hello";
  function greet(name){
    console.log(s + "," + name + "!");
  }
})()
```
因此，s就变成了匿名函数的内部局部变量，后来加载的其他模块中即使也有s变量，也不会影响到这个s变量。

### 模块的输出
在Node中有一个module对象，让我们来看看模块的输出过程：
```js
var module={
  id:'hello',
  exports:{}
};
var load=function(module){
  //读取的hello.js代码
  function greet(name){
    console.log( "Hello," + name + "!");
  }
  module.exports=greet;
  //hello.js代码结束
  return module.exports;
};
var exported=load(module);
//保存module
save(module,exported);
```
在我们的hello模块中，我们通过`module.exports=greet`把一个变量传给了Node，而module实际上是Node准备阶段的一个变量，而且也是作为load函数的一个参数被保存了下来。每当我们使用`module.exports`时，Node就把一条module按模块分类存了起来，这些module都被保存在了一起。

当我们在main模块中想要用到hello模块时，我们又使用`require()`来让Node帮我们在找到id为hello的module传递给我们。这样，我们就拿到了hello的模块输出。

> Node的运行参考了[模块—廖雪峰的官方网站](https://www.liaoxuefeng.com/wiki/001434446689867b27157e896e74d51a89c25cc8b43bdb3000/001434502419592fd80bbb0613a42118ccab9435af408fd000)，实在看的我也有点绕，不过Node处理模块的运行原理我们现在看个大概暂时就够了，等学完主体内容再来细细分析。

### 两种输出方式
我们可以通过两种方式输出模块：
#### 方法一：
```js
module.exports={
  hello:hello,
  greet:greet
}
```
#### 方法二：
```js
exports.hello=hello;
exports.greet=greet;
```

但是你不能直接对exports赋值：
```js
exports={
  hello:hello,
  greet:greet
}
```

> 实践证明，使用`module.exports=xxx`的方式赋值更好。具体原因同样涉及到Node的内部处理。有兴趣的同学可以参考上面的那篇文章。