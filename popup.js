var mDivRequestList = document.getElementById("div_request_list");
var bg = chrome.extension.getBackgroundPage();

function appendToDiv(item){
    var p = document.createElement('p');

    var hostSpan = document.createElement('span');
    hostSpan.innerHTML = item.url;
    p.appendChild(hostSpan);

    var blockSpan = document.createElement('span');
    blockSpan.innerHTML = '屏蔽';
    blockSpan.setAttribute("url",item.url);
    blockSpan.onclick = function(){
        var url = this.getAttribute("url");
        console.log("click url = " + url);
        bg.addUrlToBlockList(url);
    };
    p.appendChild(blockSpan);

    mDivRequestList.appendChild(p);
}

chrome.tabs.query(
    {
        active:true
    },function(tabs){
        console.log("query " + tabs[0].id);
        var list = bg.mTabRequest[tabs[0].id];
        for(x in list){
            appendToDiv({
                url : list[x],
            });
        }
    }
);


