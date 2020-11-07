/**
* Create a new HTML Element
* @param {string} tagName Element tag name
* @param {any} attrs Element's attributes
* @param {(HTMLElement|string)[]} children content
* @return {HTMLElement} new HTML Element
*/
function createElement(tagName, attrs, ...children) {
	var el = document.createElement(tagName);
	if (attrs) {
		for (var k in attrs) {
			el.setAttribute(k, attrs[k]);
		}
	}
	if (children && Array.isArray(children)) {
		for (var i = 0; i < children.length; i++) {
			if (children[i] instanceof Node) {
				el.appendChild(children[i]);
			} else {
				children[i] && el.appendChild(createText(children[i]));
			}
		}
	}
	return el;
}

function createText(str) {
	return document.createTextNode(str);
}

window.Game = (function () {
	let zone = new Array(30);
	let nextValues = []
	let cells = document.querySelectorAll('#game-zone .cell');
	let nextCell = document.getElementById('next');
	const speed = 1000;

	for (let i = 0; i < cells.length; i++) {
		var c = cells[i];
		c.dataset.r = Math.floor(i / 5);
		c.dataset.c = i % 5;
		c.addEventListener('click', appendNext);
		c.addEventListener('touch', appendNext);
		zone[i] = c;
		Object.defineProperty(c, 'value', {
			get: function () { return this.firstChild == null ? null : this.firstChild.innerHTML; },
			set: function (val) {
				if (!this.firstChild) {
					this.appendChild(createElement('div', { 'class': 'block' }, val));
				} else {
					this.firstChild.innerHTML = val || '';
				}
			}
		});
	}

	for (let i = 1; i <= 15; i++) {
		nextValues.push(Math.pow(2, i));
	}

	function random(take, skip) {
		var v = Math.floor(Math.random() * take) % take;
		return nextValues[v + skip];
	}

	/**
	 * append next to zone
	 * @param {Event} event event
	 */
	function appendNext(event) {
		var me = event.currentTarget;
		var col = me.dataset.c;
		var blocks = document.querySelectorAll(`.cell[data-c="${col}"`);
		var succ = false;
		var cell;
		for (let c of blocks) {
			if (c.hasChildNodes()) {
				continue;
			} else {
				var n = document.querySelector('#next .block');
				c.appendChild(n);
				Game.genNext();
				succ = true;
				cell = c;
				break;
			}
		}
		if (!cell) {
			cell = blocks[blocks.length - 1];
			if (cell.value == nextCell.firstChild.innerHTML) {
				cell.value = cell.value * 2;
				nextCell.firstChild.remove();
				Game.genNext();
				succ = true;
			}
		}

		if (succ) {
			setTimeout(mergeBlocks, speed, cell);
		}
	}

	/**
	 * merge block
	 * @param {HTMLElement} cell cell
	 */
	function mergeBlocks(cell) {
		if (!cell.value) {
			return;
		}
		let old = cell.value;
		let idx = zone.indexOf(cell);
		let tmp = [];
		if (idx - 5 > -1) {
			tmp.push(zone[idx - 5]);
		}
		if (idx % 5 > 0) {
			tmp.push(zone[idx - 1]);
		}
		if (idx % 5 < 4) {
			tmp.push(zone[idx + 1]);
		}
		let merging = [];
		let result = cell.value;
		for (let t of tmp) {
			if (t.value > 0 && cell.value > 0 && t.value == cell.value) {
				merging.push(t);
				result *= 2;
			}
		}
		cell.value = result;
		for (let c of merging) {
			c.firstChild.remove();
		}

		for (let i = 0; i < zone.length - 5; i++) {
			let curr = zone[i], bot = zone[i + 5];
			if (!curr.value && bot.value) {
				curr.appendChild(bot.firstChild);
			}
		}

		if (cell.value == old) {
			return;
		}
		if (cell.value) {
			setTimeout(mergeBlocks, speed, cell);
		} else {
			if (idx - 5 > -1) {
				setTimeout(mergeBlocks, speed, zone[idx - 5]);
			}
			if (idx % 5 > 0) {
				setTimeout(mergeBlocks, speed, zone[idx - 1]);
			}
			if (idx % 5 < 4) {
				setTimeout(mergeBlocks, speed, zone[idx + 1]);
			}
		}
	}

	function mergeAllBlocks() {
		for (let cell of zone) {
			mergeBlocks(cell);
		}
		//window.requestAnimationFrame(mergeAllBlocks);
	}

	let Game = {};
	Game.zone = zone;
	Game.next;
	Game.skip = 0;
	Game.genNext = function () {
		this.next = random(6, this.skip);
		nextCell.appendChild(createElement('div', { 'class': 'block' }, Game.next));
	};
	Game.init = function () {
		for (let i = 0; i < cells.length; i++) {
			cells[i].innerHTML = '';
		}
		this.genNext();
	}
	//window.requestAnimationFrame(mergeAllBlocks);
	return Game;
})();

window.Game.init();
