const video = document.getElementById('video')
var detectImg = [];

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models')
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

function setup(){
createCanvas(1000,500)
FrameVid = createCapture(VIDEO)
FrameVid.hide()

}

var nice = 1
async function draw(){


background(0)

  if(detectImg[0]){
for(let i = 0; i < detectImg.length; i++){
ImageMem.push(FrameVid.get(detectImg[i]._box._x,detectImg[i]._box._y,detectImg[i]._box._width,detectImg[i]._box._height))


}}

image = await faceapi.bufferToImage(ImageMem[ImageMem.length-1])




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





function keyPressed(){
if( key === "p"){
save(FrameVid.get(detectImg[0]._box._x,detectImg[0]._box._y,detectImg[0]._box._width,detectImg[0]._box._height),"Gustav","png")
console.log("image saved")
}

}
