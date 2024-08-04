const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
ctx.strokeStyle = 'transparent';
ctx.lineWidth = 2;

/*  ------------Adding Linear Gradients--------------  */

/* const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const startRadius = 0;
const endRadius = Math.min(centerX, centerY);

const gradient = ctx.createRadialGradient(centerX, centerY, startRadius, centerX, centerY, endRadius); */

const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
gradient.addColorStop(0, '#7469B6');
gradient.addColorStop(0.4, '#874CCC');
gradient.addColorStop(1, '#C40C0C');

class Particles
{
    constructor(effect)
    {
        this.effect = effect;
        this.radius = Math.random() * 60 + 2;
        this.x = this.radius + Math.random() * (this.effect.width - 2 * this.radius);
        this.y = this.radius + Math.random() * (this.effect.height -2 * this.radius);
        this.vx = Math.random() * 0.7 - 0.5;
        this.vy = Math.random() * 0.7 - 0.5;
        this.pushX = 0;
        this.pushY = 0;
        this.friction = 0.80;
        this.frictionY = 0.4;
    }

    draw(context)
    {
        context.fillStyle = gradient;
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        context.fill();
        context.stroke();
    }

    update()
    {
        if(this.effect.mouse.pressed)
        {
            const dx = this.x - this.effect.mouse.x;
            const dy = this.y - this.effect.mouse.y;
            const dist = Math.hypot(dy, dx);

            if(dist < this.effect.mouse.radius)
            {
                const angle = Math.atan2(dy, dx);
                this.pushX -= Math.cos(angle) * dist / 25;
                this.pushY -= Math.sin(angle) * dist / 25;
            }
        }
        
        this.x += (this.pushX *= this.friction) + this.vx;
        this.y += (this.pushY *= this.frictionY) + this.vy;

        if(this.x < this.radius)
        {
            this.x = this.radius;
            this.vx *= -1;
        }

        else if(this.x > this.effect.width - this.radius)
        {
            this.x = this.effect.width - this.radius;
            this.vx *= -1;
        }

        if(this.y < this.radius)
        {
            this.y = this.radius;
            this.vy *= -1;
        }

        else if(this.y > this.effect.height - this.radius)
        {
            this.y = this.effect.height - this.radius;
            this.vy += -1;
        }
    }

    reset()
    {
        this.x = this.radius + Math.random() * (this.effect.width - 2 * this.radius);
        this.y = this.radius + Math.random() * (this.effect.height - 2 * this.radius);
    }
}

class Effect
{
    constructor(canvas, context)
    {
        this.context = context
        this.canvas = canvas;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.particles = [];
        if(window.innerWidth <= 750)
            this.numberOfParticles = 100;
        else 
            this.numberOfParticles = 160;
        this.createParticles();

        this.mouse = 
        {   x: 0,
            y: 0,
            pressed: false,
            radius: 250,
        };

        window.addEventListener('resize', e => {
            this.resize(e.target.window.innerWidth, e.target.window.innerHeight, context);
        });

        window.addEventListener('mousemove', e => {
            if(this.mouse.pressed)
            {
                this.mouse.x = e.x;
                this.mouse.y = e.y;
            }
        });

        window.addEventListener('mousedown', e=> {
            this.mouse.pressed = true;
            this.mouse.x = e.x;
            this.mouse.y = e.y;
        });

        window.addEventListener('mouseup', e => {
            this.mouse.pressed = false;
        });

        /* window.addEventListener('touchmove', e=> {
            e.preventDefault();
            if (this.mouse.pressed) {
                this.mouse.x = e.touches[0].clientX;
                this.mouse.y = e.touches[0].clientY;
            }
        });

        window.addEventListener('touchstart', e => {
            e.preventDefault(); 
            this.mouse.pressed = true;
            this.mouse.x = e.touches[0].clientX;
            this.mouse.y = e.touches[0].clientY;
        });

        window.addEventListener('touchend', e => {
            this.mouse.pressed = false;
        }) */
    }

    createParticles()
    {
        for(let i = 0 ; i < this.numberOfParticles ; i++)
            this.particles.push(new Particles(this));
    }

    handleParticles(context)
    {
        this.connectParticles(context);
        this.particles.forEach(particle => {
            particle.draw(context);
            particle.update();
        });
    }

    connectParticles(context)
    {
        const maxDistance = 120;
        for(let i = 0 ; i < this.particles.length ; i++)
        {   for(let j = 0 ; j < this.particles.length ; j++)
            {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const dist = Math.hypot(dy, dx);
                if(dist < maxDistance)
                {
                    context.save();
                    const opacity = 1 - (dist/maxDistance);
                    context.globalAlpha = opacity;
                    context.beginPath();
                    context.moveTo(this.particles[i].x, this.particles[i].y);
                    context.lineTo(this.particles[j].x, this.particles[j].y);
                    context.stroke();
                    context.restore();
                }
            }
        }
    }

