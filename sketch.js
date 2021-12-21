let dish_images = new Array(5);
let sushi_images = new Array(5);

class Dish{
    init(){
        this.x = -200;
        this.y = 460 ;
        this.frame = 0;
        this.sara = 0;
        this.mode = 0;
        this.sushi = 0;
        this.speed = 0;
    }
    move(){
        let t_x = this.sushi * (190+50) + 250 ;
        this.speed = t_x / 15;
        if(this.mode == 1){
            if(this.frame < 15){
                this.x += this.speed;
                this.frame += 1;
            }
        }
        else if(this.mode == 2){
            if(this.frame < 15){
            this.x -= this.speed;
            this.frame += 1;
            }
        }
        else if(this.mode == 3){
            this.speed = (width+200) / 300;
                this.x -= this.speed;
                if(this.x < -200){
                    this.x = width+200;
                }
                this.frame += 1;
        }
        
    }
    draw(){
        if(this.mode < 3){
        image(dish_images[this.sara],this.x,this.y,190,160);
        }
        else if(this.mode == 3){
            image(dish_images[this.sara],this.x,this.y,190,160);
            image(sushi_images[this.sushi],this.x,this.y-10,190,160);
        }
    }
}


let mask_images = new Array(5);
let dishes = new Dish(5);
let bgs = new Array(2);
let mode;
let cnt;
let flag;
let xhr;
let heartrate;
let sushi_clicked = [0,0,0,0,0];
let sushi_names = [];
let neta = ['鮪','イ','海','玉','河'];
let fulneta = ['鮪','いくら','海老','玉子','河童'];
let juni = ['1st','2nd','3rd','4th','5th'];
let rectsize,sushi_score;
let maxid,max,is_mic_activated;
let bg,bg2,star,tumami,heart,material,Vt,myfont,sound,fft,spectrum,myRec,mic,id,result_str,str_size,recframe;
let tumamix1,tumamix2;
let txt1,txt2;
let pi = 3.14159;
let temp = [];

function parseResult() {

    result_str = myRec.resultString
    str_size = myRec.resultString.length;

    /*console.log(Vt.Strs);
    console.log(Vt.now_cnt);
    console.log(str_size);
    console.log(result_str);
    console.log(Vt); */

    // 新しい文字が入力されたとき
    if(Vt.now_cnt < str_size){
        //文字を追加
        for(let i=Vt.now_cnt;i<str_size;i++){
            //let volume = mic.getLevel();
            let volume = 18;
            //volume = map(5*volume,0,1,10,40);
            Vt.textSizes.push(volume);
            let ids = Vt.cnt + i;
            Vt.Strs += result_str.substring(i,i+1);
            let temp_sum = 0;
            for(let j=0;j<i;j++){
                temp_sum += Vt.textSizes[j];
            }
            Vt.x.push(829 + temp_sum%Vt.width);
            if(i<=1 && Vt.cnt == 0){
                Vt.y.push(0);
            }
            else if(i==0){
                Vt.y.push(Vt.y[Vt.y.length-1]+1);
            }
            else if(Vt.width < temp_sum){
                let temp_y = (Vt.y[Vt.cnt]) + Math.floor((temp_sum)/Vt.width);
                Vt.y.push(temp_y);
            }
            else
            {
                //行数に変化なし
                Vt.y.push(Vt.y[Vt.y.length-1]);
            }
            

        }
        Vt.now_cnt = str_size;
        
    }
    else if(Vt.now_cnt == str_size){
        //Stay
    }
    else{
        //音声文字の入力が途絶えたとき 次の入力を1行下に。
        
    }
    temp.push(str_size);
    console.log(result_str);
  
  }

  function togglemic(){
    is_mic_activated = !is_mic_activated;
    if (is_mic_activated == true) {
        mic.start();
        fft.setInput(mic);
        }
      else {
        // 音声認識をとめる
        mic.stop();
      }
  }
  
  function toggleSpeechRecognition() {
    
    // 認識ステータスを反転させる（trueならfalse，falseならtrue）
    is_recognition_activated = !is_recognition_activated;
  
    cnt = 0;
    timer = 0;
  
    // 音声認識アクティベート
    if (is_recognition_activated == true) {
      myRec.rec.lang = "ja"; 
      myRec.start(); 
      recframe = 0;
      }
    else {
      // 音声認識をとめる
      myRec.rec.stop();
      Vt.init();
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
        if(Vt.now_cnt == myRec.resultString.length){
            Vt.cnt += Vt.now_cnt;
            Vt.now_cnt = 0;
        }
        console.log(Vt.cnt);
        console.log("End");
        myRec.resultString = "";
        console.log(myRec)
      }
      myRec.start();
      console.log("start");
    }
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
  

