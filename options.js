chrome.storage.local.get(["black_list"],function(result){
    console.log("get local data");
    if(result.black_list == undefined){
        black_list = [];
    }else{
        black_list = result.black_list;
    }
    //updateList(result.black_list);
});
var bg = chrome.extension.getBackgroundPage();

console.log("options js running.");
var message = document.getElementById("black_list");
function updateList(list){
    console.log("append list " + list);
    //for(var x = 0 , len = list.length ;x < len;x++){
    for(var x in list){
    console.log("x === " + x + ", " + list[x].block);
    var p = document.createElement('p');
    var host = document.createElement('span');
    host.innerHTML = x;
    p.appendChild(host);


        var countSpan = document.createElement('span');
            countSpan.innerHTML = list[x].count;
            p.appendChild(countSpan);

    var block = document.createElement('span');
    if(list[x].block){
        block.innerHTML = '不屏蔽';
    }else{
        block.innerHTML = '屏蔽';
    }
    block.setAttribute("block",list[x].block);
    block.setAttribute("url",x);
    block.onclick = function(){
        //block_url(list[x]);
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
    p.appendChild(block);

    message.appendChild(p);

    }
}

updateList(bg.black_list);

