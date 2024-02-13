//dependencies
import { lerp, polarToCartesian, TWO_PI, HALF_PI, QUARTER_PI } from "./lib.js";

//settings
const numParticles = 250;
const minRadius = 1;
const maxRadius = 3;
const minSpeed = 15;
const maxSpeed = 25;
const minAngle = -HALF_PI - QUARTER_PI;
const maxAngle = -HALF_PI + QUARTER_PI;
const acceleration = 0.98;
const opacity = 1;
const minLife = 75;
const maxLife = 125;
const color = "white";
const gravity = 0.15;
const minWind = -2;
const maxWind = 2;

//state variables
const particles = [];
const emitter = { x: undefined, y: undefined };
let respawn = false;
let wind = 0;

//setup
function setupParticles() {
    for (let i=0; i<numParticles; i++) {
        let p = getParticleFromPool();
        if (p) resetParticle(p);
        else particles.push(getParticle());
    }
}

function getParticleFromPool() {
    for (let p of particles) {
        if (p.life <= 0) return p;
    }
    return null;
}

function getParticle() {
    const angle = lerp(minAngle, maxAngle, Math.random());
    const speed = lerp(minSpeed, maxSpeed, Math.random());
    const { x: vx, y: vy } = polarToCartesian({ a: angle, v: speed });
    const { x, y } = emitter;
    const r = lerp(minRadius, maxRadius, Math.random());
    const life = Math.round(lerp(minLife, maxLife, Math.random()));
    return { x, y, vx, vy, r, opacity, color, life };
}

function resetParticle(p) {
    const { x, y, vx, vy, r, opacity, color, life } = getParticle();
    p.x = x;
    p.y = y;
    p.vx = vx;
    p.vy = vy;
    p.r = r;
    p.opacity = opacity;
    p.color = color;
    p.life = life;
}

//exported state functions
export function setEmitter({ x, y }) {
    emitter.x = x;
    emitter.y = y;
    setupParticles();
}

export function hasLiveParticle() {
    for (let p of particles) {
        if (p.life > 0) return true;
    }
    return false;
}

export function setRespawn(bool = true) {
    respawn = bool;
}

export function addWind(norm) {
    wind = lerp(minWind, maxWind, norm);
}

//loop functions
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
        p.vx += wind;
        p.vy += gravity;
        p.vx *= acceleration * dt;
        p.vy *= acceleration * dt;
        p.x += p.vx;
        p.y += p.vy;
        p.opacity *= acceleration * dt;
        p.life--;
    }
}

export function draw(ctx) {
    ctx.save();
    for (let { x, y, r, opacity, color, life } of particles) {
        //not alive?
        if (life <= 0) continue;
        //it's alive!
        ctx.globalAlpha = opacity;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, TWO_PI);
        ctx.fill();
    }
    ctx.restore();
}