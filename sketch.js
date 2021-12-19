let sushi_images = new Array(5);
let mask_images = new Array(5);
let bgs = new Array(2);
let mode;
let cnt;
let xhr;
let heartrate;
let sushi_clicked = [0,0,0,0,0];
let sushi_names = [];
let rectsize;
let bg,star,tumami,heart,material,Vt,myfont,sound,fft,spectrum;
let pi = 3.14159;

function preload(){
    let sushi_names = ['images/maguro.png','images/ikura.png','images/ebi.png','images/tamago.png','images/kappa.png'];
    let bg_names = ['images/bg1.png','images/bg2.png'];
    for(let i=0;i<5;i++){
        sushi_images[i] = loadImage(sushi_names[i]);
    }
    for(let i=0;i<2;i++){
        bgs[i] = loadImage(bg_names[i]);
    }
    heart = loadImage('images/heart.png');
    material = loadImage('images/material.png');
    bg = loadImage('images/bg.jpg');
    tumami = loadImage('images/tumami.png');
    star = loadImage('images/star.png');
    material = loadImage('images/material.png');
    myfont = loadFont('fonts/SawarabiGothic-Regular.ttf');
    sound = loadSound('sounds/melonsoda.wav');
}

class VoiceText{
    init(){
        this.textSizes = [30,20,10,30];
        this.Strs = ['き','ら','き','ら'];
        this.width = 200;
        this.cnt = 0; //テキストが今何文字まで書かれているか。
    }

    draw_n(n){
        let temp_sum = 0;
        for(let i=0;i<n;i++){
            temp_sum += this.textSizes[i];
        }
        textSize(this.textSizes[n]);
        let x = (temp_sum %this.width);
        let y = Math.floor((temp_sum / this.width));
        text(this.Strs[n],x,(y*100+100));
    }

    draw_all(){
        let l = this.textSizes.length;
        for(let i=0;i<l;i++){
            this.draw_n(i);
        }
    }
}

function init(){
    mode = 0;
    cnt = 0;
    textFont(myfont);
    xhr = new XMLHttpRequest();
    Vt = new VoiceText();
    Vt.init();
    sound.loop();
    fft = new p5.FFT();
    fft.setInput(sound);
}

