const cloud = (function () {
    const dist = 160, dep = 200;
    let options = {
        maxnum: 128
    };
    let random = (min, max) => {
        return Math.random() * Math.abs(max - min) + min;
    };
    let cloud = {};

    let flowers = Array(options.maxnum);
    let elcloud = document.getElementById('cloud');
    let handle, starttime;

    let createFlowers = () => {
        for (let i = 0; i < flowers.length; i++) {
            flowers[i] = document.createElement('img');
            flowers[i].src = 'sf.svg';
            flowers[i].alt = 'snowflower';
            flowers[i].speed = random(0, 3);
            flowers[i].dataset.z = random(-50, 150);
            flowers[i].dataset.d = random(5, 20);
            flowers[i].dataset.x = random(-50, 50) / dist * (dist + dep - parseFloat(flowers[i].dataset.z));
            flowers[i].dataset.y = -window.innerHeight * 0.82;
            flowers[i].dataset.dd = random(0, Math.PI);
            flowers[i].dataset.b = Math.round(Math.abs(parseFloat(flowers[i].dataset.z) / 10));
            flowers[i].setAttribute('style', `top: ${flowers[i].dataset.y}px; left: ${flowers[i].dataset.x}vw; transform: translateZ(${flowers[i].dataset.z}vw); filter: blur(${flowers[i].dataset.b}px);`);
            elcloud.appendChild(flowers[i]);
        }
    };

    createFlowers();

    cloud.snow = timestamp => {
        if (!timestamp) {
            handle = requestAnimationFrame(cloud.snow);
            return;
        }

        if (!starttime) {
            starttime = timestamp;
        }

        let deg = (timestamp - starttime) / 3000;
        for (let item of flowers) {
            item.dataset.y = parseFloat(item.dataset.y) + item.speed;
            if (item.dataset.y > window.innerHeight / dist * (dist + dep - parseFloat(item.dataset.z))) {
                item.dataset.y = -window.innerHeight * 0.82;
                item.dataset.z = random(-50, 150);
                item.dataset.x = random(-50, 50) / dist * (dist + dep - parseFloat(item.dataset.z));
                item.speed = random(0, 3);
                item.dataset.dd = random(0, Math.PI);
                item.dataset.b = Math.round(Math.abs(parseFloat(item.dataset.z) / 10));
            }
            let dx = Math.cos(deg + parseFloat(item.dataset.dd)) * parseFloat(item.dataset.d) + parseFloat(item.dataset.x);
            item.setAttribute('style', `top: ${item.dataset.y}px; left: ${dx}vw; transform: translateZ(${item.dataset.z}vw); filter: blur(${item.dataset.b}px);`);
        }
        handle = requestAnimationFrame(cloud.snow);
    };

    cloud.stop = () => {
        cancelAnimationFrame(handle);
        starttime = undefined;
        handle = undefined;
    }
    window.onunload = cloud.stop;
    return cloud;
})();
cloud.snow();