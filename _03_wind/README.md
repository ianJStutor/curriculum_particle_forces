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

1. 