function preload(){
    let sushi_names = ['images/maguro.png','images/ikura.png','images/ebi.png','images/tamago.png','images/kappa.png'];
    let bg_names = ['images/bg2.png','images/bg2.png'];
    for(let i=0;i<5;i++){
        sushi_images[i] = loadImage(sushi_names[i]);
        dish_images[i] = loadImage('images/dish' + (i+1) + '.png');
    }
    for(let i=0;i<2;i++){
        bgs[i] = loadImage(bg_names[i]);
    }
    heart = loadImage('images/heart.png');
    material = loadImage('images/material.png');
    bg = loadImage('images/bg.jpg');
    bg2 = loadImage('images/bg2.png');

    tumami = loadImage('images/tumami.png');
    star = loadImage('images/star.png');
    material = loadImage('images/material.png');
    logo = loadImage('images/logo.png');
    txt1 = loadImage('images/title_text.png');
    txt2 = loadImage('images/select_text.png');
    myfont = loadFont('fonts/SawarabiGothic-Regular.ttf');
    //sound = loadSound('sounds/melonsoda.wav');
}

class VoiceText{
    init(){
        this.textSizes = [];
        this.Strs = '';
        this.x = [];  //i文字目のx座標
        this.y = [];  //i文字目のy座標
        this.width = 214;
        this.now_cnt = 0; //今の認識で何文字目まで書かれているか。
        this.cnt = 0; //テキストが今何文字まで書かれているか。
        this.pause = 0; //音声が何回途絶えたか。
    }

    draw_n(n){
        /*
        let temp_sum = 0;
        for(let i=0;i<n;i++){
            temp_sum += this.textSizes[i];
        }
        let x = (temp_sum %this.width);
        let y = Math.floor((temp_sum / this.width)); */

        textSize(this.textSizes[n]);
        text(this.Strs[n],this.x[n],(this.y[n]*40 + 70));
    }

    draw_all(){
        let l = this.Strs.length;
        for(let i=0;i<l;i++){
            this.draw_n(i);
        }
    }
}

function init(){
    mode = 0;
    cnt = 0;
    recframe = 0;
    str_size = 0;
    sushi_score = 0;
    tumamix1 = 1140;
    tumamix2 = 1140;
    max = -10000;
    flag = false;
    result_str = '';
    for(let i=0;i<5;i++){
        dishes[i] = new Dish();
        dishes[i].init();
        dishes[i].sushi = i;
        dishes[i].sara = i;
        dishes[i].mode = 3;
        dishes[i].x = width + 200 + i * (240);
        //dishes[i].init();
    }
    textFont(myfont);
    xhr = new XMLHttpRequest();
    Vt = new VoiceText();
    Vt.init();
    mic = new p5.AudioIn();
    fft = new p5.FFT();
    myRec = new p5.SpeechRec(); 
    // スピーチの切れ目があったときに呼び出す関数を登録
    myRec.onEnd = endSpeech;
    myRec.onResult = parseResult;
    myRec.continuous = false;
    myRec.interimResults = true; // 読み上げている最中の認識途中の文字列も利用する場合
    is_recognition_activated = false; 
    is_mic_activated = false;
    myRec.rec.lang = "ja";   // 認識言語は日本語
}

function setup(){
    let canvas = createCanvas(1280,800);
    canvas.parent('result');
    init();
//    sound.loop();
    frameRate(30);
}

