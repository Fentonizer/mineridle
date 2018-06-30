// main.js which runs the game's logic and draws most of the HTML to the page on load.
//I am not a good JS programmer, please let me know if any of this is super-super-super
//bad and awful and how I can make it better.

let pause = false;
const Qualities = ["Common", "Rare", "Super", "Ultra", "Epic"];
let cash = 5000;
let upgrades = ["oddsUp", "valueUp", "tickUp", "tierUp"];
let upgradesName = ["Odds+", "Value+", "Tick+", "Tier+"]; 

class Resource {
	constructor(name, tier, odds, saleVal, oddsUpCost, valueUpCost, tickUpCost, tierUpCost) {
	
		//creates the basic objects and an array of odds
		const t = this;
		this.name = name;
		this.nameU = upper(name);
		this.tier = tier;
		this.qual = {};
		this.saleVal = saleVal;
		this.odds = odds;
		this.tickLength = 2000;
		this.oddsUpCost = oddsUpCost;
		this.valueUpCost = valueUpCost;
		this.tickUpCost = tickUpCost;
		this.tierUpCost = tierUpCost;

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

		//function handling the tick speed increase upgrade
		this.tickUp = function() {
			if (cash >= this.tickUpCost) {
				cash = cash - tickUpCost;
				this.tickLength = this.tickLength - 500;
				clearTimeout(startMining);
				get(name+"TickLength").innerHTML = this.tickLength;
				startMining = setInterval(function() {t.mine();}, this.tickLength);
			}
			else noCash();
		}

		//function handling the improved odds upgrade
		this.oddsUp = function() {
			if (this.odds[4] < 1) {
				if (cash >= this.oddsUpCost) {
					cash = cash - this.oddsUpCost;
					for (let i in this.odds) {
						this.odds[i] = ((this.odds[i] * 1000 + 25) / 1000);
						console.log(this.odds[i]);
					}
					this.oddsUpCost = Math.round(this.oddsUpCost * 1.1);
					get("help").innerHTML=("This upgrade costs: £"+beautify(this.oddsUpCost));
				}
				else noCash();
			}
			else maxOdds(this.nameU);
		}

		//adds the qualities to the just created object based on the tier of the resource
		for (let i = 0; i < tier + 1; i++) {
			this.qual[Qualities[i]] = 0;
		}		

		//draws the HTML to the page
		get(name).innerHTML+=("<span class='resTitle'><span>"+this.nameU+"<span class='tick' id='"+name+"TickLength'>"+this.tickLength+"</span></span></span>");
		get(name).innerHTML+=("<button class='sellButton' id='"+name+"Sell'>SELL</button>");
		get(name).innerHTML+=("<span class='totValue'>£<span id="+name+"Value>0</span></span>");

		for (let i in this.qual) {
			get(name).innerHTML+=("<span class='resLine'>"+i+":</span>");
			get(name).innerHTML+=("<span class='resValue "+i+"' id="+name+i+">0</span>")
		}

		for (let i = 0; i < upgrades.length; i++) {
			let x = name+upper(upgrades[i]);
			get(name).innerHTML+=("<button id='"+x+"'>"+upgradesName[i]+"</button>");
			get(x).className+=("upgrade "+upgrades[i]);
		}

		for (let i = 0; i < upgrades.length; i++) {
			get(name+upper(upgrades[i])).addEventListener("mouseenter", help.bind(this, upgrades[i]+"Cost"));
			get(name+upper(upgrades[i])).addEventListener("mouseleave", helpClear.bind(this, upgrades[i]+"Cost"));
		}

		get(name).style.opacity = "1"
		get(name+"Sell").onclick = this.sell.bind(this);
		get(name+upper(upgrades[0])).onclick = this.oddsUp.bind(this);
		// get(name+upper(upgrades[1])).onclick = this.valueUp.bind(this);
		get(name+upper(upgrades[2])).onclick = this.tickUp.bind(this);
		// get(name+upper(upgrades[3])).onclick = this.tierUp.bind(this);

		//begins to mine the resource
		let startMining = setInterval(function() {t.mine();}, this.tickLength);
	}

	mine() {
		if (pause === false) { 
			let x = Math.random(), j = 0, t = this;
			console.log(this.name+" rolled: "+x.toFixed(3));
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
	get("infoDisplay").classList.add("feedbackCash");
	setTimeout(function() { get("cashDisplay").classList.remove("feedbackCash"); }, 1000);
	setTimeout(function() { get("infoDisplay").classList.remove("feedbackCash"); }, 1000);

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

function help(item) {
	get("infoDisplay").style.opacity = "1"
	get("help").innerHTML = "This upgrade costs: £"+beautify(this[item]);
}

function maxOdds(item) {
	get("infoDisplay").style.opacity = "1"
	get("help").innerHTML = item+" is already at the maximum odds!";
}

function helpClear() {
	get("infoDisplay").style.opacity = "0"
}

function beautify(x)
{
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// constructor(name, tier, odds, saleVal, oddsUpCost, valueUpCost, tickUpCost, tierUpCost)
const Peridoto = new Resource("peridoto", 0, [0.2, 0.3, 0.35, 0.37, 0.375], [1, 3, 8, 22, 120], 10, 500, 5000, 25000);
const Jasper = new Resource("jasper", 1, [0.25, 0.45], [1, 2, 5, 15, 100]);
const Carnelian = new Resource("carnelian", 2, [0.3, 0.4], [2, 4, 12, 15, 1000]);
const Ariaga = new Resource("ariaga", 3, [0.2, 0.3, 0.35, 0.37, 0.375], [1, 3, 8, 22, 120]);
const Ariaga2 = new Resource("ariaga2", 4, [0.25, 0.45], [1, 2, 5, 15, 100]);

window.setInterval(function() {
	get("cash").innerHTML = beautify(cash);
	}, 30);