
var myRec = new p5.SpeechRec(); // new P5.SpeechRec object
var is_recognition_activated = false;
var cnt = 0;
var timer = 0;


function setup() {

  let canvas = createCanvas(500,500);
  canvas.parent(result);  //canvasを指定した要素の子要素にする

  // スピーチの切れ目があったときに呼び出す関数を登録
  myRec.onEnd = endSpeech;
  // 随時音声入力をテキスト化する際に呼び出される関数を登録
  myRec.onResult = parseResult;
  // 連続した音声認識は行わない．プログラム内で適時音声認識のstopとstartを制御する
  myRec.continuous = true; // no continuous recognition
  // 読み上げている最中の認識途中の文字列も利用する場合
  myRec.interimResults = true; // allow partial recognition (faster, less accurate)
  // プログラム制御用変数（true: 音声認識利用中を示す）
  is_recognition_activated = false;
  // 認識言語は日本語
  myRec.rec.lang = "ja";

}

function draw(){
  timer += 1;
}


// 認識途中随時呼び出される関数（認識途中の文字列を取得できる）
function parseResult() {

  // ここで音の速さの計算
  // prev_str = ''
  // now_str = ''
  // now_str.length - prev_dtr.length
  // 正なら表示

  textSize(16);
  resultString = myRec.resultString
  resultString = conv_text(resultString,16);
  background(255);
  text(resultString,30,30+cnt*25,width-30,height-30);
  var str_size = myRec.resultString.length;
  console.log(str_size);


  // javascript native な記述
  // document.getElementById("label").innerHTML = "speaking...";
  //select('#label').html("speaking...");
  
  // javascritp native な記述
  // document.getElementById("text").value = myRec.resultString;
  //select('#text').value(myRec.resultString);
}

function toggleSpeechRecognition() {
  
  // 認識ステータスを反転させる（trueならfalse，falseならtrue）
  is_recognition_activated = !is_recognition_activated;

  cnt = 0;
  timer = 0;

  // 音声認識アクティベート
  if (is_recognition_activated == true) {
    myRec.rec.lang = "ja"; // 日本語認識
    myRec.start(); // 認識スタート
    }
  // 音声認識を停止させる
  else {
    // 音声認識をとめる
    myRec.rec.stop();
    // ボタンの表示をstartにする
  }
}

function endSpeech() {
  
  // 音声認識アクティベート中なら
  if (is_recognition_activated == true) {
    
    // 認識文字列に何も入っていなければ（タイムアウトでendSpeechになった場合）
    if (!myRec.resultValue) {
      myRec.start();
      return;
    }
    
    // 認識文字列になんか入ってれば
    if (myRec.resultString.length > 0) {
      console.log("End");
      myRec.resultString = "";
      console.log(myRec)
    }
    myRec.start(); // start engine
    console.log("start");
  }
}

function mouseClicked(){
    toggleSpeechRecognition();
}

function conv_text(sliceStr,wCount){
  var addBreakStr = "";
  var restStr = "";
  for (var i = 0; i < sliceStr.length / wCount; i++) {
    str1 = sliceStr.slice(0, wCount);
    str2 = sliceStr.slice(wCount);
    addBreakStr += str1 + '\n';
    sliceStr = str2;
    restStr = sliceStr;
  }
  return (addBreakStr+restStr);
}