function setup(){
    let canvas = createCanvas(1280,800);
    canvas.parent('result');
    init();
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
    image(bg,0,0,width,height);
    index = cnt%30;

    if(!(cnt%270)){

    xhr.open('GET', 'https://jsonplaceholder.typicode.com/todos/');
    xhr.send();
     
    xhr.onreadystatechange = function() {
        if(xhr.readyState === 4 && xhr.status === 200) {
            
            responseJson = JSON.parse(xhr.responseText)
            heartrate = responseJson[0].userId;
            }
        }
    }

    //mode0ならタイトル画面
    if(mode == 0){

        background(0);
        stroke(255);
        noFill();
        //FFT解析
        let spectrum =fft.analyze();
        //結果をグラフで描画
        beginShape();
        for(i =0; i <spectrum.length; i++) {
        let x = map(i, 0, spectrum.length-1, 0, width);
        let y = map(spectrum[i], 0, 255, height, 0);
        vertex(x, y);
        }
        endShape();
        /*
        alpha = 122.5 + 122.5*sin(pi/(5*index));
        textSize(20);
        fill(0,0,0,alpha);
        text('aボタンを押してスタート.',width/2-100,height-280);
        fill(0);
        textSize(60);
        text('タイトル',width/2-120,height/2);
        for(let i=0;i<5;i++){
            let x = (1280 + (cnt*2) + i*50)%2560;
            x = reflect(x);
            let y = 200*sin(pi/360*x) + 400;
            image(sushi_images[i],x,y,50,50);
        }

        for(let i=0;i<5;i++){
            let x = ((cnt*2) + i*50)%2560;
            x = reflect(x);
            let y = 200*sin(pi/360*x) + 400;
            image(sushi_images[i],x,y,50,50);
        } */
    }

    //mode1なら寿司選択画面
    else if(mode == 1){
        let start_x = width/2 - 100;
        let start_y = height/2 -100;
        for(let i=0;i<5;i++){
            let idx = Math.floor(i/3);
            if(sushi_clicked[i]){
                fill(255,0,0,90);
                noStroke();
                rect(start_x+(i%3)*100,start_y+(idx)*100,100,100);
                image(sushi_images[i],start_x+(i%3)*100,start_y+(idx)*100,100,100);                       
            }
            else{
                fill(255,255,255,70);
                noStroke();
                rect(start_x+(i%3)*100,start_y+(idx)*100,100,100);
                image(sushi_images[i],start_x+(i%3)*100,start_y+(idx)*100,100,100);
            }          
 //       let index = Math.floor(i/3);
 //       image(sushi_images[i],start_x+(i%3)*100,start_y+(index)*100,100,100);
        }
        if(sushi_names.length >= 5){
            mode = 2;
        }
    }
    //mode2なら音声可視化画面
    else if(mode == 2){
        text('音声画面スタート',100,100);
        fill(252,252,252,255*0.78);
        rect(1056,47,196,560);
        fill(0);
        textSize(13);
        text('Your Voice Rank',1104,74);
        text('Your Voice Data',1104,312);
        text('SPEED',1130,490);
        text('PITCH',1130,540);
        let size = 50+50*sin(pi/120*(cnt%240));
        image(heart,1149-size/2,362-size/2,size,size);
        textSize(45);
        text(heartrate,1134,452);
        fill(255);
        rect(1094,503,122,13);
        image(star,1155,503,10,10);
        image(tumami,1140,500,18,18);
        rect(1094,555,122,13);
        image(star,1155,555,10,10);
        image(tumami,1140,552,18,18);
        image(material,1055,85,200,180);
        image(sushi_images[0],1105,115,100,100);
        fill(255);
        ellipse(1150,255,52,52);




    }
    cnt += 3;
}

function keyPressed(){
    if(key == 'a'){
        if(mode == 0){
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
            if((300 < mouseY) && (mouseY < 400)){
                if((540 < mouseX) && (mouseX < 640)){
                    // まぐろをクリックしたときの処理
                    if(sushi_clicked[0]){                      
                        sushi_names.pop();
                    }
                    else{
                        sushi_names.push(0);
                    }
                    sushi_clicked[0] = toggle(sushi_clicked[0]);
                }
                else if((640 < mouseX) && (mouseX < 740)){
                    // いくらをクリックしたときの処理                    
                    if(sushi_clicked[1]){                      
                        sushi_names.pop();
                    }
                    else{
                        sushi_names.push(1);
                    }
                    sushi_clicked[1] = toggle(sushi_clicked[1]);
                }
                else if((740 < mouseX) && (mouseX < 840)){
                    // えびをクリックしたときの処理
                    if(sushi_clicked[2]){                     
                        sushi_names.pop();
                    }
                    else{
                        sushi_names.push(2);
                    }
                    sushi_clicked[2] = toggle(sushi_clicked[2]);
                }
            }
            else if((400 < mouseY) && (mouseY < 500)){
                if((540 < mouseX) && (mouseX < 640)){
                    // たまごをクリックしたときの処理
                    if(sushi_clicked[3]){                      
                        sushi_names.pop();
                    }
                    else{
                        sushi_names.push(3);
                    }
                    sushi_clicked[3] = toggle(sushi_clicked[3]);
                }
                else if((640 < mouseX) && (mouseX < 740)){
                    // いくらをクリックしたときの処理
                    if(sushi_clicked[4]){                      
                        sushi_names.pop();
                    }
                    else{
                        sushi_names.push(4);
                    }                 
                    sushi_clicked[4] = toggle(sushi_clicked[4]);
                }
            }
        }
}