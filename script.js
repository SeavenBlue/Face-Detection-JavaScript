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

function setup(){
createCanvas(500,500)
FrameVid = createCapture(VIDEO)
FrameVid.hide()

}

function draw(){


background(0)

  if(detectImg[0]){
image(FrameVid.get(detectImg[0]._box._x,detectImg[0]._box._y,detectImg[0]._box._width,detectImg[0]._box._height),0,0,200,200)
}
}


function keyPressed(){
if( key === "p"){
save(FrameVid.get(detectImg[0]._box._x,detectImg[0]._box._y,detectImg[0]._box._width,detectImg[0]._box._height),"Gustav","png")
console.log("image saved")
}

}
