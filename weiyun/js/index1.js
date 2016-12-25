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
	
//	每次可视区域改变时重新加载
	window.onresize = changeHeight;
	
//	需要准备的数据
	var datas = data.files;
	
//加载渲染文件区域
	var renderId = 0;
	var maxId ="";
	var moveId =renderId;
	var fileItem = tools.$(".file-item",fileList);
	var checkboxs = tools.$(".checkbox",fileList);
	var fileList = tools.$(".file-list")[0];
	var treeMenu = tools.$(".tree-menu")[0];
	var pathNav = tools.$(".path-nav")[0];
	var empty = tools.$(".g-empty")[0];
	renderNavFilesTree();
	
//给单独一个文件添加事件处理
	function fileHandle(item){	
			var checkbox = tools.$(".checkbox",item)[0];
			//给每一个文件添加鼠标移入事件
			item.onmouseenter = function(){
				tools.addClass(this,"file-checked");
			}
			//给每一个文件添加鼠标移出事件
			item.onmouseleave = function(){
				if( !tools.hasClass(checkbox,"checked") ){
					tools.removeClass(this,"file-checked");
				}
			}
			//给checkbox添加点击处理
			checkbox.onclick = function(ev){
				isCheckedAll(this);
				contentMenu.style.display = "none";
				ev.cancelBubble = true;
			}
			//给每个文件夹添加鼠标双击事件
			item.ondblclick = function(e){
				renderId = this.firstElementChild.dataset.fileId;
				renderNavFilesTree(renderId);
				tools.removeClass(checkedAll,"checked");
				e.cancelBubble = true;
			}
			//给每一个文件添加鼠标点击事件
			item.onclick = function(e){
				isCheckedAll(this.firstElementChild.firstElementChild);
				contentMenu.style.display = "none";
				e.cancelBubble = true;
			}
			//给每一个文件绑定鼠标按下事件
			tools.addEvent(item.firstElementChild,"mousedown",itemDown)
	}
	
//判断是否全选
	function isCheckedAll(node){
			var isaddClass = tools.toggleClass(node,"checked");
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
			var fileItem = tools.$(".file-item",fileList);
			for (var i = 0; i < checkboxs.length; i++) {
				if(tools.hasClass(checkboxs[i],"checked")){
					arr.push(fileItem[i]);
				}
			}
			return arr;
	}
	
//操作完成后，树形菜单的重新展示方法
	function renderTreeNew(){
			console.log(1111)
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
			var parents = dataControl.getParents(datas,renderId).reverse();
			var ellipsis = tools.$(".ellipsis");
			//渲染完成后操作DOM
			for (var i = 0; i < parents.length-1; i++) {
				for (var j = 0; j < ellipsis.length; j++) {
					if(ellipsis[j].innerHTML==parents[i].title){
						tools.addClass(ellipsis[j].parentElement.parentElement,"tree-contro")
					}
				}
			}
	}
	
//渲染内容区域的方法
	function renderNavFilesTree(){
			fileItem = tools.$(".file-item",fileList);
			checkboxs = tools.$(".checkbox",fileList);
			//渲染文件导航
			pathNav.innerHTML = renderPathNav(datas,renderId);
			var navAs = tools.$("a",pathNav);
			for (var i = 0; i < navAs.length; i++) {
				navAs[i].onclick = function(){
					renderId = this.dataset.fileId;
					renderNavFilesTree(renderId);
				}
			}
			//渲染文件内容区域，如果指定的id没有子数据，需要提醒
			fileList.innerHTML ="";
			var hasChild =dataControl.hasChilds(datas,renderId);
			if( hasChild ){  //如果有子数据，就渲染出子数据的结构
				empty.style.display = "none";
				fileList.innerHTML = renderFilesHtml(datas,renderId);
			}else{
				empty.style.display = "block";
			}
			var fileItem = tools.$(".file-item",fileList);
			for (var i = 0; i < fileItem.length; i++) {
				fileHandle(fileItem[i]);
			}
			//渲染树形菜单区域
			treeMenu.innerHTML = renderTreeMenu(datas,-1);
			positionTreeById(renderId);
			var treeTitles = tools.$(".tree-title",treeMenu);
			var checkboxs = tools.$(".checkbox",fileList);
			for (var i = 0; i < treeTitles.length; i++) {
				treeTitles[i].onclick = function(){
					renderId = this.dataset.fileId;
					renderNavFilesTree(renderId);
				}
			}
			renderTreeNew();
}	

	var checkedAll = tools.$(".checked-all")[0];
