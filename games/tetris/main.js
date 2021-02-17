const Tetris = (function (zoneId) {
	function Holder(v) {
		this.v = v;
	}
	const W = 10, H = 25;
	let S, i, j, k, c, d = 0, hX = new Holder(0), hY = new Holder(0), hT = new Holder(0), m, n = [
		51264, 12816, 21520, 21520, 25872, 34113, 21537, 38208,
		25921, 38481, 38484, 38209, 25922, 43345, 34388, 38160, 25920, 38177, 42580, 38993
	], timer, ch;
	function get(C, call) {
		for (C, i = n[hT.v]; j = hX.v + i % 4, k = hY.v + Math.floor(i / 4 % 4), i; i >>= 4) {
			call();
		}
	}
	function move(h, l) {
		get(h.v += l, () => {
			if (j < 0 || j >= W || k >= H || m[k * W + j]) c = 0;
		});
		return c ? 1 : (h.v -= l, h == hY && (c = -1));
	}
	const _kb = () => ch;
	const _getch = () => { let tmp = ch; ch = ''; return tmp; };
	function main() {
		timer = setTimeout(main, 50);
		// erase
		get(c = _kb() ? _getch() : 1, () => {
			m[k * W + j] = 0;
		});
		// event
		c === 'ArrowLeft' && move(hX, -1), c === 'ArrowRight' && move(hX, 1), c === 'ArrowDown' && move(hY, 1);
		c === 'ArrowUp' && (i = hT.v < 8 ? 1 : 3, move(hT, hT.v & i ^ i ? 1 : -i));
		// draw
		get(++d - 10 || (d = 0, c = 1, move(hY, 1)), () => {
			m[k * W + j] = 1
		});
		// check
		if (c == -1 && !(hY.v || (c = 27), hT.v = Math.floor(Math.random() * 20), hY.v = hX.v = 0)) {
			for (j = W, i = S - 1; j -= m[i], i; i-- % W || (j = W)) {
				for (j || (k = i += W); !j && (--k >= W);) {
					m[k] = m[k - W];
				}
			}
		}
		draw();
		c == 27 && clearTimeout(timer);
	}
	function draw() {
		// var str = '';
		// console.clear();
		while (i < S) {
			// str += m[i] ? '[]' : '  ';
			m[i] ? document.querySelector(`#grid-${i}`).classList.add('solid') : document.querySelector(`#grid-${i}`).classList.remove('solid');
			// (++i % W) ? str += ' ' : str += '\n';
			i++;
		}
		// console.log(str);
	}
	window.addEventListener('keydown', e => {
		if (e.defaultPrevented) return;
		ch = e.key;
		e.preventDefault();
	}, true);
	S = W * H;
	m = [];
	let zone = document.querySelector(zoneId);
	for (let di = 0; di < S; di++) {
		m[di] = 0;
		let el = zone.appendChild(document.createElement('div'));
		el.id = `grid-${di}`;
	}
	return { start: main, stop: () => { clearTimeout(timer) }, m: m };
})('#zone');

Tetris.start();