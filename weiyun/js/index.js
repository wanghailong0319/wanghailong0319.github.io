     (function(){
	//让下面的区域自适应
	var header = tools.$(".header")[0];
	var headerH = header.offsetHeight;
	var content = tools.$(".content")[0];
	var contentMenu = tools.$(".content-menu")[0];
	changeHeight();
	
	function changeHeight(){
		var viewHeight = document.documentElement.clientHeight;
		content.style.height = viewHeight-headerH +"px";
	}
//	每次可视区域改变时重新体哦啊用
	window.onresize = changeHeight;
	
	//	需要准备的数据
	var datas = data.files;
	
	//渲染文件区域
	var renderId = 0;
	var maxId ="";
	var moveId =renderId;
	var IdArr = [];
	var fileList = tools.$(".file-list")[0];
	var empty = tools.$(".g-empty")[0];
	fileList.innerHTML = renderFilesHtml(datas,renderId);
//	//通过事件委托给每个文件夹添加点击事件
//	tools.addEvent(fileList,"dblclick",function(ev){
//		var target = ev.target;
//		if( tools.parents(target,".item") ){
//			target = tools.parents(target,".item");
//			renderId = target.dataset.fileId;
//			renderNavFilesTree(renderId);
//		}
//		ev.stopPropagation();
//	})
	var fileItem = tools.$(".file-item",fileList);
	var checkboxs = tools.$(".checkbox",fileList);
	tools.each(fileItem,function(item,index){
		fileHandle(item);
	})
	//操作完成后，树形菜单的重新展示方法
	function renderTreeNew(){
		var uls = tools.$("ul",treeMenu);
		for (var i = 0; i < uls.length; i++) {
			uls[i].style.display = "none";
		}
		var positionTreeTitle = tools.$(".tree-nav")[0];
		var parents = tools.getParentsNode(positionTreeTitle);
		for (var i = 0; i < parents.length; i++) {
			if(parents[i].nodeName=="UL"){
				parents[i].style.display = "block";
			}
		}
		var nextUL = positionTreeTitle.nextElementSibling;
		nextUL.style.display = "block";
	}
	
	//给单独一个文件添加事件处理
	function fileHandle(item){	
		var checkbox = tools.$(".checkbox",item)[0];
		//给每一个文件绑定鼠标移入事件
		tools.addEvent(item,"mouseenter",function(){
			tools.addClass(this,"file-checked");
		});
		//给每一个文件绑定鼠标移出事件
		tools.addEvent(item,"mouseleave",function(){
			if( !tools.hasClass(checkbox,"checked") ){
				tools.removeClass(this,"file-checked");
			}	
		});
		//给checkbox添加点击处理
		tools.addEvent(checkbox,"click",function(ev){
			isCheckedAll(this);
			//阻止冒泡，目的：防止触发fileList上的点击
			ev.stopPropagation();
		})
		//给item添加点击处理
		tools.addEvent(item,"click",function(ev){
			var target = ev.target;
			if( tools.parents(target,".item") ){
				target = tools.parents(target,".item");
				isCheckedAll(target.firstElementChild);
			}
			//阻止冒泡，目的：防止触发fileList上的点击
			ev.stopPropagation();
		})
		//给item添加双击处理
		tools.addEvent(item,"click",function(ev){
			var target = ev.target;
			if( tools.parents(target,".item") ){
				target = tools.parents(target,".item");
				renderId = target.dataset.fileId;
				renderNavFilesTree(renderId);
			}
			//阻止冒泡，目的：防止触发fileList上的点击
			ev.stopPropagation();
		})
	}
	//是否全选
	function isCheckedAll(node){
		var isaddClass = tools.toggleClass(node,"checked")
			if( isaddClass ){
				//判断一下是否所有的checkbox是都都勾选了
				if( whoSelect().length == checkboxs.length ){
					tools.addClass(checkedAll,"checked");
				}
			}else{
				//只要当前这个checkbox没有被勾选，那么肯定全选按钮就没有class为checked
				tools.removeClass(checkedAll,"checked");
			}
	}
	//获取所有选中的数据
	function whoSelect(){
		var arr = [];
		tools.each(checkboxs,function (checkbox,index){
			if( tools.hasClass(checkbox,"checked") ){
				arr.push(fileItem[index]);
			}
		});
		return arr;
	}
	
	//渲染树形菜单
	var renderPid = -1;
	var treeMenu = tools.$(".tree-menu")[0];
	treeMenu.innerHTML = renderTreeMenu(datas,renderPid);
	positionTreeById( renderId);
	//通过事件委托，给树形菜单每个元素添加点击事件
	tools.addEvent(treeMenu,"click",function(ev){
		var target = ev.target;
		var treeId = 0;
		var treeTitles = "";
		if( tools.parents(target,".tree-title") ){
			target = tools.parents(target,".tree-title");
			renderId = target.dataset.fileId;
			renderNavFilesTree(renderId);
		}
	})
	
	//渲染导航区域
	var pathNav = tools.$(".path-nav")[0];
	pathNav.innerHTML = renderPathNav(datas,renderId);
	//通过事件委托，给导航每个元素添加点击事件
	tools.addEvent(pathNav,"click",function(ev){
		var target = ev.target;
		if( tools.parents(target,"a") ){
			target = tools.parents(target,"a");
			renderId = target.dataset.fileId;
			renderNavFilesTree(renderId);
		}
	renderTreeNew();
	})
	
	//渲染内容区域的方法
	function renderNavFilesTree(renderId){
			//渲染文件导航
			pathNav.innerHTML = renderPathNav(datas,renderId);
			//如果指定的id没有子数据，需要提醒
			fileList.innerHTML ="";
			var hasChild =dataControl.hasChilds(datas,renderId);
			if( hasChild ){  //如果有子数据，就渲染出子数据的结构
				empty.style.display = "none";
				fileList.innerHTML = renderFilesHtml(datas,renderId);
			}else{
				empty.style.display = "block";
			}
			//需要给点击的div添加上样式，其余的div没有样式
			var treeNav = tools.$(".tree-nav",treeMenu)[0];
			tools.removeClass(treeNav,"tree-nav");
			var parents = dataControl.getParents(datas,renderId).reverse();
			var ellipsis = tools.$(".ellipsis");
			var treeTitles = tools.$(".tree-title");
			for (var i = 0; i < treeTitles.length; i++) {
				if(tools.hasClass(treeTitles[i],"tree-contro")){
					tools.removeClass(treeTitles[i],"tree-contro")
				}
			}
			treeMenu.innerHTML = renderTreeMenu(datas,renderPid);
			positionTreeById(renderId);
			//渲染完成后操作DOM
			for (var i = 0; i < parents.length-1; i++) {
				for (var j = 0; j < ellipsis.length; j++) {
					if(ellipsis[j].innerHTML==parents[i].title){
						tools.addClass(ellipsis[j].parentElement.parentElement,"tree-contro")
					}
				}
			}
			tools.each(fileItem,function(item,index){
				fileHandle(item);
			})

			tools.removeClass(checkedAll,"checked");
			renderTreeNew();
	}
	
	var checkedAll = tools.$(".checked-all")[0];
	//给全选按钮添加事件
	tools.addEvent(checkedAll,'click',function(){
		//判断当前状态是否选中
		var isAddClass = tools.toggleClass(this,"checked");
		if(isAddClass){
			tools.each(fileItem,function(item,index){
				tools.addClass(item,"file-checked");
				tools.addClass(checkboxs[index],"checked");
			})
		}else{
			tools.each(fileItem,function(item,index){
				tools.removeClass(item,"file-checked");
				tools.removeClass(checkboxs[index],"checked");
			})
		}
	})
	
	var move = tools.$(".move")[0];
	var bg = tools.$(".bg")[0];
	var rename = tools.$(".rename")[0];
	var delect = tools.$(".delect")[0];
	var create = tools.$(".create")[0];
	tools.addEvent(create,"click",createFlis);
	//新建文件夹
	function createFlis(){
		empty.style.display="none";
		maxId = Number(dataControl.getMaxId(datas));
		var title = "";
		var newFileData = {
			id:maxId+1,
			pid:renderId,
			title:title,
			type:"file"
		}
		var newFileElement = createFileElement(newFileData);
		fileList.insertBefore(newFileElement,fileList.firstElementChild);
		var fileTitle = tools.$(".file-title",newFileElement)[0];
		var fileEdtor = tools.$(".file-edtor",newFileElement)[0];
		var edtor = tools.$(".edtor",newFileElement)[0];
		fileTitle.style.display = "none";
		fileEdtor.style.display = "block";
		edtor.focus();  //自动获取焦点
		create.isCreateFile = true;
	}
	tools.addEvent(delect,"click",deletFlie);
	
	//删除文件夹
	function deletFlie(){
		var filechecked =tools.$(".file-checked",fileList);
		if(filechecked.length ===0){
			tipsFn("err","请选择要删除的文件或文件夹");
		}else{
			 var fileItem =tools.$(".file-checked .item",fileList);
				for (var i = 0; i < fileItem.length; i++) {
					for (var j = 0; j < datas.length; j++) {
						if(fileItem[i].dataset.fileId==datas[j].id){
							var arr=[datas[j]];
							datas=dataControl.delectDataByData(datas,arr)
						}
					}
				}
			 renderNavFilesTree(renderId);
			tipsFn("ok","删除文件或文件夹成功");
		}
	}
	tools.addEvent(rename,"click",renameFlie);
	//给文件夹重命名
	function renameFlie(){
		var checkedboxs =tools.$(".checked",fileList);
		if(checkedboxs.length !==1){
			tipsFn("err","你的选择不符合重命名规则，请重新选择");
		}else{
			var filesChecked =tools.$(".file-checked",fileList)[0];
			var firstDiv = filesChecked.firstElementChild;
			var filesId = firstDiv.dataset.fileId;
			var fileTitle = tools.$(".file-title",filesChecked)[0];
			var fileEdtor = tools.$(".file-edtor",filesChecked)[0];
			var edtor = tools.$(".edtor",filesChecked)[0];
			fileTitle.style.display = "none";
			fileEdtor.style.display = "block";
			edtor.value = fileTitle.innerHTML;
			edtor.focus();  //自动获取焦点
			rename.isRenameFile = true;
		}
	}
	var moveTo = tools.$(".moveTo")[0];
	
	//移动文件夹的位置
	var IdArr =[];
	var checkedIdArr =[];
	var fileTitles = tools.$(".file-checked .file-title",fileList);
	tools.addEvent(move,"click",moveFlie)
	function moveFlie(){
		IdArr =[];
		var items = tools.$(".file-checked .item",fileList);
		for (var i = 0; i < items.length; i++) {
			IdArr = IdArr.concat(dataControl.getChildsById(datas,items[i].dataset.fileId));
		}
		checkedIdArr =[];
		for (var i = 0; i < items.length; i++) {
			checkedIdArr.push(items[i].dataset.fileId);
		}
		if(items.length ===0){
			tipsFn("err","请选择要移动的文件或文件夹");
		}else{
			moveTo.innerHTML = renderTreeMenu(datas,renderPid);
			bg.style.display = "block";
			bg.style.width = document.documentElement.clientWidth+"px";
			bg.style.height = document.documentElement.clientHeight+"px";
		}
	}
	var moveId = null;
	tools.addEvent(moveTo,"click",function(ev){
		var target = ev.target;
		var moveArr =[];
		if(tools.parents(target,".tree-title")){
			target = tools.parents(target,".tree-title");
			moveId = target.dataset.fileId;
			moveArr=dataControl.getChildById(datas,moveId);
		}
		if(moveId ==renderId){
			tipsFn("err","当前已经在要移动到的位置");
		}else if(dataControl.contains(checkedIdArr,moveId)){
			tipsFn("err","不能移入自身文件夹内");
		}else if(dataControl.contains(IdArr,moveId)){
			tipsFn("err","不能移入本身子文件夹内");
		}else{
			if(dataControl.getChildById(datas,moveId).length==0){
				for (var i = 0; i < checkedIdArr.length; i++) {
					for (var j = 0; j < datas.length; j++) {
						if(datas[j].id==checkedIdArr[i]){
							datas[j].pid=moveId;
							console.log(datas[j],datas[j].pid,checkedIdArr)
						}
					}
				}
				tipsFn("ok","移动成功");
			}else{
				if(isName()){
					tipsFn("err","移入不成功，目标已经存在同名的文件");
				}else{
					for (var i = 0; i < checkedIdArr.length; i++) {
						for (var j = 0; j < datas.length; j++) {
							if(datas[j].id==checkedIdArr[i]){
								datas[j].pid=moveId;
							}
						}
					}
					console.log(111)
					tipsFn("ok","移动成功");
				}
			}
		}
		function isName(){
			fileTitles = tools.$(".file-checked .file-title",fileList);
			console.log(fileTitles,moveArr)
				for (var i = 0; i < fileTitles.length; i++) {
					for (var j = 0; j < moveArr.length; j++) {
						console.log(moveArr,fileTitles)
						if(moveArr[j].title==fileTitles[i].innerHTML){
							return true;
							break;
						}
					}
				}
				return false;
			}
			renderNavFilesTree(renderId);
			bg.style.display = "none";
			IdArr=[];
		})
	tools.addEvent(document,"mousedown",function(){
		if( create.isCreateFile ){  //如果为true，说明正在创建文件
			var firstElement = fileList.firstElementChild;
			var edtor = tools.$(".edtor",firstElement)[0];
			var value = edtor.value.trim();
			if( value === "" ){
				fileList.removeChild(firstElement);
				if( fileList.innerHTML === "" ){
					empty.style.display = "block";
				}
				tipsFn("err","新建文件夹不成功")
			}else{
				var fileTitle = tools.$(".file-title",firstElement)[0];
				var fileEdtor = tools.$(".file-edtor",firstElement)[0];
				fileTitle.style.display = "block";
				fileEdtor.style.display = "none";
				fileTitle.innerHTML = value;
				fileHandle(firstElement);
				//当前这个元素的id
				var fileId = tools.$(".item",firstElement)[0].dataset.fileId;
				//把新创建的元素的结构，放在数据中
				var newFileData = {
					id:fileId,
					pid:renderId,
					title:value,
					type:"file"
				}
				if(dataControl.isNameExsit(datas,renderId,value,fileId)){
					tipsFn("err","新建文件夹名称已存在，请重新创建");
				}else{
					//放在数据中
					datas.unshift(newFileData);
//					console.log(datas)
					var element = document.querySelector(".tree-title[data-file-id='"+renderId+"']");
					var nextElementUl = element.nextElementSibling;
					//只需要找到指定的ul，append一个li元素就可以
					var level = dataControl.getLevelById(datas,renderId);
	//				var maxId = dataControl.getMaxId(datas);
					nextElementUl.insertBefore(createTreeHtml({
						title:value,
						id:maxId+1,
						level:level
					}),nextElementUl.firstElementChild);
					if( nextElementUl.innerHTML !== "" ){
						tools.addClass(element,"tree-contro");
						tools.removeClass(element,"tree-contro-none");
					}
					//创建成功提醒
					tipsFn("ok","新建文件成功");
				}
				renderNavFilesTree(renderId);	
			}
			create.isCreateFile = false;  //无论创建成不成功，状态都要设为false
		}else if(rename.isRenameFile){
			var filesChecked =tools.$(".file-checked",fileList)[0];
			var firstDiv = tools.$(".item",filesChecked)[0];
			var currentId = Number(firstDiv.dataset.fileId);
			var fileTitle = tools.$(".file-title",filesChecked)[0];
			var fileEdtor = tools.$(".file-edtor",filesChecked)[0];
			var edtor = tools.$(".edtor",filesChecked)[0];
			var names = edtor.value.trim();
			if(names==""){
				tipsFn("err","重命名不能为空");
			}else if(names==fileTitle.innerHTML){
				tipsFn("err","重命名失败，新名称与原名称一样");
			}else{
				var isNameExsit = dataControl.isNameExsit(datas,renderId,names,currentId);
				if(isNameExsit){
					tipsFn("err","文件名已存在，请重新命名");
				}else{
					dataControl.changeNameById(datas,currentId,names);
					fileTitle.innerHTML=names;
					tipsFn("ok","重命名成功")
				}
			}
			fileTitle.style.display = "block";
			fileEdtor.style.display = "none";
			renderNavFilesTree(renderId);
			rename.isRenameFile=false;
		}
	})
	//封装小提醒
	var fullTipBox = tools.$(".full-tip-box")[0];
	var tipText = tools.$(".text",fullTipBox)[0];
	function tipsFn(cls,title){
		fullTipBox.style.top = "-32px";
		fullTipBox.style.transition = "none";
		setTimeout(function (){
			fullTipBox.className = "full-tip-box";
			fullTipBox.style.top = 0;
			fullTipBox.style.transition = ".3s";
			tipText.innerHTML = title;
			tools.addClass(fullTipBox,cls);
		},0)
		clearInterval(fullTipBox.timer);
		fullTipBox.timer = setTimeout(function (){
			fullTipBox.style.top = "-32px";
		},2000)
	}
//	右键菜单
	tools.addEvent(document,"contextmenu",function(e){
		var target = e.target;
		if(tools.parents(target,".file-list")||tools.parents(target,".g-empty")){
			contentMenu.style.display = "block";
			contentMenu.style.left=e.clientX+"px";
			contentMenu.style.top=e.clientY+"px";
		}
		e.preventDefault();
	})
	tools.addEvent(contentMenu,"click",function(ev){
		var target = ev.target;
		if(tools.parents(target,".create")){
			createFlis();
		}else if(tools.parents(target,".delect")){
			deletFlie();
		}else if(tools.parents(target,".rename")){
			renameFlie();
		}else if(tools.parents(target,".move")){
			moveFlie();
		}
		contentMenu.style.display = "none";
		ev.stopPropagation();
	})
//	//	双击功能
	tools.addEvent(document,"click",function(ev){
		contentMenu.style.display = "none";
//		var target = ev.target;
//		if(!tools.parents(target,"file-item")){
//			console.log(1111)
//			contentMenu.style.display = "none";
//			bg.style.display = "none";
//			renderNavFilesTree(renderId);
//		}
	})
	var treeRightX = treeMenu.offsetWidth;
	var pathNavBoxY = pathNav.offsetTop+pathNav.offsetHeight;
	//框选/移动功能
	var newDiv = null;
	var dragDiv = null;
	var disX = 0;
	var disY = 0;
	tools.addEvent(document,"mousedown",function (ev){
		disX = ev.clientX;
		disY = ev.clientY;
		var target = ev.target;
		if(tools.parents(target,".nav-a")||tools.parents(target,".checkbox")) return;
		if(tools.parents(target,".item")){
			target = tools.parents(target,".item");
			var fileItems = tools.$(".file-item",fileList);
			var checkBoxs = tools.$(".checkbox",fileList);
			IdArr = [];
			if(!tools.hasClass(target.firstElementChild,"checked")){
				tools.each(fileItems,function(item,index){
					tools.removeClass(item,"file-checked");
					tools.removeClass(checkBoxs[index],"checked");
				})
				tools.addClass(target.parentElement,"file-checked");
				tools.addClass(target.firstElementChild,"checked");
				IdArr.push(target.dataset.fileId);
				IdArr.push(tools.$(".file-title",target)[0].innerHTML);
			}else{
				var checkeds = tools.$(".checked",fileList);
				tools.each(checkeds,function(item,index){
					IdArr.push(item.parentElement.dataset.fileId);
					IdArr.push(tools.$(".file-title",item.parentElement)[0].innerHTML);
				})
			}
//			console.log(IdArr)
			tools.addEvent(document,"mousemove",dragMoveFn);
			tools.addEvent(document,"mouseup",dragUpFn);
//			console.log("在文件夹上按下")
		}else{
			disX = ev.clientX;
			disY = ev.clientY;
			if(disX<treeRightX||disY<pathNavBoxY){
				ev.preventDefault();
				return;
			}
//			console.log("文件区域上按下")
				//鼠标移动过程中
			tools.addEvent(document,"mousemove",moveFn);
			tools.addEvent(document,"mouseup",upFn);
		}
		ev.preventDefault();
	})
	//移动的时候触发的函数
	function moveFn(ev){
		if( Math.abs(ev.clientX - disX) > 10 || Math.abs(ev.clientY - disY) > 10 ){
			console.log("在文件区域移动")
			if( !newDiv ){
				newDiv = document.createElement("div");
				newDiv.className = "selectTab";
				document.body.appendChild(newDiv);
			}
			newDiv.style.width = 0;
			newDiv.style.height = 0;
			newDiv.style.display = "block";
			newDiv.style.left = disX + "px";
			newDiv.style.top = disY + "px";
			var evX = ev.clientX;
			var evY = ev.clientY;
			if(evX<=treeRightX){
				evX=treeRightX;
			}
			if(evY<=pathNavBoxY){
				evY=pathNavBoxY;
			}
			var w = evX - disX;
			var h = evY - disY;
			newDiv.style.width = Math.abs(w) + "px";
			newDiv.style.height = Math.abs(h) + "px";
			//鼠标移动的过程中的clientX和在鼠标摁下的disX，哪一个小就把这个值赋给newDiv
			newDiv.style.left = Math.min(evX,disX) + "px";
			newDiv.style.top = Math.min(evY,disY) + "px";
			//做一个碰撞检测
			//拖拽的newDiv和那些文件碰上了，如果碰上的话就给碰上的文件添加样式，没碰上取消掉样式
			tools.each(fileItem,function (item,index){
				if( tools.collisionRect(newDiv,item) )	{ //碰上了
					tools.addClass(item,"file-checked");
					tools.addClass(checkboxs[index],"checked");
				}else{
					tools.removeClass(item,"file-checked");
					tools.removeClass(checkboxs[index],"checked");
				}
			});
			//判断选中的文件夹数量，确定全选按钮状态
			if( whoSelect().length === checkboxs.length &&checkboxs.length!=0){
				tools.addClass(checkedAll,"checked");
			}else{
				tools.removeClass(checkedAll,"checked");
			}
		}
	}
	//拖拽移动的时候触发的函数
	var itemId = null;
	var arr1 = [];
	function dragMoveFn(ev){
		var target = ev.target;
		if( Math.abs(ev.clientX - disX) > 5 || Math.abs(ev.clientY - disY) >5 ){
			if( !dragDiv ){
				dragDiv  = document.createElement("div");
				dragDiv .className = "drag-helper";
				dragDiv .innerHTML = creatDrag(fileList);
				document.body.appendChild(dragDiv);
			}
			dragDiv .innerHTML = creatDrag(fileList);
			dragDiv.style.display = "block";
			var dragLeft = ev.clientX,dragTop = ev.clientY;
			if(dragLeft<treeRightX) dragLeft =treeRightX;
			if(dragTop<pathNavBoxY) dragTop =pathNavBoxY;
			dragDiv.style.left = dragLeft+ "px";
			dragDiv.style.top = dragTop+ "px";
			//做一个碰撞检测
			//拖拽的newDiv和那些文件碰上了，如果碰上的话就给碰上的文件添加样式，没碰上取消掉样式
			var fileCheckeds = tools.$(".checked",fileList);
			tools.each(fileItem,function (item,index){
				if( tools.collisionRect(dragDiv,item))	{ //碰上了
					tools.addClass(item,"file-checked");
				}else{
					tools.removeClass(item,"file-checked");
					tools.each(fileCheckeds,function (item){
						tools.addClass(item.parentElement.parentElement,"file-checked");
					})
				}
			});
		}
	}
	//鼠标抬起时触发
	function upFn(ev){
		if(newDiv)newDiv.style.display = "none";
		tools.removeEvent(document,"mousemove",moveFn);	
		tools.removeEvent(document,"mouseup",upFn);
	}
//	鼠标抬起时触发
	function dragUpFn(ev){
		itemId = null;
		if(ev.clientX !=disX||ev.clientY !=disY){
			tools.each(fileItem,function (item,index){
				if( tools.collisionRect(dragDiv,item))	{ //碰上了
					itemId = item.firstElementChild.dataset.fileId;
					arr1 = dataControl.getChildtitleById(datas,itemId);
				}
			});
			moveId = renderId;
			//判断移入的文件夹内是否存在同名文件
			if(!dataControl.contains(IdArr,itemId)&&!dataControl.isCommon(arr1,IdArr)&&itemId!=null){
				moveId = itemId;
				if(IdArr){
					for (var i = 0; i < datas.length; i++) {
						for (var j = 0; j < IdArr.length; j++) {
							if(datas[i].id==IdArr[j]){
								if(moveId!=renderId){
									datas[i].pid = moveId;
									tipsFn("ok","移动成功");
								}
							}
						}
					}
				}
			}else if(dataControl.isCommon(arr1,IdArr)){
				tipsFn("err","移动不成功，要移动到的文件夹内存在同名文件夹");	
			}else if(dataControl.contains(IdArr,itemId)){
				tipsFn("err","移动不成功，目标为自身");
			}else if(itemId ==null){
				tipsFn("err","移动不成功，没有目标地");
			}
			renderNavFilesTree(renderId);	
			tools.removeEvent(document,"mouseup",dragUpFn);
		}
		tools.removeEvent(document,"mousemove",dragMoveFn);
		if(dragDiv) dragDiv.style.display = "none";
//		else if(ev.clientX ==disX&&ev.clientY ==disY){
//		console.log(1111)
//			var target = ev.target;
//			if( tools.parents(target,".item") ){
//				target = tools.parents(target,".item");
//				console.log(isaddClass)
//				var isaddClass = tools.toggleClass(target.firstElementChild,"checked");
//				console.log(isaddClass)
//				if(isaddClass){
//					tools.addClass(target.parentElement,"file-checked");
//				}	
//			}
//			if(tools.parents(target,".item")){
//				target=tools.parents(target,".item");
//				tools.addClass(target.parentElement,"file-checked");
//				tools.addClass(target.firstElementChild,"checked");
//			}
//		}		
	}
}())