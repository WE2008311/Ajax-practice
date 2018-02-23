// 判断JS执行环境
if(typeof(window)==='undefined'){
    console.log('node.js');
}else{
    console.log('browser');
}

process.nextTick(function(){
    console.log('nextTick callback!');
});
console.log('nextTick was set!');




'use strict';

var fs=require('fs');

fs.readFile('sample.txt','utf-8',function(err,data){
    if(err){
        console.log(err);
    }else{
        console.log(data)
    }
})


'use strict';

var fs=require('fs');
var stats=fs.statSync('sample.txt');

console.log(stats.isFile());