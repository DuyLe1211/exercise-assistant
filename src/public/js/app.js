import {
    PoseLandmarker,
    FilesetResolver,
    DrawingUtils,
} from "https://cdn.skypack.dev/@mediapipe/tasks-vision@0.10.0";

const waitWindow = document.getElementsByClassName('ww');
const demosSection = document.getElementById("demos");
let poseLandmarker = undefined;
let runningMode = "IMAGE";
let webcamRunning = false;
const videoHeight = document.getElementById('webcam').style.height;
const videoWidth = document.getElementById('webcam').style.width;
let enableWebcamButton = document.getElementById("webcamButton");
let btnContainer = document.querySelector('.btn-container');

// Before we can use PoseLandmarker class we must wait for it to finish
// loading. Machine Learning models can be large and take a moment to
// get everything needed to run.
const createPoseLandmarker = async () => {
const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
);
poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
    baseOptions: {
    modelAssetPath: `https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task`,
    delegate: "GPU"
    },
    runningMode: runningMode,
    numPoses: 2
});
    btnContainer.classList.remove("invisible");
    waitWindow[0].classList.add("invisible");
};
createPoseLandmarker();

const video = document.getElementById("webcam");
const canvasElement = document.getElementById(
"output_canvas"
);
const canvasCtx = canvasElement.getContext("2d");
const drawingUtils = new DrawingUtils(canvasCtx);

// Check if webcam access is supported.
const hasGetUserMedia = () => !!navigator.mediaDevices?.getUserMedia;

// If webcam supported, add event listener to button for when user
// wants to activate it.
if (hasGetUserMedia()) {
    enableWebcamButton.addEventListener("click", enableCam);
} else {
    console.warn("getUserMedia() is not supported by your browser");
}

// Enable the live webcam view and start detection.
function enableCam(event) {
    if (!poseLandmarker) {
        console.log("Wait! poseLandmaker not loaded yet.");
        return;
    }

    if (webcamRunning === false) {
        webcamRunning = true;
        btnContainer.classList.add('invisible');
        demosSection.classList.remove('invisible');
    }

    // getUsermedia parameters.
    const constraints = {
        video: true
    };

    // Activate the webcam stream.
    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
        video.srcObject = stream;
        video.addEventListener("loadeddata", predictWebcam);
    });
}

// Demo

let pose_result;
let lastVideoTime = -1;

let idList = document.querySelector('.info').innerText.split(',')

// Get Data
let data = await idList.map(async (id) => {
    let temp;
    await fetch(`http://localhost:3000/api?id=${id}`)
    .then((res) => {
        return res.json();
    })
    .then((resp) => {
        return resp[0];
    })
    .then((data) => {
        temp = data;
    })
    return temp;
})
data = await Promise.all(data);

// Var
let index = 0;
let repElement = document.querySelector('.rep');
let setElement = document.querySelector('.set');
let curElement = document.querySelector('.cur');
let nextElement = document.querySelector('.next');
let free = Number(document.querySelector('.free').innerText);
let rep = repElement.innerHTML;
let set = setElement.innerHTML;
let cur = data[index].name;
let next = "Không còn bài tập nào!";
if (data[index + 1]) next = data[index].name;
let start = data[index].start;
let stop = data[index].stop;
let left = data[index].left;
let right = data[index].right;
let stat;
if (data[0].type == 'leftright') stat = 2;
else stat = 1;
let point;
let radian;
let ic = false;
point = left;

console.log(data)
console.log(data.length);

if (stat == 2) curElement.innerHTML = `${cur} (Tay trái)`;
else curElement.innerHTML = cur;
if (stat == 2) nextElement.innerHTML = `${cur} (Tay phải)`;
else nextElement.innerHTML = next;