    resize(width, height, context)
    {
        this.canvas.width = width;
        this.canvas.height = height;
        this.width = width;
        this.height = height;
        context.fillStyle = gradient;
        context.strokeStyle = 'transparent';
        context.lineWidth = 2;
        this.particles.forEach(particle => {
            particle.reset();
        })
    }
}

const effects = new Effect(canvas, ctx);

function animate()
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    effects.handleParticles(ctx);
    requestAnimationFrame(animate);
}
animate();


/* -----------TEXT ANIMATION----------- */
const alpahbets = "ABCDEFGHIJKLMNOPQRSTUVWXY";
let interval = null;
const text = document.querySelectorAll('.anim');

text.forEach(element => {
    element.addEventListener('mouseup', event => {
        let iteration = 0;
        clearInterval(interval);

        // Save the original text content
        const originalText = event.target.dataset.value;

        interval = setInterval(() => {
            event.target.innerText = originalText
                .split("")
                .map((alphabet, index) => {
                    if (index < iteration) {
                        return originalText[index];
                    }

                    return alpahbets[Math.floor(Math.random() * 26)];
                })
                .join("");

            if (iteration >= originalText.length) {
                clearInterval(interval);
            }

            iteration += 1 / 3;
        }, 20);
    });
});


/* ----------- Adding Section Animations -----------*/

const intersect = document.querySelectorAll(".intersect");

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if(entry.isIntersecting)
        {
            entry.target.classList.add("show-intersect");
        }
        else
        {
            entry.target.classList.remove("show-intersect");
        }
    });
});

intersect.forEach((ele) => observer.observe(ele));


/* ----------- Adding Preloader Animations -----------*/
const preloader = document.querySelector('.preloader')
window.addEventListener('load', () => {
    preloader.classList.add('hide-preloader')
})

/* -----------
                  Carousels   
                                ----------- */

const sliderHardware = document.querySelector(".slider-hardware");
const sliderWeb = document.querySelector(".slider-web");
const sliderAnalytics = document.querySelector(".slider-analytics");
const sliderTechnicalSkils = document.querySelector(".technical-skills");
const sliderNonTechnicalSkils = document.querySelector(".nonTechnical-skills");

const dataHardware = [
    {
        id: 1,
        name: "Obstacle Avoidance Bot",
        date: "17=08=2023",
        desc: "The obstacle avoidance bot is my first Arduino project. It is a simple bot designed in a way to avoid any obstacles and chose a path filled with none or minimum. It makes use of Arduino Uno board, an ultrasonic sensor mounted on a servo mortor at the front, and two mortors. I wrote the code by myself with some help from resources from the internet.",
        video: "",
        img: "./Sources/Projects/Obstacle avoidance bot_edited.jpg"
    },

    {
        id: 2,
        name: "Line Tracker",
        date: "12-06-2024",
        desc: "This is my second project using Arduino Uno board. It moves along the path covered with a black tape. It makes use of 2 Infrared sensors to find the black track and follows it. Here I used the drv8833 driver module and 2 mortors.",
        video: "",
        img: "./Sources/Projects/Line tracker_edited.jpg"
    },

];

const dataWeb = [
    {
        id: 1,
        name: ""
    }
];


function displaySlideIcon(cards) {
    const IconHTML = cards.map((item) => `<div class="slide-icons"></div>`).join('');
    return IconHTML;
}


function displayCard(cards) {
    let card = cards.map((item)=>{
      return `<div class="slide inactive">
                <img src=${item.img} alt=${item.name} class="card-img">
                <div class="info">
                  <h2>${item.name}</h2>
                  <p>${item.desc}</p>
                </div>
              </div>`;
    });
    card.push(`<div class="navigation-visibility"></div>`);
    card = card.join('');  //Joins all the strings together to form one large string
    container.innerHTML = card;

    const iconsContainer = document.querySelector('.navigation-visibility'); 
    iconsContainer.innerHTML = displaySlideIcon(cards);
    container.innerHTML += `<div class="navigation">
                                <i class="fas fa-chevron-left prev-btn"></i>
                                <i class="fas fa-chevron-right next-btn"></i>
                            </div>`;

    // Add event listeners after elements are rendered
    addEventListeners();
    repeater();
}


function addEventListeners() {
    const nextBtn = document.querySelector('.next-btn');
    const prevBtn = document.querySelector('.prev-btn');
    const slides = document.querySelectorAll('.slides');
    const slideIcons = document.querySelectorAll('.slide-icons');

    let currentSlide = 0;
    let numSlides = slides.length;

    slides[currentSlide].classList.add("active");
    slideIcons[currentSlide].classList.add("active");
    slides[currentSlide].classList.remove("inactive");
    
    
}