//给全选按钮添加事件
	checkedAll.onclick = function(){
			var fileItem = tools.$(".file-item",fileList);
			var checkboxs = tools.$(".checkbox",fileList);
			var isAddClass = tools.toggleClass(this,"checked");
			if(isAddClass){
				for (var i = 0; i < fileItem.length; i++) {
					tools.addClass(fileItem[i],"file-checked");
					tools.addClass(checkboxs[i],"checked")
				}
			}else{
				for (var i = 0; i < fileItem.length; i++) {
					tools.removeClass(fileItem[i],"file-checked");
					tools.removeClass(checkboxs[i],"checked")
				}
			}
	}
	
	
	var move = tools.$(".move")[0];
	var bg = tools.$(".bg")[0];
	var rename = tools.$(".rename")[0];
	var delect = tools.$(".delect")[0];
	var create = tools.$(".create")[0];
	
//新建文件夹
	create.onclick = createFile;
	function createFile(e){
			empty.style.display="none";
			maxId = Number(dataControl.getMaxId(datas));
			var title = "";
			var newFileData = {
				id:maxId+1,
				pid:renderId,
				title:title
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
			contentMenu.style.display = "none";
			e.cancelBubble = true;
	}
	
//删除文件夹
	delect.onclick = deletFile;
	function deletFile(e){
			var filechecked =tools.$(".file-checked",fileList);
			console.log(filechecked)
			if(filechecked.length ==0){
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
			tools.removeClass(checkedAll,"checked");
			contentMenu.style.display = "none";
			e.cancelBubble = true;
	}
	
//给文件夹重命名
	rename.onclick = renameFile;
	function renameFile(e){
			var checkedboxs =tools.$(".checked",fileList);
			if(checkedboxs.length ==0){
				tipsFn("err","当前没有选中的文件夹，请选择要重命名的文件夹");
			}else if(checkedboxs.length >=2){
				tipsFn("err","每次只能为一个文件夹重命名,请重新选择");
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
			contentMenu.style.display = "none";
			e.cancelBubble = true;
	}
	
//移动文件夹的位置
	var moveTo = tools.$(".moveTo")[0];
	var IdArr =[];
	var checkedIdArr =[];
	var fileTitles;
	move.onclick = moveFile;
	function moveFile(e){
			IdArr =[];
			fileTitles = tools.$(".file-checked .file-title",fileList)
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
				moveTo.innerHTML = renderTreeMenu(datas,-1);
				bg.style.display = "block";
				bg.style.width = document.documentElement.clientWidth+"px";
				bg.style.height = document.documentElement.clientHeight+"px";
			}
			contentMenu.style.display = "none";
			e.cancelBubble = true;
	}
	var moveId,moveArr ;
	moveTo.onclick = function(ev){
			var target = ev.target;
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
							}
						}
					}
					tipsFn("ok","移动成功");
				}else{
					console.log(isName())
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
						tipsFn("ok","移动成功");
					}
				}
			}
			renderNavFilesTree(renderId);
			ev.cancelBubble = true;
			bg.style.display = "none";
			IdArr=[];
	}
//判断是否同名
	function isName(){
			for (var i = 0; i < fileTitles.length; i++) {
				for (var j = 0; j < moveArr.length; j++) {
					if(moveArr[j].title==fileTitles[i].innerHTML){
						return true;
						break;
					}
				}
			}
			return false;
	}

