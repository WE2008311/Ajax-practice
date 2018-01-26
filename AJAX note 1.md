# AJAX的学习笔记一


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
我们在上面说到，浏览器的同源策略，会阻止接收跨域的请求结果，解决的方法已经在上面简单介绍了，此外，现在大部分浏览器已经能够支持CORS了。

CORS（Cross-Origin Resource Sharing，跨域资源共享），这是一种规范，允许Web应用服务器进行跨域访问控制，从而使跨域数据传输安全进行。

目前所有的浏览器都支持了这个策略，但是，我们的IE10以下的并不在其中……

CORS的原理是使用HTTP头部信息，让服务器端与客户端相沟通，以决定请求或响应是否成功。用一个简单但是不太恰当的比喻就是，CORS就是你（客户端）拿着一个口令（头信息）去通过某个关卡，而这个关卡也有口令，如果你的口令和关卡的口令匹配（相同或者为`*`），那么你就可以自由出入（跨域请求通过），如果不匹配，你就会被扣留（跨域请求失败）。

因此，在CORS中，关键的是服务端的口令（头信息）。只要服务端实现了CORS接口，就可以跨域通信。而在客户端的CORS通信过程，都是由浏览器完成，不需要用户处理，那么，浏览器是怎么处理的呢？

#### 两种请求
浏览器把跨域请求分为两类：简单请求和预先请求。

简单请求需要满足下列两个条件：

* 请求方法是下列之一：
	1. GET
	2. HEAD
	3. POST
* 请求头中的Content—Type请求头的值是下列之一：
	1. application/x-www-form-urlencoded
	2. multipart/form-data
	3. text/plain

反之，不满足其中之一则是预先请求。浏览器会先发送一个OPTION请求，用来与域名服务器协商是否可以发送实际的跨域请求。

两种请求的具体流程过多，这里我就不细说了，有兴趣的小伙伴可以从下面几篇文章中更详细地了解CORS：
1. [廖雪峰的AJAX教程](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Access_control_CORS)
2. [阿里云：CORS——跨域请求那些事儿](https://yq.aliyun.com/articles/69313)
3. [跨域资源共享 CORS 详解 - 阮一峰的网络日志](http://www.ruanyifeng.com/blog/2016/04/cors.html)
4. [HTTP访问控制（CORS） - HTTP | MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Access_control_CORS)

> 总之我们只要明白，CORS是一种跨域策略。浏览器会在我们需要跨域操作时自定义头部信息，与服务端进行匹配，以确定是否同意跨域。而头信息的处理，一般情况下，是由浏览器自动完成，不需要开发者处理。

