function fileConstruct(fileData){
	var str = '<div class="item" data-file-id="'+fileData.id+'">'+
                '<lable class="checkbox" style = "z-index:100"></lable>'+
                '<div class="file-img">'+
                    '<i></i>'+
                '</div>'+
                '<p class="file-title-box">'+
                    '<span class="file-title">'+fileData.title+'</span>'+
                    '<span class="file-edtor">'+
                        '<input class="edtor" value="'+fileData.title+'" type="text"/>'+
                    '</span>'+
                '</p>'+
            '</div>';	
	return str;
}
function renderFilesHtml(datas,renderId){
	var html="";
	var childs = dataControl.getChildById(datas,renderId);
	childs.forEach(function(item){
		html +='<div class="file-item" >'+
		fileConstruct(item)+ 
		'</div>';
	})
	return html;
}
function createFileElement(fileData){
	var newDiv = document.createElement("div");
	newDiv.className = "file-item";
	newDiv.innerHTML = fileConstruct(fileData);
	return newDiv;
}
function renderTreeMenu(datas,renderPid){
	var childs = dataControl.getChildById(datas,renderPid);
	var html="<ul>";
	var level = dataControl.getLevelById(datas,renderPid);
	childs.forEach(function(item){
		var hasChild = dataControl.hasChilds(datas,item.id);
		var classNames = hasChild ? "" : "tree-contro-none";
		html += '<li>'+
                '<div class="tree-title '+classNames+'" data-file-id="'+item.id+'" style="padding-left:'+level*14+'px">'+
                    '<span>'+
                        '<strong class="ellipsis">'+item.title+'</strong>'+
                        '<i class="ico"></i>'+
                   '</span>'+
                '</div>'+
                renderTreeMenu(datas,item.id)+
           ' </li>';
	})
	html +="</ul>";
	return html;
}
function createTreeHtml(options){
	var newLi = document.createElement("li");
	newLi.innerHTML = '<div class="tree-title tree-contro-none" data-file-id="'+options.id+'" style="padding-left:'+options.level*14+'px">'+
                   ' <span>'+
                        '<strong class="ellipsis">'+options.title+'</strong>'+
                       ' <i class="ico"></i>'+
                    '</span>'+
                '</div>'+
               ' <ul></ul>';
	return 	newLi;
}
//通过id定位到树形菜单，添加calss
function positionTreeById( positionId ){	
	var ele = document.querySelector(".tree-title[data-file-id='"+positionId+"']");
	tools.addClass(ele,"tree-nav");
	tools.addClass(ele,"tree-contro");
}
function renderPathNav(datas,renderId){
	var parents = dataControl.getParents(datas,renderId).reverse();
	var len = parents.length;
	var html ="";
	parents.forEach(function(item,index){
		if(index===parents.length-1) return;
		html +='<a href="javascript:;" style="z-index:'+len--+'" data-file-id="'+item.id+'">'+item.title+'</a>	';
	})
	html +='<span class="current-path" style="z-index:'+len--+'">'+
			parents[parents.length-1].title+
		'</span>';
	return html;
}
function creatDrag(fileList){
	var checkeds = tools.$(".checked",fileList);
	var len = checkeds.length;
	var html = '<div class="icons">';
	for(var i = 0; i< len;i++){
		html +='<i class="icon icon'+i+' filetype icon-folder"></i>' 
	}  
     html +='</div>'+
        '<span class="sum">'+len+'</span>';
	return html;
}