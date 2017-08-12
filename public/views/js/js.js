$(document).ready(function(){
  $(".bot .span2").click(function(){
    $(".zs").slideUp();
    $(".bot .span2").hide();
    $(".bot .span1").show();
  });
  $(".bot .span1").click(function(){
    $(".zs").slideDown();
    $(".bot .span1").hide();
    $(".bot .span2").show();
  });
  $(".bjx").click(function(){
    $(".nbyu").hide();
    $(".nb-more").show();
  });
  $(".quxi").click(function(){
    $(".nbyu").show();
    $(".nb-more").hide();
  });
  $(".del").click(function(){
    $(".del-popWrap").show();
  });
  $(".del-pop button").click(function(){
    $(".del-popWrap").hide();
  });
   $(".tja").click(function(){
    $(".tian-popWrap").show();
  });
   $(".tian-pop button").click(function(){
    $(".tian-popWrap").hide();
  });
   $(".bxg").click(function(){
    $("#tian-popWrap").show();
  });
   $(".tian-pop button").click(function(){
    $("#tian-popWrap").hide();
  });
    $(".tian-pop img").click(function(){
    $("#tian-popWrap").hide();
  });
    $(".tian-pop img").click(function(){
    $(".tian-popWrap").hide();
  });
  $(".youg").click(function(){
    $(".youg").hide(); 
    $(".you").show(); 
  });   
   $(".you").click(function(){
    $(".you").hide(); 
    $(".youg").show(); 
  });
    $(".zuog").click(function(){
    $(".zuog").hide(); 
    $(".zuo").show(); 
  });   
  $(".zuo").click(function(){
    $(".zuo").hide(); 
    $(".zuog").show(); 
  });




 $('#quanxuan').onclick = function() {
      var obj = document.getElementsByTagName('input'); //获取文档中所有的input元素
      for (var i = 0; i < obj.length; i ++) {
          if (obj[i].type == 'checkbox') {
              obj[i].checked = true; //设置复选框元素对象的checked属性值为true就能勾选该复选框；false即为取消选择
          }
      }
  }



  $("table tr").click(function(){
        var input = $(this).find("input[type=checkbox]");//获取checkbox   
         
        //判断当前checkbox是否为选中状态
        if(input.is(":checked")){          
            input.attr("checked",false);
        }else{
            input.attr("checked",true);
        }
         
    }) 

    
});