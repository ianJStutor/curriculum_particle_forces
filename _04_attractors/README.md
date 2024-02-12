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
2. 