//鼠标在document上按下的几种情况
	document.onmousedown = function(ev){
			if( create.isCreateFile ){  //如果为true，说明正在创建文件
				var firstElement = fileList.firstElementChild;
				var edtor = tools.$(".edtor",firstElement)[0];
				var value = edtor.value.trim();
				if( value === "" ){
					fileList.removeChild(firstElement);
					if( fileList.innerHTML === "" ){
						empty.style.display = "block";
					}
					tipsFn("err","新建文件夹不成功,没有输入新建的文件夹名称")
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
						title:value
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
					tools.removeClass(checkedAll,"checked");
				}
				create.isCreateFile = false;  //无论创建成不成功，状态都要设为false
			}else if(rename.isRenameFile){//如果为true，说明正在重命名文件
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
			}else{
				var target = ev.target;
				if(ev.which==1&&!tools.parents(target,".content-menu")){
					mouseDown(ev);
				}
			}
			ev.preventDefault();
	}
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
	var contentMenu = tools.$(".content-menu")[0];
	var contentCreate = tools.$(".create",contentMenu)[0];
	var contentDelect = tools.$(".delect",contentMenu)[0];
	var contentRename = tools.$(".rename",contentMenu)[0];
	var contentMove = tools.$(".move",contentMenu)[0];
	var treeRightX = treeMenu.offsetWidth;
	var pathNavBoxY = pathNav.offsetTop+pathNav.offsetHeight;
	document.oncontextmenu = function(e){
		if(whoSelect().length==0){
			tools.addClass(contentDelect,"forbidden")
			tools.addClass(contentRename,"forbidden")
			tools.addClass(contentMove,"forbidden")
		}else{
			tools.removeClass(contentDelect,"forbidden")
			tools.removeClass(contentRename,"forbidden")
			tools.removeClass(contentMove,"forbidden")
		}
		contentMenu.style.display = "block";
		contentMenu.style.left=e.clientX+"px";
		contentMenu.style.top=e.clientY+"px";
		e.preventDefault();
		e.stopPropagation();
	}
	contentCreate.onclick = createFile;
	contentDelect.onclick = deletFile;
	contentRename.onclick = renameFile;
	contentMove.onclick = moveFile;
	//框选/移动功能
	var newDiv = null;
	var dragDiv = null;
	var startX,endxX,startY,endY,IdArr,titleArr,itemId,arr1,touch;
//鼠标在document按下时执行
	function mouseDown(ev){
				startX = ev.clientX;
				startY = ev.clientY;
				var target = ev.target;
				if(tools.parents(target,".nav-a")||tools.parents(target,".item")) return;
				if(startX<treeRightX||startY<pathNavBoxY){
					ev.preventDefault();
					return;
				}
				tools.addEvent(document,"mousemove",moveFn);
				tools.addEvent(document,"mouseup",upFn);
				ev.preventDefault();
	}
