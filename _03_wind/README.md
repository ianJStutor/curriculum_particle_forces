# Particle forces 03: Wind

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

## Files

* <code>index.html</code> - Entry file for every web app
* <code>index.js</code> - JavaScript module for setting up an app
* <code>fullscreenCanvas.js</code> - JavaScript module for managing a full-screen canvas that self adjusts with browser window resizing
* <code>lib.js</code> - helper functions in one library
* <code>particles.js</code> - particle module

## Lesson notes

### 01 - Spout

1. In <code>index.js</code>, change the <code>init</code> function:
    ```js
    function init() {
        setRespawn(true);
        setEmitter({ x: canvas.width/2, y: canvas.height });
        // canvas.addEventListener("click", setEmitter);
        update(canvas);
        requestAnimationFrame(loop);
    }
    ```
    * Comment out the click event listener; this will be repurposed later
    * Set the <code>respawn</code> property to <code>true</code> with the <code>setRespawn</code> function
    * Set the emitter spawn point to the center-bottom of the canvas with the <code>setEmitter</code> function
2. Running the code at this time produces a kind of bubbling effect at the very bottom of the canvas that burst upwards then down again as if from gravity. Most of the particles, however, only exist below the canvas
3. In <code>particles.js</code>, add <code>HALF_PI</code> to the dependencies:
    ```js
    import { lerp, polarToCartesian, HALF_PI } from "./lib.js";
    ```
4. Point out the changes in the "settings" section:
    ```js
    const minRadius = 1;
    const maxRadius = 3;
    const minSpeed = 15;
    const maxSpeed = 25;
    const minAngle = -HALF_PI;
    const maxAngle = -HALF_PI;
    ```
    * The min and max radii and speed have changed
    * Two new settings, <code>minAngle</code> and <code>maxAngle</code> have the exact same value
5. In the <code>getParticle</code> function, change the line that assigns the <code>angle</code> variable:
    ```js
    const angle = lerp(minAngle, maxAngle, Math.random());
    ```
    The <code>lerp</code> function uses the new <code>minAngle</code> and <code>maxAngle</code> settings
6. Running the code at this time produces an upward stream of particles that shoots straight upwards before falling straight downwards. Point out, if necessary, that <code>-HALF_PI</code> radians is an "upward" direction in computer graphics
7. In <code>lib.js</code>, add another constant:
    ```js
    export const QUARTER_PI = Math.PI * 0.25;
    ```
8. Back in <code>particle.js</code>, add <code>QUARTER_PI</code> to the dependencies:
    ```js

    ```
9. Change the min and max angle settings:
    ```js
    const minAngle = -HALF_PI - QUARTER_PI;
    const maxAngle = -HALF_PI + QUARTER_PI;
    ```
10. Running the code at this time produces a cone of particles spraying upwards before falling downwards. Explore different angle and speed settings

### 02 - Gale force

1. In <code>particles.js</code>, add two new settings:
    ```js
    const minWind = -2;
    const maxWind = 2;
    ```
    These numbers represent horizontal acceleration. Negative values will move particles to the left and positive values will move particles to the right
2. Add a new state variable:
    ```js
    let wind = 0;
    ```
    This is the default value, no horizontal acceleration
3. Add a new function to the "exported state functions" section:
    ```js
    export function setWind(norm) {
        wind = lerp(minWind, maxWind, norm);
    }
    ```
    Given a normalized value (between zero and one), the <code>wind</code> variable will be set between <code>minWind</code> and <code>maxWind</code>
4. In the <code>update</code> function, add the new line <code>p.vx += wind * dt;</code>:
    ```js
    export function update(dt = 1) {
        //update particles
        for (let i=0; i<particles.length; i++) {
            let p = particles[i];
            //not alive? needs removing or respawning?
            if (p.life <= 0) {
                if (particles.length > numParticles) {
                    particles.splice(i, 1);
                    i--;
                }
                else if (respawn) resetParticle(p);
                continue;
            }
            //move and accelerate, change opacity, life
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            p.vx *= acceleration * dt;
            p.vx += wind * dt;
            p.vy *= acceleration * dt;
            p.vy += gravity * dt;
            p.opacity *= acceleration * dt;
            p.life--;
        }
    }
    ```
    This works identically to <code>gravity</code> but on the horizontal axis
5. In the <code>index.js</code> file, add the new <code>setWind</code> function to the list of dependencies:
    ```js
    import { update, draw, setEmitter, hasLiveParticle, setRespawn, setWind } from "./particles.js";
    ```
6. In the <code>init</code> function, replace the commented-out click event handler with the following:
    ```js
    canvas.addEventListener("click", e => {
        setWind(e.x / canvas.width);
    });
    ```
    Dividing the click event's <code>x</code> position by the width produces a normalized value which is then sent to the <code>setWind</code> function
7. Running the code at this time produces the familiar upward plume of particles. But clicking around the canvas introduces acceleration on the horizontal axis, representing wind (or some such force). Consider changing the <code>click</code> event to <code>pointermove</code> (if there's a mouse or other pointer device), or rewriting a bit to accomodate <code>touchmove</code>