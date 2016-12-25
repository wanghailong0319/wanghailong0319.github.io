var oGround = document.getElementById('ground');
var oControl = document.getElementById('control');
var aSpan = oControl.getElementsByTagName('span');
var oSubImg = createImg();
oSubImg.style.display = "none";
oGround.appendChild(oSubImg);
var fruits =[
			"img/fruit1.png",
			"img/fruit2.png",
			"img/fruit3.png",
			"img/fruit4.png",
			"img/fruit5.png"
			]
//创建一条小蛇
var Snake = [];
for(var i=3;i>0; i--){
	var oImg = document.createElement('img');
	oImg.style.left = i*25+'px';
	oImg.style.top = '100px';
	oImg.className = "block snake-block";
	if(i==3){
		oImg.src = "img/head.png";
	}else if(i==2){
		oImg.src = "img/body.png";
	}else{
		oImg.src = "img/tail.png";
	}
	Snake.push(oImg);
	oGround.appendChild(oImg);
}
//随机设置水果种类及出现的位置
var oFruit,Left,Top,Src;
function fruitPosition(){
		Left = parseInt(Math.random()*64)*25+'px';
		Top = parseInt(Math.random()*32)*25+'px';
		for(var i=0;i<Snake.length;i++){
			if(Snake[i].style.left == Left&& Snake[i].style.top==Top){
				fruitPosition();
			}
		}
		return {
			Left:Left,
			Top:Top,
			Src:fruits[Math.floor(Math.random()*fruits.length)]
		}
}
//创建水果
function createFruit(){
		oFruit = document.createElement('img');
		oFruit.style.left = fruitPosition().Left;
		oFruit.style.top = fruitPosition().Top;
		oFruit.src = fruitPosition().Src;
		oFruit.className = 'block fruit';
		oGround.appendChild(oFruit);
}
createFruit();
//创建一个蛇身IMG
function createImg(){
		var oImg = document.createElement("img");
		oImg.className = "block";
		oImg.src = "img/body.png";
		oImg.style.position = "absolute";
		return oImg;
}
function addImg(tailTop,tailLeft){
		var oImg = createImg();
		oImg.style.top = tailTop;
		oImg.style.left = tailLeft;
		oGround.appendChild(oImg);
		Snake.splice(Snake.length-1,0,oImg);
}
//吃掉水果后计算尾巴现在应有的坐标
function nowTail(headLeft,headTop,tailLeft,tailTop,moveDir){
		if(tailLeft == headLeft||moveDir=="up" || moveDir=="down"){
			if(tailTop>headTop)
				tailTop += 25;
			else if(tailTop<headTop)
				tailTop -= 25;
		}else if(tailTop == headTop||moveDir=="left" || moveDir=="right"){
			if(tailLeft >headLeft)
				tailLeft += 25;
			else if(tailLeft>headLeft)
				tailLeft -= 25;
		}		
		return {
			Top: tailTop,
			Left:tailLeft
			};
}
var sum = 0;//对吃的水果计数
var moveDir = 'right';
function move(){
	//蛇身整体移动
	for(var i=Snake.length-1;i>0;i--){
		Snake[i].style.left = Snake[i-1].style.left;
		Snake[i].style.top = Snake[i-1].style.top;
	}
	var snakeHead = Snake[0];
	var headLeft = parseInt(snakeHead.style.left);
	var headTop = parseInt(snakeHead.style.top);
	//根据蛇移动的方向改变蛇头坐标
	if(moveDir=="left"){
		headLeft -= 25;
	}else if(moveDir=="right"){
		headLeft += 25;
	}else if(moveDir=="up"){
		headTop -= 25;
	}else if(moveDir=="down"){
		headTop += 25;
	}
	snakeHead.style.left = headLeft+'px';
	snakeHead.style.top = headTop+'px';
	Snake[0].id = "h-"+moveDir;
	//与蛇身相撞结束游戏
	for(var i=1;i<Snake.length;i++){
		if(snakeHead.style.left==Snake[i].style.left && snakeHead.style.top==Snake[i].style.top){
			reStart();
		}
	}
	for(var i=1;i<Snake.length-1;i++){
		Snake[i].id = "b-"+moveDir;
	}
	//撞墙游戏结束
	if((snakeHead.style.left == "0px"&&moveDir =="left")|| (snakeHead.style.top =="0px"&&moveDir =="up" )|| (snakeHead.style.top== "800px"&&moveDir =="down" )|| (snakeHead.style.left == "1600px"&&moveDir =="right")){
		reStart();
	}
	var snakeTail = Snake[Snake.length-1];//获取当前的尾巴
	//尾巴的转向，根据前一个的位置设置方向
	if(snakeTail.style.top<Snake[Snake.length-2].style.top){
		snakeTail.id = "t-down";
	}else if(snakeTail.style.top>Snake[Snake.length-2].style.top){
		snakeTail.id = "t-up";
	}
	if(snakeTail.style.left>Snake[Snake.length-2].style.left){
		snakeTail.id = "t-left";
	}else if (snakeTail.style.left<Snake[Snake.length-2].style.left){
		snakeTail.id = "";
	}
	var tailLeft = parseInt(snakeTail.style.left);
	var tailTop = parseInt(snakeTail.style.top);
	//食物达到一定数量吃到SubDiv就减去一段身体，但计数值仍增长				
	var random = parseInt(Math.random()*10); 
	if(sum>6 && oSubImg.style.display=="none"){
		oSubImg.style.display = "block";
		oSubImg.style.left = fruitPosition().Left;
		oSubImg.style.top = fruitPosition().Top;
		if(snakeHead.style.left == oSubImg.style.left && snakeHead.style.top == oSubImg.style.top){
			alert(1)
			snakeTail.style.left = Snake[Snake.length-2].style.left;
			snakeTail.style.top = Snake[Snake.length-2].style.top;
			Snake.splice(Snake.length-3,Snake.length-2);
			oSubImg.style.display = "none";
		}
		var t=setTimeout(function(){
			oSubImg.style.display="none";
		},50000);
	}
	//吃到的食物添加到尾巴的前面，分别改变尾巴和食物的定位坐标值
	if(snakeHead.style.left == oFruit.style.left && snakeHead.style.top == oFruit.style.top){
		tailLeft = snakeTail.style.left;
		tailTop = snakeTail.style.top;
		addImg(tailTop,tailLeft);
		sum++;
		tailTop = nowTail(headLeft,headTop,tailLeft,tailTop,moveDir).tailTop;	
		tailLeft = nowTail(headLeft,headTop,tailLeft,tailTop,moveDir).tailLeft;
		oFruit.style.left = fruitPosition().Left;
		oFruit.style.top = fruitPosition().Top;
		oFruit.src = fruitPosition().Src;
		if(sum>10&&sum<20){//食物达到一定数量有奖励
			addImg(tailTop,tailLeft);
			sum++;	
		}
		tailTop = nowTail(headLeft,headTop,tailLeft,tailTop,moveDir).tailTop;	
		tailLeft = nowTail(headLeft,headTop,tailLeft,tailTop,moveDir).tailLeft;
		if(sum>20&&sum<40){//继续奖励，不过吃的太多也会死的更快
			addImg(tailTop,tailLeft);
			sum++;
		}
		if(sum==60){
			reStart();
		}
		aSpan[0].innerHTML = "已吃食物"+sum+"个";
		tailTop = nowTail(headLeft,headTop,tailLeft,tailTop,moveDir).tailTop;	
		tailLeft = nowTail(headLeft,headTop,tailLeft,tailTop,moveDir).tailLeft;
		snakeTail.style.left = tailLeft+'px';
		snakeTail.style.top = tailTop+'px';	
	}
}
var timer;
var oStart = document.getElementById('start');
oStart.onclick = function(){
	if(this.value == "开始"||this.value == "恢复"){
		this.value = "暂停";
		openTimer();
	}else{
		oStart.value = "恢复"
		clearInterval(timer);
	}
};
var perTime = 300;
//开启定时器
function openTimer(){
	timer = setInterval(function(){//定时器
			move();
		}, perTime);
}
//设置时间间隔，以改变速度
var oSpeed = document.getElementById('speed');
var aInput = oSpeed.getElementsByTagName('input');
aInput[0].onclick = function(){
	clearInterval(timer);
	perTime = 400;
	if(oStart.value=="暂停"){
		openTimer();
	}		
}
aInput[1].onclick = function(){
	clearInterval(timer);
	perTime = 200;
	if(oStart.value=="暂停"){
		openTimer();
	}
}
aInput[2].onclick = function(){
	clearInterval(timer);
	perTime = 60;
	if(oStart.value=="暂停"){
		openTimer();
	}
}
aInput[3].onclick = function(){
	clearInterval(timer);
	if(perTime>=50){
		perTime += 50;
	}
	if(oStart.value=="暂停"){
		openTimer();
	}
}
aInput[4].onclick = function(){
	clearInterval(timer);
	if(perTime<1000){
		perTime -= 50;
	}
	if(oStart.value=="暂停"){
		openTimer();
	}
}
function reStart(){//重新开始
		clearInterval(timer);
		var text;
		if(sum==60){
			text = "成功快关，要进行下一轮吗？"
		}else{
			text ="此次游戏失败，要重新开始吗？"
		}
		var onoff = confirm(text);
		if(onoff){
			window.location.reload();
		}
}
document.onkeydown = function(e){//设置转向
	e = e||window.event;
	var keyCode = e.which || e.keyCode;
	switch (keyCode){
		case 37:
			if(moveDir!="right"){
				moveDir = "left";
			}
		break;
		case 38:
			if(moveDir!="down"){
				moveDir = "up";
			}
		break;
		case 39:
			if(moveDir!="left"){
				moveDir = "right";
			}
		break;
		case 40:
			if(moveDir!="up"){
				moveDir = "down";
			}
		break;
	}
}