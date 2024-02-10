# Particle forces 02: Gravity

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

## Files

* <code>index.html</code> - Entry file for every web app
* <code>index.js</code> - JavaScript module for setting up an app
* <code>fullscreenCanvas.js</code> - JavaScript module for managing a full-screen canvas that self adjusts with browser window resizing
* <code>lib.js</code> - helper functions in one library
* <code>particles.js</code> - particle module

## Lesson notes

### 01 - Velocity changes position, acceleration changes velocity

1. The code is already built to handle acceleration, whether speeding up or slowing down (in physics, both are called _acceleration_, not just going faster)
2. In <code>particles.js</code>, add a new setting:
    ```js
    const gravity = 0.15;
    ```
3. In the <code>update</code> function, point out the one-line change, <code>p.vy += gravity * dt;</code>:
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
            p.vy *= acceleration * dt;
            p.vy += gravity * dt;
            p.opacity *= acceleration * dt;
            p.life--;
        }
    }
    ```
    * In this code, the <code>acceleration</code> setting is less than one, so it's actually slowing down both the axis velocities. In real-world physics, this might represent something like _friction_. These physics simulations are nothing like real-world physics, however, we can still think of this slow-down as a form of friction
    * The <code>gravity</code> setting value is added to the <code>vy</code> vertical velocity property on each frame, which increases the movement toward the bottom of the canvas. For particles that start with a negative <code>vy</code> value, starting by shooting upwards toward the top of the canvas, the <code>gravity</code> value eventually increases <code>vy</code> to zero (or near it), which is the apex of the particle's arcing path, before accelerating it downward
4. Running the code at this time produces a burst of particles that fall downward toward the bottom of the canvas