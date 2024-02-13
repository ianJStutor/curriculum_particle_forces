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