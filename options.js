var bg = chrome.extension.getBackgroundPage();
var mDivBlockList = document.getElementById("block_list");

var list = bg.mBlockList;

function appendToDiv(item){

    var p = document.createElement('p');

    var hostSpan = document.createElement('span');
    hostSpan.innerHTML = item.host;
    p.appendChild(hostSpan);

    var countSpan = document.createElement('span');
    countSpan.innerHTML = item.count;
    p.appendChild(countSpan);

    var blockSpan = document.createElement('span');
    if(item.block){
        blockSpan.innerHTML = '不屏蔽';
    }else{
        blockSpan.innerHTML = '屏蔽';
    }
    blockSpan.setAttribute("block",item.block);
    blockSpan.setAttribute("url",item.host);
    blockSpan.onclick = function(){
        var url = this.getAttribute("url");
        var isBlock = this.getAttribute("block");
        console.log(isBlock);
        if(isBlock == "true"){
            console.log("remove");
            bg.removeHostFromBlockList(url);
        }else{
            console.log("add");
            bg.addUrlToBlockList(url);
        }
        console.log("click url = " + url);
    };
    p.appendChild(blockSpan);

    mDivBlockList.appendChild(p);
}

for(var x in list){
    appendToDiv({
        host:x,
        count:list[x].count,
        block:list[x].block
    });
}