function reflect(x){
    if(x < 1280){
        if(0<x){
            x = x;
        }
        else{
            x *= -1;
        }
    }
    else {
        x = 2560-x;
        if(x<0){
            x *= -1;
        }

    }
    return x;
}

function draw(){
    //background(255);
    image(bg2,0,0,width,height);
    index = cnt%30;

    if(!(cnt%270)){

    //xhr.open('GET', 'https://jsonplaceholder.typicode.com/todos/');
    xhr.open('GET','http://192.168.100.1:8080');
    //xhr.setRequestHeader("Access-Control-Allow-Origin", "http://192.168.100.1:8080");
    xhr.send();
     
    xhr.onreadystatechange = function() {
        if(xhr.readyState === 4 && xhr.status === 200) {
            
            responseJson = JSON.parse(xhr.responseText)
            console.log(responseJson);
            //heartrate = responseJson[0].userId;
            heartrate = responseJson.hr1[0];
            console.log(heartrate);
            }
        }
    }

    //mode0ならタイトル画面
    if(mode == 0){
        
        //alpha = 122.5 + 122.5*sin(2*pi/(2*cnt%30));
        //textSize(25);
        //fill(0,0,0,alpha);
        //text('aボタンを押してスタート.',width/2-120,height/2+15);
        image(txt1,width/2-195,height/2-50,415,90);
        fill(0);
        image(logo,width/2-400,height/2-495,800,570)
//        textSize(60);
//        text('タイトル',width/2-120,height/2);
        /*
        for(let i=0;i<5;i++){
            let x = (1280 + (cnt*2) + i*50)%2560;
            x = reflect(x);
            let y = 200*sin(pi/360*x) + 400;
            image(sushi_images[i],x,y,100,80);
        }

        
        for(let i=0;i<5;i++){
            let x = ((cnt*2) + i*50)%2560;
            x = reflect(x);
            let y = 200*sin(pi/360*x) + 400;
            image(sushi_images[i],x,y,100,80);
        } */

        /* 皿と寿司の移動 */
        for(let i=0;i<5;i++){
            dishes[i].move();
            dishes[i].draw();
        }

    }

    //mode1なら寿司選択画面
    else if(mode == 1){
        image(txt2,width/2-420,220,900,200);
        //textSize(60);
        //text('左クリックでネタを選んでね！',width/2-420,300);
        //textSize(30);
        //text('取り消しもできるよ',width/2-160,340);
        let start_x = width/2 - 100;
        let start_y = height/2 -100;
        for(let i=0;i<5;i++){
            dishes[i].move();
            dishes[i].draw();
            if(sushi_clicked[i]){
                //fill(255,0,0,90);
                //noStroke();
                //rect(i*190+50+i*50,450,190,160);
                //image(dish_images[i],i*190+50+i*50,460,190,160);
                image(sushi_images[i],i*190+55+i*50,440,200,170);         
            }
            else{
                //fill(255,255,255,255*0.78);
                //noStroke();
                //rect(i*190+50+i*50,450,190,160);
                //image(dish_images[i],i*190+50+i*50,460,190,160);  
                image(sushi_images[i],i*190+55+i*50,440,200,170);
            }          
 //       let index = Math.floor(i/3);
 //       image(sushi_images[i],start_x+(i%3)*100,start_y+(index)*100,100,100);
        }
        if(sushi_names.length >= 5){   
            for(let j=0;j<5;j++){
                if(dishes[j].frame < 15){
                    break;
                }
                if(j==4){
                    mode = 2;
                }
            }
        }
    }
    //mode2なら音声可視化画面
    else if(mode == 2){
        //デザイン
        


        fill(252,252,252,255*0.78);
        rect(1056,47,196,560);
        rect(824,47,228,560);
        rect(50,47,216,560);
        fill(0);
        for(let i=0;i<5;i++){
            textSize(20);
            text(juni[i],75,i*100+110);
            text(fulneta[sushi_names[i]],75,i*100+140);
            image(sushi_images[sushi_names[i]],150,i*(102)+85,90,65);
        }
        textSize(13);
        text('Your Voice Rank',1104,74);
        text('Your Voice Data',1104,312);
        text('SPEED',1130,490);
        text('PITCH',1130,540);
        textSize(45);
        text(Math.floor(heartrate),1124,447);
        let gameheartrate = map(heartrate,10,121,0.2,3);
        let size = 50+50*sin(pi/120*(cnt%240)*gameheartrate);
        image(heart,1149-size/2,362-size/2,size,size);
        fill(255);
        rect(1094,503,122,13);
        image(star,1155,503,10,10);
        image(tumami,tumamix1,500,18,18);
        rect(1094,555,122,13);
        image(star,1155,555,10,10);
        image(tumami,tumamix2,552,18,18);
        image(material,1055,85,200,180);

        let rank = Math.floor(sushi_score/10);
        if(rank<0) rank = 0;
        let shi = sushi_names[4-rank];
        image(sushi_images[shi],1105,115,100,100);
        fill(255);
        ellipse(1150,255,52,52);
        fill(0);
        textSize(38);
        text(neta[shi],1130,270);


        //音声認識のフレームカウント
        if(is_recognition_activated){
            recframe += 1;
        }
        fft.setInput(mic);
        // console.log(mic);
        // console.log(fft);
        //5フレームに1回フーリエ解析でピッチと音量を出す
        if((cnt%15)==0){
        //FFT解析
        max = -10000;
        let spectrum =fft.analyze();
        for(i=0; i <spectrum.length; i++) {
            if((0<i) && (i<18)){
                //ミトちゃんの声の音高の中で最大のものを抜き出し。 indexも保存
                if(max<spectrum[i]){
                    max = spectrum[i];
                    maxid = i;
                }
            //console.log(43*id);
            //console.log(max);
            //let x = map(i, 0, spectrum.length-1, 0, width);
            //let y = map(spectrum[i], 0, 255, height, 0);
                }
            }
            //console.log(spectrum);
            tumamix2 = map(43*maxid,43,731,0,122) + 1094;
            //console.log(43*maxid);
            //console.log(tumamix2);
        }
        fill(0);
        textSize(16);
        let speed = 30*Vt.Strs.length/recframe ;
        tumamix1 = map(2*speed,0,14.6,0,122) + 1094;
/*      text(speed,100,300);
        text(recframe,100,400); */
        Vt.draw_all();
        //result_str = conv_text(result_str,13);
        //text(result_str,824,52,228,560);
        //text(43*id,100,100);
        //text(max,100,200);

        if(((cnt%45)==0) && flag){
            console.log(result_str);
            if(abs(speed-7.0) < 3.5){
                sushi_score += 2;
            }
            else{
                sushi_score -= 1;
            }
            if(abs(max-387) < 193.5){
                sushi_score += 1;
            }
            else{
                //sushi_score -= 1;
            }
            if(abs(heartrate-60.5) < 20){
                sushi_score += 2;
            }
            else {
                //sushi_score -= 1;
            }
        }



    }
    cnt += 3;
}

function keyPressed(){
    if(key == 'a'){
        if(mode == 0){
            /* 寿司の初期化 */
            for(let i=0;i<5;i++){
                dishes[i].init();
            }
            mode = 1;
        }
    }
}

function toggle(x){
    if(x==0) return 1;
    else return 0;
}

function mouseClicked(){
        if(mode == 1){
            if((440 < mouseY) && (mouseY < 610)){
                for(let i=0;i<5;i++){
                    if(((i*190+55+i*50) < mouseX) && (mouseX < i*190+55+i*50+200)){
                        if(sushi_clicked[i]){                      
                            sushi_names.pop();
                            dishes[i].mode = 2;
                            dishes[i].frame = 0;
                        }
                        else{
                            sushi_names.push(i);
                            dishes[i].mode = 1;
                            dishes[i].frame = 0;
                            dishes[i].sushi = i;
                            dishes[i].sara = sushi_names.length-1;
                            console.log(sushi_names);
                        }
                        sushi_clicked[i] = toggle(sushi_clicked[i]);
                    }
                }

            }
        }

        else if(mode == 2){
            toggleSpeechRecognition();
            togglemic()
            flag = !flag;
        }
}