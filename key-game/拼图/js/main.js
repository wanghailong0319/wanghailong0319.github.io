
// 随机block
var SUCCESS = [1,2,3,4,5,6,7,8,0];
var emptyPosition = 7; // 空格的位置
var randomPosition = [];
var step = 0;
function randomBlock(){
    step = 0;
    $(".step").html(step);
    var arr = $.extend([],SUCCESS);
	for(var j, x, i = arr.length; i; j = parseInt(Math.random() * i), x = arr[--i], arr[i] = arr[j], arr[j] = x);
    randomPosition = arr;
    for (var i in arr) {
        if(arr[i]==0){
            emptyPosition = parseInt(i) ;
        }
        $("#main>div").eq(arr[i]).attr('data-index',i).css({
            left : 100 * (i%3),
            top : 100 * (Math.floor(i/3))
        })
    }
}
//更换背景图片
function change(){
    var random = Math.round(Math.random()*9+1);
    $('.answer,.block').css('background-image','url(img/bg_'+ random +'.jpg)');
    randomBlock();
}

function updatePosition(p1,p2){
    var tmpl = [];
    var end = ['8','0','1','2','3','4','5','6','7'];

    emptyPosition = p2;
    step ++;
    $(".step").html(step);
    $("#main>div").each(function(){
        tmpl.push($(this).attr('data-index'));
    });

    if(tmpl.toString() == end.toString()){
        $("#success").show();
    }
}
//向上移动
function up(){
    if (emptyPosition < 6) {//空格没有在最后一排
        var targetIndex = parseInt(emptyPosition) + 3 ;
        $("#main div[data-index='"+ targetIndex +"']").animate({
            top : '-=100px'
        },100,function(){
            $(this).attr('data-index',emptyPosition)
        });
        $("#main>div[data-index='"+ emptyPosition +"']").animate({
            top : '+=100px'
        },100,function(){
            $(this).attr('data-index',targetIndex);
            updatePosition(emptyPosition,targetIndex);
        });

    }
}
//向下移动
function down(){
    if (emptyPosition > 2) {//空格没有在第一排
        var targetIndex = parseInt(emptyPosition) - 3 ;
        $("#main div[data-index='"+ targetIndex +"']").animate({
            top : '+=100px'
        },100,function(){
            $(this).attr('data-index',emptyPosition)
        });

        $("#main>div[data-index='"+ emptyPosition +"']").animate({
            top : '-=100px'
        },100,function(){
            $(this).attr('data-index',targetIndex);
            updatePosition(emptyPosition,targetIndex);

        });
    }
}
//向左移动
function left(){
    if(emptyPosition%3<2){//空格没有在第一列
        var targetIndex = parseInt(emptyPosition) + 1 ;
        $("#main>div[data-index='"+ targetIndex +"']").animate({
            left : '-=100px'
        },100,function(){
            $(this).attr('data-index',emptyPosition)
        });

        $("#main>div[data-index='"+ emptyPosition +"']").animate({
            left : '+=100px'
        },100,function(){
            $(this).attr('data-index',targetIndex);
            updatePosition(emptyPosition,targetIndex);
        });

    }
}
//向右移动
function right(){//空格没有在最后一列
    if(emptyPosition%3>0){
        var targetIndex = parseInt(emptyPosition) - 1 ;
        $("#main>div[data-index='"+ targetIndex +"']").animate({
            left : '+=100px'
        },100,function(){
            $(this).attr('data-index',targetIndex+1)
        });

        $("#main>div[data-index='"+ emptyPosition +"']").animate({
            left : '-=100px'
        },100,function(){
            $(this).attr('data-index',targetIndex);
            updatePosition(emptyPosition,targetIndex);
        });
    }
}

$(document).ready(function(){
    change();
}).on('keypress',function(e){
	console.log(e.keyCode)
    if(!$("#main>div").is(":animated")) {
        switch (e.keyCode) {
            case 119: //上
                up();
                break;
            case 115: //下
                down();
                break;
            case 97: //左
                left()
                break;
            case 100: //右
                right();
                break;
            default:
                return;
        }
    }
}).on('click','.reset',function(){
    randomBlock();
    $("#success").hide();
}).on('click','#showNum',function(){
    $("#main>div>span").toggle();
}).on('click','#showAnswer',function(){
    $(".answer").toggle();
}).on('click','#change',function(){
    change();
});

