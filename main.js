// main.js which runs the game's logic and draws most of the HTML to the page on load. I am not a good JS programmer, please let me know if any of this is super-super-super bad and awful and how I can make it better.

let pause = false;
const Qualities = ["Common", "Rare", "Super", "Ultra", "Epic"];
let cash = 5;
let upgrades = ["tierUp", "oddsUp", "valueUp", "tickUp"];
let upgradesName = ["Tier+", "Odds+", "Value+", "Tick+"] 

// TIER 1 - C / R
// TIER 2 - C / R / S
// TIER 3 - C / R / S / U
// TIER 4 - C / R / S / U / E

class Resource {
	constructor(name, tier, odds, saleVal) {
	
		//creates the basic objects and an array of odds
		const t = this;
		let startMining;
		this.name = name;
		this.nameU = upper(name);
		this.tier = tier;
		this.qual = {};
		this.saleVal = saleVal;
		this.odds = odds;
		this.tickLength = 2000;
		this.tickUpCost = 5000;
		this.tierUpCost = 10000;

		//selling function
		this.sell = function () {
			cash = cash + t.val();
			for (let i in this.qual) {
				this.qual[i] = 0;
				get(name+i).innerHTML = this.qual[i];
			}
			get(t.name+"Value").innerHTML = t.val();
		}

		//calculating the total value of the stored resources
		this.val = function() {
			let x = 0, j = 0;
			for (let i in this.qual) {
				x = x + (this.qual[i] * this.saleVal[j]);
				j++;
			}
			return x;
		}

		this.tickUp = function() {
			if (cash > this.tickUpCost) {
				cash = cash - tickUpCost;
				this.tickLength = this.tickLength - 500;
				clearTimeout(startMining);
				get(name+"TickLength").innerHTML = this.tickLength;
				startMining = setInterval(function() {t.mine();}, this.tickLength);
			}
			else noCash();
		}

		//adds the qualities to the just created object based on the tier of the resource
		for (let i = 0; i < tier + 1; i++) {
			this.qual[Qualities[i]] = 0;
		}		

		//draws the HTML to the page
		get(name).innerHTML+=("<span class='resTitle'><span>"+this.nameU+" <span class='tick' id='"+name+"TickLength'>"+this.tickLength+"</span></span>");
		get(name).innerHTML+=("<button class='sellButton' id='"+name+"Sell'>SELL</button>");
		get(name).innerHTML+=("<span class='totValue'>£<span id="+name+"Value>0</span></span>");
		for (let i in this.qual) {
			get(name).innerHTML+=("<span class='resLine'>"+i+":</span><span class='resValue "+i+"' id="+name+i+">0</span>");
		}
		for (let i = 0; i < upgrades.length; i++) {
			get(name).innerHTML+=("<button class='upgrade "+upgrades[i]+"' id='"+name+upper(upgrades[i])+"'>"+upgradesName[i]+"</button>");
		}
		get(name).style.opacity = "1"
		get(name+"Sell").onclick = this.sell.bind(this);
		get(name+upper(upgrades[3])).onclick = this.tickUp.bind(this);

		//begins to mine the resource
		startMining = setInterval(function() {t.mine();}, this.tickLength);
	}

	mine() {
		if (pause === false) { 
			let x = Math.random();
			let j = 0;
			let t = this;
			console.log(this.name+" rolled: "+x.toFixed(2));
			get(this.name+"TickLength").classList.add("feedbackTick");
			setTimeout(function() { get(t.name+"TickLength").classList.remove("feedbackTick"); }, 499);
			for (let i in this.qual) {
				if (x < this.odds[j]) {
					this.qual[i]++;
					get(this.name+i).innerHTML = this.qual[i];
					get(this.name+"Value").innerHTML = this.val();
					get(this.name+i).classList.add("feedback"+i);
					setTimeout(function() { get(t.name+i).classList.remove("feedback"+i); }, 499);
					break;
				}
			j++;
			}
		}
	}
}

function noCash() {
	get("cashDisplay").classList.add("feedbackCash");
	setTimeout(function() { get("cashDisplay").classList.remove("feedbackCash"); }, 1000);
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

const Peridoto = new Resource("peridoto", 1, [0.2, 0.3, 0.35, 0.37, 0.375], [1, 3, 8, 22, 120]);
// const Jasper = new Resource("jasper", 1, [0.25, 0.45], [1, 2, 5, 15, 100]);
// const Carnelian = new Resource("carnelian", 1, [0.3, 0.4], [2, 4, 12, 15, 1000]);

window.setInterval(function() {
	get("cash").innerHTML = cash;
	}, 30);