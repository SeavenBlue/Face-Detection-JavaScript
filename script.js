
const video = document.getElementById('video')
var detectImg = [];

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
]).then(startVideo)

function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
}




video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video)
  document.body.append(canvas)
  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)
  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    faceapi.draw.drawDetections(canvas, resizedDetections)

   
    if(detections){
    detectImg = detections;
    }
  
  }, 100)




})






var ImageMem = [];
var imgX;
var imgY;
var recogImg;



// Classifier Variable
var classifier;

var imageModelURL = 'https://teachablemachine.withgoogle.com/models/hyNMlDkpw/';  
// Video
var videO

var flippedVideo;
// To store the classification
var label = "";

// Load the model first
function preload() {
  
  
classifier = ml5.imageClassifier(imageModelURL + 'model.json');
}

function setup(){
  createCanvas(1000,500)
  videO = createCapture(VIDEO)
  videO.size(320, 240);
  
  
  flippedVideo = ml5.flipImage(videO);
  classifyVideo();
  flippedVideo.hide()
  videO.hide()
  }
  
  function draw(){
    background(0)
    
      if(detectImg[0]){
    for(let i = 0; i < detectImg.length; i++){
    ImageMem.push(videO.get(detectImg[i]._box._x,detectImg[i]._box._y,detectImg[i]._box._width,detectImg[i]._box._height))
    }}
    
    
    
    
    if(ImageMem){
    for(let j = 0; j < 200; j++){
    imgX = j;
    imgY = 0;
    while(imgX >= 20){ imgX = imgX-20; imgY++}
      if(ImageMem[j]){
    image(ImageMem[j],imgX*50,imgY*50,50,50)
    }
    if(ImageMem[200]){ImageMem.splice(ImageMem-length-1,1)}
    
    }
  }
   
      // Draw the video
      image(flippedVideo, 0, 0);
    
      // Draw the label
      fill(255);
      textSize(16);
      textAlign(CENTER);
      text(label, width / 2, height - 4);
    
    }

// Get a prediction for the current video frame
function classifyVideo() {
  flippedVideo = ml5.flipImage(videO)
  classifier.classify(flippedVideo, gotResult);
}

// When we get a result
function gotResult(error, results) {
  // If there is an error
  if (error) {
    console.error(error);
    return;
  }
  // The results are in an array ordered by confidence.
  // console.log(results[0]);
  label = results[0].label;
  // Classifiy again!
  classifyVideo();
}