function resetData() {

    // Process stat
    console.log(stat)

    if (data[index].type == 'leftright' && stat == 2) {
        curElement.innerHTML = `${cur} (Tay trái)`;
        nextElement.innerHTML = `${cur} (Tay phải)`;
    } else if (data[index].type == 'leftright' && stat == 1) {
        curElement.innerHTML = `${cur} (Tay phải)`;
        if (data[index + 1] && data[index + 1].type == 'leftright') {
            nextElement.innerHTML = `${data[index + 1].name} (Tay trái)`;
        } else if (data[index + 1] && data[index + 1].type != 'leftright') {
            nextElement.innerHTML = data[index + 1].name;
        } else nextElement.innerHTML = "Không còn bài tập nào!";
    } else {
        curElement.innerHTML = nextElement.innerHTML;
        if (data[index + 1] && data[index + 1].type == 'leftright') {
            nextElement.innerHTML = `${data[index + 1].name} (Tay trái)`;
        } else if (data[index + 1] && data[index + 1].type != 'leftright') {
            nextElement.innerHTML = data[index + 1].name;
        } else nextElement.innerHTML = "Không còn bài tập nào!";
    }

    if (curElement.innerHTML == nextElement.innerHTML) {
        nextElement.innerHTML = "Không còn bài tập nào!";
    }
    // Process index
    if (stat == 0) index++;

    if (stat == 1) { }
    else if (data[index].type == 'leftright') stat = 2;
    else stat = 1;
    console.log(index);
    // Reset data
    cur = data[index].name;
    start = data[index].start;
    stop = data[index].stop;
    left = data[index].left;
    right = data[index].right;
    ic = false;

    if (stat == 2) point = left;
    else point = right;

    console.log(point);

    setElement.innerHTML = set;
    repElement.innerHTML = rep;
}
console.log(free)

async function predictWebcam() {
    canvasElement.style.height = videoHeight;
    video.style.height = videoHeight;
    canvasElement.style.width = videoWidth;
    video.style.width = videoWidth;
    // Now let's start detecting the stream.
    if (runningMode === "IMAGE") {
        runningMode = "VIDEO";
        await poseLandmarker.setOptions({ runningMode: "VIDEO" });
    }
    let startTimeMs = performance.now();
    if (lastVideoTime !== video.currentTime) {
        lastVideoTime = video.currentTime;
        poseLandmarker.detectForVideo(video, startTimeMs, (result) => {
        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
        for (const landmark of result.landmarks) {
            drawingUtils.drawLandmarks(landmark, {
                radius: (data) => DrawingUtils.lerp(data.from.z, -0.15, 0.1, 5, 1),
                lineWidth: 2,
            });
            drawingUtils.drawConnectors(landmark, PoseLandmarker.POSE_CONNECTIONS);
        }
        canvasCtx.restore();
        });
    }
    // **************
    // Process Result 
    // **************
    pose_result = poseLandmarker.result.landmarks['0'];
    if (pose_result && Number(repElement.innerHTML) > 0) {
        radian = cal_deg(pose_result[point[0]], pose_result[point[1]], pose_result[point[2]]);
        console.log(radian, start, stop);
        if (ic && radian <= stop) {
            ic = false;
            repElement.innerHTML = `${Number(repElement.innerHTML) - 1}`;
        } else if (!ic && radian >= start) ic = true;
    }

    console.log(free);
    console.log(Number(setElement.innerHTML));
    if (Number(repElement.innerHTML) == 0 && Number(setElement.innerHTML) != 0) {
        setElement.innerHTML = `${Number(setElement.innerHTML) - 1}`;
        repElement.innerHTML = rep;
    } else if (Number(setElement.innerHTML) == 0) {
        repElement.innerHTML = `${free}`;

        let count_down = setInterval(() => {
            console.log(repElement.innerHTML)
            repElement.innerHTML = `${Number(repElement.innerHTML) - 1}`;
            if (Number(repElement.innerHTML) == 0) {
                clearInterval(count_down);
                stat--;

                if (nextElement.innerHTML == "Không còn bài tập nào!") {
                    demosSection.classList.add('invisible');
                    waitWindow.classList.remove('invisible');
                    let text = document.querySelector('.text');
                    text.innerHTML = 'Chúc mừng bạn đã hoàn thành';
                    return;
                } else resetData();
                predictWebcam();
            }
        }, 1000)

        return;
    }
    // **************
    // End Process 
    // **************
    
    // Call this function again to keep predicting when the browser is ready.
    if (webcamRunning === true) {
        window.requestAnimationFrame(predictWebcam);
    }
}

async function count_down() {
        await setInterval(() => {
            console.log(repElement.innerHTML)
            repElement.innerHTML = `${Number(repElement.innerHTML) - 1}`;
        }, 1000)

        if (Number(repElement.innerHTML) == 0) {
            return;
        }
}

function cal_deg(a, b, c) {
    let radian = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
    let angle = Math.abs((radian * 180) / Math.PI);

    if (angle > 180) angle = 360 - angle;
    return angle;
}