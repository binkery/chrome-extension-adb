// 
var mBlockList = {};
var mTabRequest = {};

function getHostFromUrl(url){
    var arrUrl = url.split("//");
    if(arrUrl.length == 1){
        return url;
    }
　　　　var start = arrUrl[1].indexOf("/");
　　　　var relUrl = arrUrl[1].substring(0,start);
　　　　return relUrl;
}

function addUrlToBlockList(url){
    console.log("add url to block list " + url);
    var host = getHostFromUrl(url);
    console.log("add url to block list " + host + ", " + mBlockList[host]);
    if(mBlockList[host] == undefined){
        //console.log("add url to block list " + black_list[host].block);
        mBlockList[host] = {
            count:0,
            block:true
        };
    } else {
        mBlockList[host].block = true;
    }
    chrome.storage.local.set({"block_list":mBlockList},function(){
        console.log("addUrlToBlockList save ");
    });
    
}

function removeHostFromBlockList(host){
    console.log("removeHostFromBlockList " + host);
    if(mBlockList[host] == undefined){

    } else {
        mBlockList[host].block = false;

    }
    console.log("removeHostFromBlockList " + mBlockList[host].block);
    chrome.storage.local.set({"block_list":mBlockList},function(){
        console.log("removeHostFromBlockList save ");
    });
}

chrome.storage.local.get(["block_list"],function(result){
    if(result.block_list == undefined){
        mBlockList = {};
    }else{
        mBlockList = result.block_list;
        
    }
});


chrome.tabs.onUpdated.addListener(function(tabId,changeInfo,tab){
    if(changeInfo.status == 'loading'){
        mTabRequest[tabId] = [];
    }else if(changeInfo.status == 'complete'){
        chrome.storage.local.set({"block_list":mBlockList},function(){
            console.log("onUpdated save ");
        });
    }

});


chrome.webRequest.onBeforeRequest.addListener(

    function(details) {
        var host = getHostFromUrl(details.url);
        if(mBlockList[host] != undefined && mBlockList[host].block){
            console.log("屏蔽 " + host);
            mBlockList[host].count +=1;
            return {cancel:true};
        }
        return {cancel:false};
    },
    {urls: ["<all_urls>"],types: ["script"]},
    ["blocking"]
);

// 
chrome.webRequest.onCompleted.addListener(function(request){
    if(mTabRequest[request.tabId] == undefined){
        mTabRequest[request.tabId] = [];
    }
    mTabRequest[request.tabId].push(request.url);
}, {urls: ["<all_urls>"],types:["script"]});

