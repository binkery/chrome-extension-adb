var black_list = {};

function getHostFromUrl(url){
    var arrUrl = url.split("//");
    if(arrUrl.length == 1){
        return url;
    }
　　　　var start = arrUrl[1].indexOf("/");
　　　　var relUrl = arrUrl[1].substring(0,start);
　　　　return relUrl;
}

function addRequstToList(request){
    var host = getHostFromUrl(request.url);
    if(request_list[host] == null){
        request_list[host] = [];
    }
    request_list[host].push(request.url);    
}

function addUrlToBlockList(url){
    console.log("add url to block list " + url);
    var host = getHostFromUrl(url);
    console.log("add url to block list " + host + ", " + black_list[host]);
    if(black_list[host] == undefined){
        //console.log("add url to block list " + black_list[host].block);
        black_list[host] = {
            count:0,
            block:true
        };
    } else {
        black_list[host].block = true;
    }
    chrome.storage.local.set({"black_list":black_list},function(){
        console.log("addUrlToBlockList save ");
    });
    
}

function removeHostFromBlockList(host){
    console.log("removeHostFromBlockList " + host);
    if(black_list[host] == undefined){

    } else {
        black_list[host].block = false;

    }
    console.log("removeHostFromBlockList " + black_list[host].block);
    chrome.storage.local.set({"black_list":black_list},function(){
        console.log("removeHostFromBlockList save ");
    });
}

chrome.storage.local.get(["black_list"],function(result){
    if(result.black_list == undefined){
        black_list = {};
    }else{
        black_list = result.black_list;
        
    }
});


chrome.contextMenus.create(
    {
        title:"列表",
        type:"normal",
        contexts:["page"],
        onclick:function(info,tab){
            alert(tab.index);
        }
    }
    ,function(){

    }
);

var request_list = {};
//var hosts = {};
//var adbHosts = [];

var mTabRequest = {};

chrome.tabs.onUpdated.addListener(function(tabId,changeInfo,tab){
    //console.log("onUpdated..." + tabId + ", status = " + changeInfo.status);
    if(changeInfo.status == 'loading'){
        mTabRequest[tabId] = [];
    }else if(changeInfo.status == 'complete'){
        chrome.storage.local.set({"black_list":black_list},function(){
            console.log("removeHostFromBlockList save ");
        });
    }

});

// 监听发送请求
chrome.webRequest.onBeforeRequest.addListener(

    function(details) {
        var host = getHostFromUrl(details.url);
        //console.log("=== " + host + ", has = " + adbHosts.indexOf(host));
        if(black_list[host] != undefined && black_list[host].block){
            console.log("屏蔽 " + host);
            black_list[host].count +=1;
            return {cancel:true};
        }
        //console.log(details);
        return {cancel:false};
    },
    {urls: ["<all_urls>"],types: ["script"]},
  //要执行的操作，这里配置为阻断
  ["blocking"]
);


chrome.webRequest.onCompleted.addListener(function(request){
    //addRequstToList(request);
    //console.log("onCompleted " + request.tabId + ", url = " + request.url);
    if(mTabRequest[request.tabId] == undefined){
        mTabRequest[request.tabId] = [];
    }
    mTabRequest[request.tabId].push(request.url);
}, {urls: ["<all_urls>"],types:["script"]});

