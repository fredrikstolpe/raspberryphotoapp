var glitch = require("./glitchservice.js");

glitch
.turquoise("t1.jpg","turquoise.jpg")
.then(
  function(){
    return glitch.red("t1.jpg","red.jpg")
  }
)
.then(
  function(){
    return glitch.glitch2("turquoise.jpg","turquoiseg.jpg");
  }
)
.then(
  function(){
    return glitch.glitch2("red.jpg","redg.jpg");
  }
)
.then(
  function(){
    return glitch.glitch2("t1.jpg","glitched.jpg");
  }
)
.then(
  function(){
    return glitch.darken("redg.jpg","turquoiseg.jpg","merged.jpg");
  }
)
//.glitch2("t1.jpg","test.jpg")
.then(
  function(result){console.log(result)}
);

/*.glitch1("agaton.jpg","agaton2.jpg")
.then(
function(result){console.log(result)},
function(error){console.log(error)}
);*/

/*
var child_process = require("child_process");

var command = "convert t1.jpg -region x233+0+100 -roll +40+0 -region 400x135+40+150 -negate -region x33+0+300 -roll +80+0 -region x253+0+400 -channel Blue -evaluate set 0 +channel -region x153+0+430 -roll +40+0 test.jpg";

command1 = "convert agaton.jpg -lat 50x50 -colors 2 test1.gif";

command = "convert agaton.jpg -lat 100x100 -black-threshold 50% -fill turquoise1 -opaque black -roll -40+0 -region x23+0+200 -roll +40+0  test.jpg";

command2 = "convert agaton.jpg -lat 100x100 -black-threshold 50% -fill red2 -opaque black -roll +40+0 -region x233+0+100 -roll +40+0 test2.jpg";

command3 = "composite test.jpg test2.jpg -compose darken test2.jpg";

child_process.exec(command1, function(error, stdout, stderr){
  console.log(error);
  child_process.exec(command, function(error, stdout, stderr){
    child_process.exec(command2, function(error, stdout, stderr){
    child_process.exec(command3, function(error, stdout, stderr){
      console.log(error);
    })
    })
  })  
})
*/
