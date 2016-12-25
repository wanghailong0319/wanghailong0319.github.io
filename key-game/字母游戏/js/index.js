window.onload = function(){
			var Obtn = document.getElementById('btn');
			var Oscore = document.getElementById('score');
			var container = document.getElementById('container');
			var runLetter = document.getElementById('letter');
			var Obox = document.getElementById('box');
			var Ap = Oscore.getElementsByTagName('p');
			var speedTime = 5000;
			var winNum = 0; 
			var loseNum = 0;
			var n=0;
			Obtn.onclick = function(){
				this.disabled = true;
				changeLetter();
			}
			document.onkeypress = function(e){
				console.log(e.keyCode,datas[n].num)
				if(e.keyCode==datas[n].num){
					clearInterval(runLetter.top);
					shake(runLetter,"left",10,function (){
							winNum++;
							Ap[0].innerHTML = "得分："+winNum+" 分";
							if(winNum>=16){
									alert("恭喜，你过关了！");
									recover();
							}else{
								changeLetter();
							}
					})
				}
			}
			function changeLetter(){
					var L = Math.round( Math.random() * 770 );
					 n = Math.round( Math.random() * datas.length);
					runLetter.style.left = L + "px";
					runLetter.style.top = 0;
					runLetter.innerHTML = datas[n].title;
					speedTime -= 100;
					if( speedTime <= 100 ){
						speedTime = 100;
					}
					mTween(runLetter,"top",800,speedTime,"linear",function (){
							shake(Obox,"top",10,function (){
								loseNum++;
								Ap[1].innerHTML = "失分："+loseNum+" 分";
								if(loseNum>=16){
									alert("game over,请重新开始");
									recover();
								}else{
									changeLetter();
								}
							});
					});		
				}
			function recover(){
				speedTime = 5000;
				winNum = 0; 
				loseNum = 0;
				Obtn.disabled = false;
				runLetter.style.top = '-30px';
				Ap[0].innerHTML = "得分：0 分"
				Ap[1].innerHTML = "失分：0 分"
		
			}
		
		}