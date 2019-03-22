var message = document.getElementById("message");
var bg = chrome.extension.getBackgroundPage();

chrome.tabs.query(
    {
        active:true
    },function(tabs){
        console.log("query " + tabs[0].id);
        var list = bg.mTabRequest[tabs[0].id];
        for(x in list){
            var p = document.createElement('p');

            var host = document.createElement('span');
            host.innerHTML = list[x];
            p.appendChild(host);

            var block = document.createElement('span');
            block.innerHTML = '屏蔽';
            block.setAttribute("url",list[x]);
            block.onclick = function(){
                var url = this.getAttribute("url");
                console.log("click url = " + url);
                bg.addUrlToBlockList(url);
//                console.log("click " + list[x] + ". this = " + this.getAttribute("url"));
            };
            
            p.appendChild(block);

            message.appendChild(p);
        }
    }
);


