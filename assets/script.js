// background setup
const canvas = document.getElementById('canvas1');
const inputDiv = document.getElementById('inputDiv');
const inputField = document.getElementById('artistInput');
const searchButton = document.querySelector('#inputDiv button');

const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

/*This JavaScript code calculates the position of the "Sound Scout" caption 
using `getBoundingClientRect()` 
positioning the input div and search button below it, 
centered on the canvas, both on initial load and on window resize. 
*/


function centerInputDiv() {
    // Get the caption and inputDiv elements
    const caption = document.getElementById('caption');
  
    // Calculate the position of the inputDiv
    const captionRect = caption.getBoundingClientRect();
    const captionBottom = captionRect.bottom + window.scrollY;
    const inputDivHeight = inputDiv.offsetHeight;
  
    const inputDivTop = captionBottom + 20; // Adjust this value as needed for spacing
  
    // Set the position of the inputDiv
    inputDiv.style.position = 'absolute';
    inputDiv.style.left = '50%';
    inputDiv.style.top = `${inputDivTop}px`;
    inputDiv.style.transform = 'translateX(-50%)';
  }
  
  centerInputDiv();

  window.addEventListener('resize', centerInputDiv);



console.log(ctx);
const gradient = ctx.createLinearGradient(0,0,0, canvas.height);
// particle colors
gradient.addColorStop(0, 'darkblue');
gradient.addColorStop(0.6, 'red');
gradient.addColorStop(1, 'lightblue');
ctx.fillStyle = gradient;
// lines for particle connection
ctx.strokeStyle = 'orange';

class Particle {
    constructor(effect, track){
        this.effect = effect;
        this.track = track;
        // size of the particles
        this.radius = Math.floor(Math.random() * 3 + 3);
        this.x = this.radius + Math.random() * (this.effect.width - this.radius * 2);
        this.y = - Math.random() * this.effect.height * 0.6 + 100;
        this.vx = Math.random() * 1 - 0.8;
        this.vy = 0;
        this.gravity = this.radius * 0.00009;
        this.friction = 0.90;
        this.width = this.radius * 2;
        this.height = this.radius * 2;
    }
    draw(context){
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.fill();
        if (this.effect.debug){
            context.font = "30px Arial";
            context.fillText("Hello World", 120, 50);
            // document.querySelector("#a1").setAttribute("style", "top: " + this.y + "px;left:" + this.x + "px")
            context.strokeRect(this.x - this.radius, this.y - this.radius, 
                this.radius * 2, this.radius * 2);
                console.log(context);
        }
    }
    update(){
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;

        if (this.y > this.effect.height + this.radius + this.effect.maxDistance 
            || this.x < -this.radius - this.effect.maxDistance
            || this.x > this.effect.width * this.radius * this.effect.maxDistance){
           this.reset();
        }
        // collision detection
        if (
            this.x - this.radius < this.effect.element.x + this.effect.element.width 
            &&
            this.x - this.radius + this.width > this.effect.element.x 
            &&
            this.y < this.effect.element.y + 5 
            &&
            this.height + this.y > this.effect.element.y
        ) {
            // Collision detected!
           this.vy *= -1;
        }
    }
    reset(){
        this.x = this.radius + Math.random() * (this.effect.width - this.radius * 2);
        this.y = -this.radius - this.effect.maxDistance - Math.random() * this.effect.height * 0.2;
    }
}

class Effect {
    constructor(canvas, context){
        this.canvas = canvas;
        this.context = context;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.particles = [];
        this.numberOfParticles = 300;
        this.createParticles();
        this.debug = true;
        this.element = document.getElementById('caption').getBoundingClientRect();


        this.mouse = {
            x: 0,
            y: 0,
            pressed: false,
            radius: 200
        }

        window.addEventListener('keydown', e => {
            if (e.key === 'd'){
                this.debug = !this.debug;
            }
        })
        window.addEventListener('resize', e => {
            this.resize(e.target.window.innerWidth, e.target.window.innerHeight);
        });
        window.addEventListener('mousemove', e => {
            if (this.mouse.pressed){
                this.mouse.x = e.x;
                this.mouse.y = e.y;
            }
        });
        window.addEventListener('mousedown', e => {
            this.mouse.pressed = true;
            this.mouse.x = e.x;
            this.mouse.y = e.y;
        });
        window.addEventListener('mouseup', e => {
            this.mouse.pressed = false;
        });
    }
    createParticles(){
        for (let i = 0; i < this.numberOfParticles; i++){
            this.particles.push(new Particle(this));
        }
    }
    handleParticles(context, canvas){
        this.connectParticles(context);
        this.particles.forEach(particle => {
            particle.draw(context, canvas);
            particle.update();
        });
        if (this.debug){
            context.strokeRect(this.element.x, this.element.y, this.element.width, this.element.height);
        }
    }
    connectParticles(context){
        this.maxDistance = 90;
        for (let a = 0; a < this.particles.length; a++){
            for (let b = a; b < this.particles.length; b++){
                const dx = this.particles[a].x - this.particles[b].x;
                const dy = this.particles[a].y - this.particles[b].y;
                const distance = Math.hypot(dx, dy);
                if (distance < this.maxDistance){
                    context.save();
                    const opacity = 1 - (distance/this.maxDistance);
                    context.globalAlpha = opacity;
                    context.beginPath();
                    context.moveTo(this.particles[a].x, this.particles[a].y);
                    context.lineTo(this.particles[b].x, this.particles[b].y);
                    context.stroke();
                    context.restore();
                }
            }
        }
    }
    resize(width, height){
        this.canvas.width = width;
        this.canvas.height = height;
        this.width = width;
        this.height = height;
        const gradient = ctx.createLinearGradient(0,0,0, canvas.height);
        gradient.addColorStop(0, 'darkblue');
        gradient.addColorStop(0.5, 'white');
        gradient.addColorStop(1, 'lightblue');
        this.context.fillStyle = gradient;
        this.context.strokeStyle = 'white';
        this.particles.forEach(particle => {
            particle.reset();
        });
    }
}
const effect = new Effect(canvas, ctx);

function animate(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    effect.handleParticles(ctx, canvas);
    requestAnimationFrame(animate);
}



// animate();