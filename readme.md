# AJAX的学习笔记
#前端-JS#

AJAX是异步JavaScript和XML的缩写，它的作用是执行异步的网络请求。因为JS是线性同步，如果需要用户向浏览器发送一个请求，那么就需要等浏览器接收到了结果才能继续运行，如果发送到接受的时间太长，浏览器就会很长时间处于“假死”状态，这样的用户体验很不好。于是Jesse James Garrett介绍了一种新技术，即用JS执行异步网络请求，也就是AJAX。

## XMLHttpRequest
AJAX的核心是XMLHttpRequest（简称XHR）对象。

通过一个XMR对象的构造函数，我们可以在JS上开始写AJAX。

### 判断浏览器
一般我们用`var xhr=new XMLHttpRequest()`来创建新的XHR对象，但是由于早期的IE版本并不支持原生的XHR，而是支持ActiveXObject，所以开始之前我们需要做一个判断：
```js
var xhr;
if(window.XMLHttpRequest){
  xhr=new XMLHttpRequest();
}else{
  xhr=new ActiveXObject('Microsoft.XMLHttp');
}
```

### 设置onreadystatechange回调函数
设置回调函数的目的是，判断我们发送的请求是否成功，不管成功与否都给出一个回调响应，以让我们开始下一步的操作。如下：
```js
var xhr;
if(window.XMLHttpRequest){
  xhr=new XMLHttpRequest();
}else{
  xhr=new ActiveXObject('Microsoft.XMLHttp');
}

xhr.onreadychange=function(){   //状态发生变化时，函数回调
  if(xhr.readyState===4){   //成功完成
    //判断响应结果：
    if(xhr.status===200){
      //成功，通过responseText拿到响应文本：
      return success(xhr.responseText);
    }else{
      //失败，根据响应码判断失败原因：
      return fail(xhr.status);
	  }
  }else{
    //响应还在继续。
  }
}
```

### XHR的用法
成功创建XHR对象后，第一个要用的方法就是`open()`,`open()`方法传递三个参数：
1. 请求的类型；
2. 请求的地址；
3. 是否异步发送请求，默认为true，一般不用填。
例子：
`open("get","example.php")`

open()方法并不是真正的发送请求，要发送请求还需要用到另一个方法`send()`。get方式的请求不需要数据，则直接send()就好了，而post则需要把数据以字符串或者formData对象传进去。

## 安全限制
由于浏览器的*同源政策*，如果你请求的地址URL的域名和你当前的页面不一致，浏览器是不允许的。

所谓的一致，是指完全的一致。

1. www.xxx.com 和 xxx.com 是不一致的；
2. www.xxx.com 和www.xxx.com:80 是不一致的；
3. www.xxx.com:80 和www.xxx.com:8080是不一致的；
4. https://www.xxx.com 和http://www.xxx.com 也是不一致的。 

但是很多时候我们需要从其他的网站调数据，那么怎么来解决它呢？所以我们需要用到跨域技术。

常用的技术有三种。

1. 通过Flash插件发送HTTP请求；
2. 通过在同源域名下架设代理服务器，JS把请求发送到代理服务器上；*缺点*是要在后端做多余的开发；
3. JSONP。

### JSONP
这里重点介绍一下JSONP（JSON with padding，参数式JSON）。由于浏览器允许跨域引用JS资源，因此JSONP的原理就是通过触发在页面中的JS资源来引用数据。因为JSONP一般是由两部分组成：回调函数、数据，所以我们只要有一个JSONP格式的URL，并在页面中准备好两段代码：一段是触发JSONP中回调函数的代码，这段代码是用来渲染数据的；另一段是动态生成引用JSONP的。

举个例子：

我们借用一个根据IP地址查询天气的API：http://freegeoip.net/json?callback=handleResponse。

这就是一个JSONP格式的URL，向这个地址请求，将得到一个handleResponse()回调函数，执行就得到数据。因此我们就可以拿出我们准备好的两段代码了。

第一段：
```js
function handleResponse(response){
  console.log("you are " + response.ip + ",which is in " + response.city + response.region_name);
}
```
这一段代码是通过回调函数，把数据渲染出来。

第二段：
```js
function getLocation(){
  var script=document.createElement("script"),
      script.src="http://freegeoip.net/json?callback=handleResponse"
  document.body.insertBefore(script,document.body.firstChild);
}
```

最后我们只要执行这个getLocation的函数，就完成了跨域调取数据。

### CORS