//	框选移动的时候触发的函数
	function moveFn(ev){
			if( Math.abs(ev.clientX - startX) > 10 || Math.abs(ev.clientY - startY) > 10 ){
				if( !newDiv ){
					newDiv = document.createElement("div");
					newDiv.className = "selectTab";
					document.body.appendChild(newDiv);
				}
				newDiv.style.width = 0;
				newDiv.style.height = 0;
				newDiv.style.display = "block";
				newDiv.style.left = startX + "px";
				newDiv.style.top = startY + "px";
				endX = ev.clientX;
				endY = ev.clientY;
				if(endX<=treeRightX)endX=treeRightX;
				if(endY<=pathNavBoxY)endY=pathNavBoxY;
				var w = endX - startX;
				var h = endY - startY;
				newDiv.style.width = Math.abs(w) + "px";
				newDiv.style.height = Math.abs(h) + "px";
				//鼠标移动的过程中的clientX和在鼠标摁下的disX，哪一个小就把这个值赋给newDiv
				newDiv.style.left = Math.min(endX,startX) + "px";
				newDiv.style.top = Math.min(endY,startY) + "px";
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
//	鼠标抬起时触发
	function upFn(ev){
			if(ev.clientX==startX&&ev.clientY==startY){
				tools.removeClass(checkedAll,"checked")
				contentMenu.style.display = "none";
				bg.style.display = "none";
		        renderNavFilesTree(renderId);
			}
			if(newDiv)newDiv.style.display = "none";
			tools.removeEvent(document,"mousedown",mouseDown);
			tools.removeEvent(document,"mousemove",moveFn);	
			tools.removeEvent(document,"mouseup",upFn);
	}
//	鼠标在文件夹上按下时触发
	function itemDown(ev){
			startX = ev.clientX;
			startY = ev.clientY;
			var target =ev.target;
			target = tools.parents(target,".item");
			touch = target;
			tools.addEvent(document,"mousemove",dragMoveFn);
			tools.addEvent(document,"mouseup",dragUpFn);
			ev.stopPropagation();
			ev.preventDefault();
	}
//拖拽移动的时候触发的函数
	var itemId = null;
	var arr1 = [];
	function dragMoveFn(ev){
			if( Math.abs(ev.clientX - startX) > 10 || Math.abs(ev.clientY - startY) >10 ){
				var fileItems = tools.$(".file-item",fileList);
				var checkBoxs = tools.$(".checkbox",fileList);
				IdArr = [];
				titleArr=[];
				if(!tools.hasClass(touch.firstElementChild,"checked")){
					tools.each(fileItems,function(item,index){
						tools.removeClass(item,"file-checked");
						tools.removeClass(checkBoxs[index],"checked");
					})
					tools.addClass(touch.parentElement,"file-checked");
					isCheckedAll(touch.firstElementChild);
					IdArr.push(touch.dataset.fileId);
					titleArr.push(tools.$(".file-title",touch)[0].innerHTML);
				}else{
					var checkeds = tools.$(".checked",fileList);
					tools.each(checkeds,function(item,index){
						IdArr.push(item.parentElement.dataset.fileId);
						titleArr.push(tools.$(".file-title",item.parentElement)[0].innerHTML);
					})
				}
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
	
//	鼠标抬起时触发
	function dragUpFn(ev){
			if(ev.clientX !=startX&&ev.clientY !=startY){
				itemId = null;
				tools.each(fileItem,function (item,index){
					if( tools.collisionRect(dragDiv,item))	{ //碰上了
						itemId = item.firstElementChild.dataset.fileId;
						arr1 = dataControl.getChildtitleById(datas,itemId);
					}
				});
				//判断移入的文件夹内是否存在同名文件
//				console.log(IdArr,itemId,arr1,titleArr,itemId!=null)
				if(!dataControl.contains(IdArr,itemId)&&!dataControl.isCommon(arr1,titleArr)&&itemId!=null){
					moveId = itemId;
					for (var i = 0; i < datas.length; i++) {
						for (var j = 0; j < IdArr.length; j++) {
							if(datas[i].id==IdArr[j]){
								datas[i].pid = moveId;
								tipsFn("ok","移动成功");
							}
						}
					}
					renderNavFilesTree();
				}else if(dataControl.isCommon(arr1,titleArr)){
					tipsFn("err","移动不成功，要移动到的文件夹内存在同名文件夹");	
				}else if(dataControl.contains(IdArr,itemId)){
					tipsFn("err","移动不成功，目标为自身");
				}else if(itemId ==null){
					tipsFn("err","移动不成功，没有目标地");
				}
			}
			if(dragDiv) dragDiv.style.display = "none";
			tools.removeEvent(document,"mousemove",dragMoveFn);
			tools.removeEvent(document,"mouseup",dragUpFn);
	}
}())