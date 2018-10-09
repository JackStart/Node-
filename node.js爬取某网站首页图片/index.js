//使用http模块发起请求,获取到响应的数据
var http = require('http');
var fs = require('fs');
//分析模块
var path = require('path');
//res响应对象
http.get('http://gz.itcast.cn/', function (res) {
    var content='';
    //通过响应对象得到，得到html数据
    res.on('data',function (str) {
        content+=str;
        // console.log(str);
    });
    res.on('end',function () {
    //    console.log (content);
        //2、分析html数据，提取所有的图片地址
        //HTML代码存放在content中
        //用正则表达式匹配 src="/2018czgw/images/slogan.jpg"
        //弊端：这种方式不能全局匹配 加上img
        var reg = /src="(.*?\.jpg)"/img;
        //使用while循环遍历
        var filename;
        while(filename=reg.exec(content)){
            // console.log(filename[1]);
            // url='http://gz.itcast.cn/'+filename[1];
            getImage(filename[1]);//下载图片的函数
        }
        //这种方式只能拿到src,我们要拿的是子匹配的地址
        // var data=content.match(reg);
        //这种方式只能获取1条数据，要使用循环遍历
        // var data1=reg.exec(content);
        // var data2 = reg.exec(content);
        // var data3 = reg.exec(content);
        // fs.writeFile('./data.txt',data[1],function () {
        //     console.log('写入成功');
        // });
        // console.log(content.match(reg));
        // console.log(data1);
        // console.log(data2);
    });
});

//实现获取图片，并将图片保存到硬盘上的函数
function getImage(url) {
    //分析图片名字  parse
    //由于图片在保存时，需要文件名，所以先获取到图片的文件名
    // console.log(path.parse(url).base);
    var obj=path.parse(url);
    var fn=obj.base;//获取到文件名
    var stream1=fs.createWriteStream('./files/'+fn);
    //注意，当有的图片没有根时，给root赋值 目的：为了兼容网址里没有根目录的情况
    if(obj.root.length===0){
        url='/'+url;
    }
    //拼接成一个完整的图片url，才能发起请求
    url = 'http://gz.itcast.cn/'+url;
    //向服务器发起请求，获取图片
    //res 服务器的流 用管道的方法获取 pipe
    http.get(url,function (res) {
        res.pipe(stream1);
        console.log(fn+'下载成功');
    });
}