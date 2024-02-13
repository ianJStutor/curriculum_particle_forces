# Particle forces 04: Attractors

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

## Files

* <code>index.html</code> - Entry file for every web app
* <code>index.js</code> - JavaScript module for setting up an app
* <code>fullscreenCanvas.js</code> - JavaScript module for managing a full-screen canvas that self adjusts with browser window resizing
* <code>lib.js</code> - helper functions in one library
* <code>particles.js</code> - particle module

## Lesson notes

### 01 - Acceleration adjustment

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