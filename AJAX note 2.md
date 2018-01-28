# AJAX的学习笔记（二）


> 在上篇笔记中，我们主要谈了一些概述和跨域的问题，这一次我们聊聊请求和响应的具体内容。

## 向服务器发起请求
我们在创建了XHR对象后，接着需要用两个方法来发送请求：open()和send()，这两个方法有点像赛跑前的两个步骤：预备、跑。在open()中，并没有实际发送请求，只是一个“预备”动作，真正的发送要到send()中了。

### open和send
open()可以传递三个参数：
1. method：请求的类型，GET或POST之类；
2. url：文件在服务器的位置；
3. async：同步或是异步，默认异步，当选择默认时，我们可以选择不填这个参数。

send()的参数只有一个，是运用在post方式的请求中，以string的形式。

以下是一个例子：
```js
xhr.open("GET","example.php",true);
xhr.send();
//post不需要传递参数；
xhr.open("POST","example.php",true);
xhr.send();
//post需要传递参数；
xhr.open("POST","example.php",true);
xhr.setRequestHeader("Content-type","application/x-www-form-urlcoded");
xhr.send("fname=henry&lname=ford")
```

### get和post
**get**常用于查询数据，有时候，需要我们用某种指定的格式把参数追加到url的末尾。如果格式不正确的话，会出现错误。

举一个例子：
```js
xhr.open("get","example.php?name1=value1&name2=value2",true");
xhr.send();
```

**post**多用于向服务器提交应该被保存的数据。与get不同的是，**post应该以发送的数据作为请求的主体**。参数则不需要写在url里了，而是写在send里，在这里，可以传递XML DOM文档也可以传递字符串。当然，**要注意的是**，如果只是简单的，没有数据传递的POST请求，那么和GET请求一样，在send()中不需要添加什么。如果需要POST数据，我么要用`setRequestHeader()`来添加HTTP头，然后在send()中用参数的形式添加数据传递。

### HTTP头部信息
每个HTTP请求都带有头信息，所以我们发送一个AJAX请求时，实际上也会发送相关的头信息。默认情况下，下列的头信息会被发送出去：
* Accept；
* Accept-Charset；
* Accept-Ending；
* Accept-Language；
* Connection；
* Cookie；
* Host；
* Refer；
* User-Agent；

使用`setRequestHeader()`可以设置自定义的头信息。这个方法接收两个参数：头部字段的名称和值。例如：
```js
xhr.setRequestHeader("Content-type","application/x-www-form-urlcoded");

xhr.setRequestHeader("MyHeader","MyValue");

```
**要注意的是**：`setRequestHeader`方法需要在open()和send()中间设置，这样才能成功发送请求的头部信息。

## 服务器响应
当我们发送请求后，一切顺利，服务器也顺利发回了响应，那么我们要怎么来获取这些响应呢？

### responseText和responseXML
这是获取两种不同格式的响应，`esponseText`是字符串形式，`responseXML`则是XML形式。

举一个例子：
```js
var xhr;
if(window.XMLHttpRequest){
  xhr=new XMLHttpRequest();
}else{
  xhr=new ActiveXObject("Microsoft.XMLHTTP");
}
xhr.onreadystatechange=function(){
  if(xhr.readyState==4 && xhr.status==200){
    document.getElementById("myDiv").innerHTML=xhr.responseText;
  }
}
xhr.open("get","example.php",true);
xhr.send();
```
就是这样。

## XHR 2级
XHR的发展也促使W3C着手制定更为完善的2级规范。在这套规范里，有一些内容需要了解。

### FormData
为了实现表单数据的序列化，在Web应用中更方便地传输数据，2级规范定义了FormData类型。

下面是一个创建FormData实例的例子：
```html
<form id="myForm" action="" method="post">
    <input type="text" name="name">名字
    <input type="password" name="psw">密码
    <input type="submit" value="提交">
</form>
```

```js
var data=new FormData();
//直接添加键值对
data.append("nama","Mike");
//通过向构造函数中传入表单元素也可
  //这是一个表单元素
var form=document.getElementById("myForm");
  //传入
var data=new FormData(form);
xhr.send(data);
  //获取
var name=data.get("name");
var psw=data.get("psw");
```
创建了FormData的实例后，可以直接传到send中。

关于更详细的FormData知识，请参考这篇文章：
[系统学习前端之FormData详解 - 前端与生活 - SegmentFault](https://segmentfault.com/a/1190000006716454)

### 超时设置
最早是IE8为XHR添加了timeout属性，后来被XHR 2级规范收入。

当给timeout设置了数值后，规定时间内没有响应，就会触发timoeout事件，进而调用ontimeout。

这是一个例子：
```js
var xhr;
...
xhr.open("get","example.php",true);
xhr.timeout=1000;
xhr.ontimeout=function(){
  alert("Request is not return in a second"
};
xhr.send();
```

### 进度事件
XHR 2的进度事件定义了XHR在请求的不同阶段触发不同的事件，具体的有6个事件：
* loadstart；
* progress；
* error；
* abort；
* load；
* loadend；

每个浏览器所支持的事件不完全相同，比如IE8就支持load事件。有了这些不同的事件支持，开发者可以免去检查readyState之类的工作，更加的方便。

其中load事件和progress事件比较重要。**load事件**会在接收到完整的响应数据时触发，因此我们就不需要再检查readyState属性了，只要确保XHR的status为200就可以了。

而**progress事件**则会为XHR在浏览器接收数据期间周期性地触发。在触发时，它会额外地提供三个属性：
1. lengthComputable；表示进度信息是否可用
2. position；表示已经接收的字节数
3. totalSize；表示响应头确定的预期字节数
有了这些信息，我们可以创造一个进度指示器：
```js
var xhr=createXHR();
xhr.onload=function(event){
...
}
xhr.onprogress=function(event){
  var divStatus=document.getElementById("status");
if(event.lengthCoputable){
  divStatus.innerHTML="Reiceived"+event.position+"of"+event.totalSize+"bytes";
}
};
```
这里要注意的是：必须在调用open()方法之前添加progress事件处理程序。