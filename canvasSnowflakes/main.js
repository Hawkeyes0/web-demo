/**
 * @type {HTMLCanvasElement}
 */
let c;
/**
 * @type {CanvasRenderingContext2D}
 */
let ctx;
let res;
let startTime;
let flakes = [];
let size = 30;
let speed = 50;
let running = false;
let depth = 200;

function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(undefined);
        }, ms);
    });
}

function random(a, b) {
    if (!isNaN(a) && !isNaN(b))
        return Math.random() * Math.abs(a - b) + Math.min(a, b);
    if (!isNaN(a) && a > 0)
        return Math.random() * a;
    return Math.random();
}

function SnowFlake() {
    this.random = () => {
        this.depth = random(-50, 150);
        let scale = (depth - this.depth) / depth;
        this.baseX = random(c.width);
        this.radius = random(10, 100);
        this.degOffset = random(0, Math.PI);
        this.blur = Math.floor(Math.abs(this.depth) / 30);
        this.size = scale * size * 0.75 + 0.3125;
        this.speed = scale * speed;
        this.y = -this.size;
        this.last = 0;
        return this;
    };
    this.random();
}

/**
 * load resources
 * @returns {object} resources
 */
async function loadResource() {
    let rs = {};
    let loaded = 0;
    rs.bg = new Image();
    rs.bg.onload = () => { loaded++; };
    rs.bg.src = 'bg.jpg';
    rs.sf = new Image();
    rs.sf.onload = () => { loaded++; };
    rs.sf.src = 'sf.svg';

    while (loaded < 2) {
        console.debug(loaded);
        await sleep(500);
    }
    return rs;
}

async function main(num) {
    c = document.getElementById('g');
    ctx = c.getContext('2d');
    c.width = window.innerWidth;
    c.height = window.innerHeight;
    console.debug(ctx);
    res = await loadResource();

    for (let i = 0; i < num; i++) {
        flakes.push(new SnowFlake());
    }

    start();
}

/**
 * @type {FrameRequestCallback}
 */
function draw(time) {
    if (!startTime) {
        startTime = time;
    }
    let bgblur = 10;
    let dtime = (time - startTime) / 3000;
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.filter = `blur(${bgblur}px)`;
    ctx.drawImage(res.bg, -bgblur * 2, -bgblur * 2, c.width + bgblur * 4, c.height + bgblur * 4);
    ctx.filter = 'none';

    for (let item of flakes) {
        drawItem(item, time, dtime)
    }

    running && requestAnimationFrame(draw);
}

function drawItem(item, time, dtime) {
    item.y += (item.last ? time - item.last : dtime) / 1000 * item.speed;
    let dx = Math.cos(dtime + item.degOffset) * item.radius + item.baseX;

    //ctx.filter = `blur(${item.blur}px)`;
    res.sf.style.filter = `blue(${item.blur}px)`;
    ctx.translate(dx, item.y);
    ctx.rotate(dtime + item.degOffset + item.speed);

    ctx.drawImage(res.sf, 0, 0, item.size, item.size);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    if (item.y > c.height + item.size) {
        item.random();
    }
    item.last = time;
}

function start() {
    running = true;
    requestAnimationFrame(draw);
}

function stop() {
    startTime = 0;
    running = false;
}

window.onload = () => {
    main(window.innerWidth * window.innerHeight / 100 / 100 * 0.618);
}

window.onresize = () => {
    c.width = window.innerWidth;
    c.height = window.innerHeight;
}

window.onunload = () => {
    stop();
}