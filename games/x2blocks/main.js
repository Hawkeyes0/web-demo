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
				el.appendChild(createText(children[i]));
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

	for (let i = 0; i < cells.length; i++) {
		var c = cells[i];
		c.dataset.r = Math.floor(i / 5);
		c.dataset.c = i % 5;
	}

	for (let i = 1; i <= 15; i++) {
		nextValues.push(Math.pow(2, i));
	}

	function random(take, skip) {
		var v = Math.floor(Math.random() * take) % take;
		return nextValues[v + skip];
	}

	let Game = {};
	Game.zone = zone;
	Game.next = random(6, 0);
	Game.init = function () {
		for (let i = 0; i < cells.length; i++) {
			cells[i].innerHTML = '';
		}
		nextCell.appendChild(createElement('div', { 'class': 'block' }, Game.next));
	}
	return Game;
})();

window.Game.init();
