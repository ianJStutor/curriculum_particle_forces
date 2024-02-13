# Particle forces 04: Acceleration control

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

## Files

* <code>index.html</code> - Entry file for every web app
* <code>index.js</code> - JavaScript module for setting up an app
* <code>fullscreenCanvas.js</code> - JavaScript module for managing a full-screen canvas that self adjusts with browser window resizing
* <code>lib.js</code> - helper functions in one library
* <code>particles.js</code> - particle module

## Lesson notes

### 01 - Force majeure

1. In the previous lesson, you added gravity and wind in the form of single values, each affecting a different axis acceleration. If we made these forces, and any future ones, always have values for both axes, then we wouldn't need to be stuck with the idea that gravity is always "down" (positive <code>vy</code>) or wind is always "horizontal" (positive or negative <code>vx</code>). Instead, we could assign gravity as <code>{x: 0, y: 0.15}</code> or wind as <code>{x: -1.5, y: 0}</code> or any other affector of acceleration (such as magnetism or being "like a moth drawn to a flame") in terms of an <code>{x,y}</code> object
2. In <code>particles.js</code>, redefine the <code>gravity</code> setting:
    ```js
    const gravity = {x: 0, y: 0.15};
    ```
    And redefine the default <code>wind</code> state variable:
    ```js
    let wind = {x: 0, y: 0};
    ```
3. Edit the <code>addWind</code> function:
    ```js
    export function addWind(norm) {
        wind = {x: lerp(minWind, maxWind, norm), y: 0};
    }
    ```
4. The <code>update</code> function has been altered:
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
            p.vx += gravity.x;
            p.vy += gravity.y;
            p.vx += wind.x;
            p.vy += wind.y;
            p.vx *= acceleration * dt;
            p.vy *= acceleration * dt;
            p.x += p.vx;
            p.y += p.vy;
            p.opacity *= acceleration * dt;
            p.life--;
        }
    }
    ```
    * Gravity and wind forces are added to the particle's axis velocities, which are afterwards multiplied by the <code>acceleration</code> and <code>dt</code> values
    * Once the axis velocities have been calculated, the particle's position can be changed. Point out that delta time is applied only once for movement (opacity is separate). We're starting to get better control over the particle system
5. Running the code at this time should produce no visible change to the lawn sprinkler effect produced in the previous step. The code underneath it all, however, has changed, and it now allows us greater control over our particles

### 02 - Wind and gravity with a single click!

1. Adding both components of <code>gravity</code> and both components of <code>wind</code> on every frame--especially since we know one component of each is zero--seems a bit repetitive and perhaps wasteful. It might be better to store the force values in one object then apply it once on every frame
2. In <code>particles.js</code>, delete the <code>gravity</code> setting and replace with new force settings:
    ```js
    const minForce = -2;
    const maxForce = 2;
    ```
    This range of forces will be used as an acceleration force for both axis velocities, gravity and wind
3. In the "state variables" section, delete the <code>wind</code> variable and replace with a new, generic <code>force</code> variable:
    ```js
    const force = {x: 0, y: 0};
    ```
4. In the "exported state functions" section, delete the <code>addWind</code> function and replace with a new <code>addForce</code> function:
    ```js
    export function addForce(normX, normY) {
        force.x = lerp(minForce, maxForce, normX);
        force.y = lerp(minForce, maxForce, normY);
    }
    ```
    Point out that normalized values are still the expected arguments and that the <code>minForce</code> and <code>maxForce</code> settings are applied to both axis accelerations
5. The <code>loop</code> function has changed:
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
    The <code>x</code> and <code>y</code> properties of the <code>force</code> object are applied to the axis velocities on each frame
6. In <code>index.js</code>, change the imported <code>addWind</code> function to the new <code>addForce</code> function:
    ```js
    import { update, draw, setEmitter, hasLiveParticle, setRespawn, addForce } from "./particles.js";
    ```
7. In the <code>init</code> function, change the click event listener:
    ```js
    canvas.addEventListener("click", e => {
        addForce(e.x / canvas.width, e.y / canvas.height);
    });
    ```
    The click location is normalized on both axes and passed as arguments to the <code>addForce</code> function
8. Running the code at this time produces the lawn sprinkler but without any gravity or wind--to begin with. But clicking around the canvas changes acceleration for both axis velocities
9. Consider changing the <code>click</code> event to <code>pointermove</code> (if there's a mouse or other pointer device), or rewriting a bit to accomodate <code>touchmove</code>:
    ```js
    // OPTIONAL:
    canvas.addEventListener("touchmove", e => {
        addForce(e.touches[0].clientX / canvas.width, e.touches[0].clientY / canvas.height);
    });
    ```