let pause = false;
const Qualities = ["Common", "Rare", "Super", "Ultra", "Epic"];
let cash = 0;

// TIER 1 - C / R
// TIER 2 - C / R / S
// TIER 3 - C / R / S / U
// TIER 4 - C / R / S / U / E

class Resource {
	constructor(name, tier, odds, costs) {
	
		//creates the basic objects and an array of odds
		var t = this;
		this.nameU = upper(name);
		this.nameL = name;
		this.tier = tier;
		this.qual = {};
		this.costs = costs;
		this.odds = odds;

		//selling function
		this.sell = function () {
			cash = cash + t.val();
			for (let i in t.qual) {
				t.qual[i] = 0;
				get(t.nameL+i).innerHTML = t.qual[i];
			}
			get(t.nameL+"Value").innerHTML = t.val();
		}

		//calculating the total value of the stored resources
		this.val = function() {
			let x = 0, j = 0;
			for (let i in this.qual) {
				x = x + (this.qual[i] * this.costs[j])
				j++;
			}
			return x;
		}

		this.tierUp = function() {
			//write code to put more HTML on the screen when the resources tier goes up
		}
		
		//adds the qualities to the just created object based on the tier of the resource
		for (let i = 0; i < tier + 1; i++) {
			this.qual[Qualities[i]] = 0;
		}		

		//draws the HTML to the page
		get(name).innerHTML+=("<span class='resTitle'>"+this.nameU+"</span>");
		get(name).innerHTML+=("<button class='sellButton' id='"+name+"Sell'>SELL</button>")
		get(name).innerHTML+=("<span class='totValue'>£<span id="+name+"Value>0</span></span>")
		for (let i in this.qual) {
			get(name).innerHTML+=("<span class='resLine'>"+i+":</span><span class='resValue "+i+"' id="+name+i+">0</span>")
		}
		get(name).style.opacity = "1"
		document.getElementById(name+"Sell").onclick = this.sell;

		//begins to mine the resource
		setInterval(function() { t.mine(); }, 1000);

		}

	mine() {
		if (pause === false) { 
			let x = Math.random();
			let j = 0;
			let t = this;
			for (let i in this.qual) {
				if (x < this.odds[j]) {
					this.qual[i]++;
					get(this.nameL+i).innerHTML = this.qual[i];
					get(this.nameL+"Value").innerHTML = this.val();
					get(this.nameL+i).classList.add("feedback"+i);
					setTimeout(function() { get(t.nameL+i).classList.remove("feedback"+i); }, 499);
					break;
				}
				j++;
			}
		}
	}
}

function get(el) {
	return document.getElementById(el);
}

function upper(str) {
	return str.replace(/^\w/, c => c.toUpperCase()); //https://joshtronic.com/2016/02/14/how-to-capitalize-the-first-letter-in-a-string-in-javascript/
}

function pauseGame() {
	if (pause === false) {
		pause = true;
	}
	else {
		pause = false;
		}
	console.log(pause)
}

const Peridoto = new Resource("peridoto", 4, [0.2, 0.3, 0.35, 0.37, 0.375], [1, 3, 8, 22, 120]);
const Jasper = new Resource("jasper", 3, [0.25, 0.45], [1, 2, 5, 15, 100]);
const Carnelian = new Resource("carnelian", 1, [0.3, 0.4], [2, 4, 12, 15, 1000]);

window.setInterval(function() {
	get("cash").innerHTML = cash;
	}, 30);