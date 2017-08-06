var inputTextArea = null;
var inputColors = null;
var outputColors = null;

runParsing();


function runParsing(){
  inputColors = [];
  parseInpuptJson();
  findColors()

  if( inputColors.length && inputColors[0] !== "undefined" ){
    buildVisualList()
    updateOutput();
  }else{
    document.getElementById( "outputJson" ).value = "";
    cleanColorDiv()
  }
}


function parseInpuptJson(){
  inputTextArea = document.getElementById( "inputJson" ).value;
}


function findColors(){
  var re = /(^[a-zA-Z]+$)|(#(?:[0-9a-f]{2}){2,4}|#[0-9a-f]{3}|(?:rgba?|hsla?)\((?:\d+%?(?:deg|rad|grad|turn)?(?:,|\s)+){2,3}[\s\/]*[\d\.]+%?\))/ig;

  var uniqueColors = {}
  var m;

  do {
    m = re.exec(inputTextArea);
    if (m) {
      inputColors.push( m[2] );
      uniqueColors[ m[2] ] = null;
    }
  } while (m);

  inputColors = Object.keys( uniqueColors )
  outputColors = inputColors.slice();
}


function cleanColorDiv(){
  document.getElementById( "allColors" ).innerHTML = "";
}


function buildVisualList(){
  var allColors = document.getElementById( "allColors" );
  // cleaning all
  allColors.innerHTML = "";

  var template = document.getElementById("colorDivTemplate");
  var templateHtml = template.innerHTML;
  var listHtml = "";

  inputColors.forEach( function(color, index){
    listHtml += templateHtml.replace(/{{id}}/g, "colorbar_" + index)
                            .replace(/{{index}}/g, index)
                            .replace(/{{inputColor}}/g, color)
                            .replace(/{{outputColor}}/g, color)
  })

  allColors.innerHTML = listHtml;
}


function changeColor(el){
  var currentValue = el.value;
  var parent = el.parentNode;
  var index = parent.parentNode.getAttribute( "index");
  parent.style.background = currentValue;

  outputColors[index] = currentValue;

  updateOutput();
}


function updateOutput(){
  var inputCopy = inputTextArea;

  if( !inputCopy )
    return;

  for(var i=0; i<inputColors.length; i++){
    inputCopy = replaceAll(inputCopy, inputColors[i], outputColors[i])
  }

  console.log( inputCopy );

  document.getElementById( "outputJson" ).value = inputCopy;

}


function escapeRegExp(str) {
    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}
