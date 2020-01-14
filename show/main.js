let layout = (function () {
    let
        currLayout,

        oldCoordX,
        oldCoordY,
        newCoordX,
        newCoordY,

        minusX = 0,
        minusY = 0,

        liElDegX = 0,
        liElDegY = 0,

        maxNum = 162,

        liElRowMaxNum = 5,
        liElColMaxNum = 5,

        liElOffsetX = 350,
        liElOffsetY = 350,
        liElOffsetZ = 350,

        liElDepDefault = -140,

        depDefault = liElDepDefault - 60,

        liElDepZ = liElDepDefault - 60,

        aScreenNum = liElRowMaxNum * liElColMaxNum,

        liElDepMaxNum = parseInt(maxNum / aScreenNum),

        liElFirstPosX = parseInt('-' + liElRowMaxNum / 2) * liElOffsetX,
        liElFirstPosY = parseInt('-' + liElColMaxNum / 2) * liElOffsetY,
        liElFirstPosZ = parseInt('-' + liElDepMaxNum / 2) * liElOffsetZ;

    function getRandom(low, high) {
        return Math.floor(Math.random() * (high - low + 1) + low);
    }

    function doLayout(func) {
        let arr = [...Array(maxNum).keys()];
        $("#box li").each((i, e) => {
            let idx = getRandom(0, arr.length - 1);
            func(i, arr[idx], e);
            arr.splice(idx, 1);
        });
    }

    function onBall(i, n, dx, dy) {
        let liElDegY = dy * i;
        let liElDegX = dx * i;

        $("#box li").eq(n).css({
            'transform': `rotateY(${liElDegY % 360}deg) rotateX(${liElDegX % 360}deg) translateZ(${Math.abs(liElDepDefault)}vh)`
        });
    }

    let layout = {
        Grid: function () {
            doLayout((i, n) => {
                let offsetStepX = i % aScreenNum % liElRowMaxNum * liElOffsetX,
                    offsetStepY = parseInt(i % aScreenNum / liElColMaxNum) * liElOffsetY,
                    offsetStepZ = parseInt(i / aScreenNum) * liElOffsetZ;

                let liElCoordX = liElFirstPosX + offsetStepX,
                    liElCoordY = liElFirstPosY + offsetStepY,
                    liElCoordZ = liElFirstPosZ + offsetStepZ;

                //debugger;
                $("#box li").eq(n).css({
                    'transform': `translate3d(${liElCoordX}px,${liElCoordY}px,${liElCoordZ}px)`
                });
            });
            currLayout = layout.Grid;
        },
        Helix: function () {
            doLayout((i, n) => {
                let liElDegY = 10 * i;
                let liElDepY = -10 * parseInt(maxNum / 2) + 10 * i;

                $("#box li").eq(n).css({
                    'transform': `rotateY(${liElDegY % 360}deg) translateY(${liElDepY}px) translateZ(${Math.abs(liElDepDefault)}vh)`
                });
            });
            currLayout = layout.Helix;
        },
        Three: function () {
            doLayout((i, n) => onBall(i, n, 60, 3));
            currLayout = layout.Three;
        },
        Geome: function () {
            doLayout((i, n) => onBall(i, n, 2.9, 8.9));
            currLayout = layout.Geome;
        },
        Curve: function () {
            doLayout((i, n) => onBall(i, n, 2, 1));
            currLayout = layout.Curve;
        },
        Sphere: function () {
            doLayout((i, n) => onBall(i, n, 30, 3));
            currLayout = layout.Sphere;
        },
        Chaotic: function () {
            doLayout((_, __, e) => {
                let liElCoordX = (Math.random() - 0.5) * 3000,
                    liElCoordY = (Math.random() - 0.5) * 3000,
                    liElCoordZ = (Math.random() - 0.5) * 3000;

                //debugger;
                $(e).css({
                    'transform': `translate3d(${liElCoordX}px,${liElCoordY}px,${liElCoordZ}px)`
                });
            });
            currLayout = layout.Chaotic;
        },
        Random: function () {
            let idx = getRandom(0, data.length - 2);
            while (layout[data[idx]] === currLayout) {
                idx = getRandom(0, data.length - 2);
            }
            layout[data[idx]]();
        }
    };

    let data = [];
    for (let n in layout) data.push(n);

    function main() {
        $([...Array(maxNum).keys()]).each(_ => {
            let idx = getRandom(0, data.length - 1);

            let spanEl = $(`<span>${data[idx]}</span>`)
                .css('color', `rgb(${getRandom(100, 255)},${getRandom(100, 255)},${getRandom(100, 255)})`);
            let liEl = $('<li></li>').attr('title', data[idx]).append(spanEl);

            $("#box").append(liEl);
        });

        $("#box li").click(function () {
            layout[$(this).text()]();
        });

        $(document).on('mousedown', event => {
            event = event || window.event;
            //event.preventDefault && event.preventDefault();

            oldCoordX = event.clientX;
            oldCoordY = event.clientY;

            $("#box").css('transition', 'transform 0s');

            $(document).on('mousemove', event => {
                event = event || window.event;
                event.preventDefault && event.preventDefault();

                newCoordX = event.clientX;
                newCoordY = event.clientY;

                minusX = newCoordX - oldCoordX;
                minusY = newCoordY - oldCoordY;

                oldCoordX = newCoordX;
                oldCoordY = newCoordY;

                liElDegX -= minusY * 0.1;
                liElDegY += minusX * 0.1;

                $("#box").css('transform', `translateZ(${liElDepZ}vh) rotateX(${liElDegX}deg) rotateY(${liElDegY}deg)`);
            });
        }).on('mouseup', _ => {
            $(document).off('mousemove');

            $("#box").css('transition', '');

            liElDegX -= minusY * 0.1;
            liElDegY += minusX * 0.1;

            $("#box").css('transform', `translateZ(${liElDepZ}vh) rotateX(${liElDegX}deg) rotateY(${liElDegY}deg)`);
        }).on('wheel', e => {

            let step = e.originalEvent.deltaY && (e.originalEvent.deltaY > 0 ? -1 : 1) || e.originalEvent.detail && (e.originalEvent.detail > 0 ? -1 : 1);
            liElDepZ = depDefault += step * 36;

            $("#box").css('transform', `translateZ(${liElDepZ}vh) rotateX(${liElDegX}deg) rotateY(${liElDegY}deg)`);
        });

        setTimeout(layout.Grid, 1000);
    }

    main();
    let dist;
    document.addEventListener('touchstart', ev => {
        // if one point, invoke mouse event
        if (ev.touches.length === 1) {
            document.dispatchEvent(new MouseEvent('mousedown', {
                clientX: ev.touches[0].clientX,
                clientY: ev.touches[0].clientY
            }));
        }
        // if two points, invoke wheel event
        else if (ev.touches.length === 2) {
            let t1 = ev.touches[0],
                t2 = ev.touches[1];
            dist = Math.pow(t1.clientX - t2.clientX, 2) + Math.pow(t1.clientY - t2.clientY, 2);
        }
    });
    document.addEventListener('touchend', ev => {
        document.dispatchEvent(new MouseEvent('mouseup', {
            clientX: ev.changedTouches[0].clientX,
            clientY: ev.changedTouches[0].clientY
        }));
    });
    document.addEventListener('touchmove', ev => {
        if (ev.touches.length === 1) {
            document.dispatchEvent(new MouseEvent('mousemove', {
                clientX: ev.changedTouches[0].clientX,
                clientY: ev.changedTouches[0].clientY
            }));
        } else if (ev.touches.length === 2) {
            //let dbg = document.getElementById('debug');

            let t1 = ev.touches[0],
                t2 = ev.touches[1];
            let newDist = Math.pow(t1.clientX - t2.clientX, 2) + Math.pow(t1.clientY - t2.clientY, 2);

            //dbg.innerHTML = `touchmove: [0: {x: ${ev.touches[0].clientX}, y: ${ev.touches[0].clientY}}, 1: {x: ${ev.touches[1].clientX}, y: ${ev.touches[1].clientY}}]<br/>moved: ${Math.abs(newDist - dist)}`;

            if (Math.abs(newDist - dist) > 1000) {
                let wheel = newDist < dist ? 1 : -1;
                document.dispatchEvent(new WheelEvent('wheel', {
                    deltaY: wheel
                }));
                dist = newDist;
            }
        }
    });
    return layout;
})();