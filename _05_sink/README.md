# Particle forces 05: Sink

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

## Files

* <code>index.html</code> - Entry file for every web app
* <code>index.js</code> - JavaScript module for setting up an app
* <code>fullscreenCanvas.js</code> - JavaScript module for managing a full-screen canvas that self adjusts with browser window resizing
* <code>lib.js</code> - helper functions in one library
* <code>particles.js</code> - particle module

## Lesson notes

### 01 - Down the drain

1. The previous lesson changed the acceleration for each axis velocity in a way the sort of represented gravity and wind. The particles simulated reacting to external forces; in fact, each particle was affected by the exact same force acceleration. But there are other possible external forces, and next we'll look at creating an attraction point. For this, each particle will need to calculate its own force acceleration based on its position relative to the attraction point
2. In <code>particles.js</code>, add the <code>cartesianToPolar</code> function to the imports from the <code>lib.js</code> file:
    ```js
    import { lerp, polarToCartesian, cartesianToPolar, TWO_PI, HALF_PI, QUARTER_PI } from "./lib.js";
    ```
3. In the "state variables" section, add a new variable:
    ```js
    const attractor = { x: undefined, y: undefined };
    ```
4. In the "exported state functions" section, add a new function:
    ```js
    export function setAttractor({ x, y }) {
        attractor.x = x;
        attractor.y = y;
    }
    ```
5. The <code>update</code> function has changed:
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
            //attractor
            if (attractor.x !== undefined && attractor.y !== undefined) {
                const attraction = cartesianToPolar({x: attractor.x - p.x, y: attractor.y - p.y});
                attraction.v = Math.max(0.001, Math.min(attraction.v, maxForce));
                const acc = polarToCartesian(attraction);
                p.vx += acc.x;
                p.vy += acc.y;
            }
            //move and accelerate, change opacity, life
            p.vx += force.x;
            p.vy += force.y;
            p.vx *= acceleration * dt;
            p.vy *= acceleration * dt;
            p.x += p.vx;
            p.y += p.vy;
            p.opacity *= acceleration * dt;
            p.life--;
        }
    }
    ```
    * There's a new "attractor" section, and its code only runs if there's an actual position for the <code>attractor</code> object
    * The <code>attraction</code> object is created by first finding the difference between the axis positions of the particle and the attractor, then converting it to angle and velocity (<code>{a, v}</code>). Note that we're doing vector calculations here without naming the math being used
    * The velocity (<code>v</code> property) of the <code>attraction</code> object is clamped to something close to zero but not actually zero (to prevent edge-case behavior) and the <code>maxForce</code> setting. Review <code>Math.max</code> and <code>Math.min</code> and the clamp pattern, if necessary
    * Then the <code>attraction</code> object is converted back into a Cartesian <code>{x,y}</code> object. This allows the component parts to be added to the particle's axis velocities
6. In <code>index.js</code>, add the <code>setAttractor</code> function to the list of imports:
    ```js
    import { update, draw, setEmitter, setAttractor, hasLiveParticle, setRespawn, addForce } from "./particles.js";
    ```
    Note that after edits the <code>addForce</code> function will no longer be used. It could be removed from this list, if desired
7. The <code>init</code> function has changed:
    ```js
    function init() {
        setRespawn(true);
        setEmitter({ x: canvas.width/2, y: canvas.height });
        setAttractor({ x: canvas.width/2, y: 0 });
        canvas.addEventListener("click", setAttractor);
        update(canvas);
        requestAnimationFrame(loop);
    }
    ```
    * The <code>setAttractor</code> function is used right away, setting the attraction point to the top-center of the canvas
    * The click event handler has been simplified, calling the <code>setAttractor</code> function directly
8. Running the code at this time produces an effect in which particles swirl or revolve around the attraction point. Each particle behaves independently
9. Consider changing the <code>click</code> event to <code>pointermove</code> (if there's a mouse or other pointer device), or rewriting a bit to accomodate <code>touchmove</code>:
    ```js
    // OPTIONAL:
    canvas.addEventListener("touchmove", e => {
        setAttractor(e.touches[0].clientX, e.touches[0].clientY);
    });
    ```