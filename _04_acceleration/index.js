//dependencies
import { fullscreenCanvas } from "./fullscreenCanvas.js";
import { update, draw, setEmitter, hasLiveParticle, setRespawn, addForce } from "./particles.js"; 

//environment
const canvas = document.querySelector("canvas");
const ctx = fullscreenCanvas(canvas, window);

//settings
const fps = 1000/60; //target 60 frames per second

//state variables
let prevTime;

//loop
function loop(t) {
    //time
    if (!prevTime) prevTime = t;
    const dt = (t - prevTime) / fps;
    prevTime = t;
    //management
    if (hasLiveParticle()) {
        //erase
        const { width, height } = canvas;
        ctx.clearRect(0, 0, width, height);
        //particles
        update(dt);
        draw(ctx);
    }
    //repeat
    requestAnimationFrame(loop);
}

//init
function init() {
    setRespawn(true);
    setEmitter({ x: canvas.width/2, y: canvas.height });
    canvas.addEventListener("click", e => {
        addForce(e.x / canvas.width, e.y / canvas.height);
    });
    update(canvas);
    requestAnimationFrame(loop);
}

init();