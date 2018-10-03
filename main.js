// main.js which runs the game's logic and draws most of the HTML to the page on load.
//I am not a good JS programmer, please let me know if any of this is super-super-super
//bad and awful and how I can make it better.

let pause = false;
let helpOn = false;
const qualities = ["Common", "Rare", "Super", "Ultra", "Epic"];
let cash = 1000;
let upgrades = ["oddsUp", "valueUp", "tickUp", "tierUp"];
let upgradesName = ["Odds+", "Value+", "Tick+", "Tier+"];

class Resource {
	constructor(name, tier, odds, saleVal, oddsUpCost, valueUpCost, tickUpCost, tierUpCost) {
	
		//creates the basic objects and an array of odds
		const t = this;
		this.name = name;
		this.nameU = upper(name);
		this.nameShort = upper(name).substring(0,3);
		this.tier = tier;
		this.qual = {};
		this.saleVal = saleVal;
		this.odds = odds;
		this.tickLength = 2000;
		this.oddsUpCost = oddsUpCost;
		this.valueUpCost = valueUpCost;
		this.tickUpCost = tickUpCost;
		this.tierUpCost = tierUpCost;
		this.tooltipVisible = false;

		this.tooltip = function() {
			let el = "tt" + this.nameU
			if (this.tooltipVisible == false) {
				get(el).style.opacity = 1;
				get(el).style.zIndex = 1;
				this.tooltipVisible = true;
			}
			else {
			get(el).style.opacity = 0;
			get(el).style.zIndex = -1;
			this.tooltipVisible = false;
			}			 
		};

		//selling function
		this.sell = function () {
			cash = cash + t.val();
			for (let i in this.qual) {
				this.qual[i] = 0;
				get(name+i).innerHTML = this.qual[i];
			}
			get(t.name+"Value").innerHTML = t.val();
		};

		//calculating the total value of the stored resources
		this.val = function() {
			let x = 0, j = 0;
			for (let i in this.qual) {
				x = x + (this.qual[i] * this.saleVal[j]);
				j++;
			}
			return x;
		};

		//function handling the tick speed increase upgrade
		this.tickUp = function() {
			if (cash >= this.tickUpCost) {
				cash = cash - this.tickUpCost;
				this.tickLength = this.tickLength - 50;
				this.tickUpCost = Math.round(this.tickUpCost * 1.5);
				get("help").innerHTML=("This upgrade costs: £"+beautify(this.tickUpCost));
				clearTimeout(startMining);
				get(name+"TickLength").innerHTML = this.tickLength;
				startMining = setInterval(function() {t.mine();}, this.tickLength);
			}
			else noCash();
		};

		//function handling the improved odds upgrade
		this.oddsUp = function() {
			if (this.odds[4] < 1) {
				if (cash >= this.oddsUpCost) {
					cash = cash - this.oddsUpCost;
					for (let i = 0; i < this.odds.length; i++) {
						this.odds[i] = ((this.odds[i] * 1000 + 25) / 1000);
					}
					this.oddsUpCost = Math.round(this.oddsUpCost * 1.5);
					get("help").innerHTML=("This upgrade costs: £"+beautify(this.oddsUpCost));
				}
				else noCash();
			}
			else maxOdds(this.nameU);
		};

		//function handling the increase in mineral value
		this.valueUp = function() {
			if (cash >= this.valueUpCost) {
				cash = cash - this.valueUpCost;
				for (let i = 0; i < this.saleVal.length; i++) {
					this.saleVal[i] = Math.ceil(this.saleVal[i] * 1.1 );				
				}
				this.valueUpCost = Math.round(this.valueUpCost * 1.5);
				get("help").innerHTML=("This upgrade costs: £"+beautify(this.valueUpCost));
			}
			else noCash();
		};

		// function handling the increase in mineral tier, adding Rare, Super etc items.
		this.tierUp = function(n) {
			if (this.tier < 4) {
				if (cash >= this.tierUpCost) {
					cash = cash - this.tierUpCost;
					this.tierUpCost = Math.round(this.tierUpCost * 3);
					this.tier++;
					let i = this.tier;
					this.qual[qualities[i]] = 0;
					get(name).insertAdjacentHTML('beforeend', "<span class='resLine'>"+qualities[i]+":</span>");
					get(name).insertAdjacentHTML('beforeend', "<span class='resValue "+qualities[i]+"' id="+name+qualities[i]+">0</span>");
				}
				else noCash();
			}
			else {
				get("help").innerHTML=(this.nameU+" has all the qualities avaliable!");
				noCash();
			}
		};

		//draws the HTML to the page
		get(name).insertAdjacentHTML('beforeend', "<span class='resTitle'><span>"+this.nameU+"<span class='tick' id='"+name+"TickLength'>"+this.tickLength+"</span></span></span>");
		get(name).insertAdjacentHTML('beforeend', "<button class='buttons sellButton' id='"+name+"Sell'>SELL</button>");
		get(name).insertAdjacentHTML('beforeend', "<span class='totValue'>£<span id="+name+"Value>0</span></span>");
		
		//draws the tooltip/stats screen for the mineral.
		get(name).insertAdjacentHTML('beforeend', "<div class='minHelp' id='ttToggle"+this.nameU+"'><span class='questionMark'>?</span><table class='tooltip' id='tt"+this.nameU+"'></table></div>");
		
		//adds the qualities to the just created object based on the tier of the resource, and also adds this to the stats page.
		for (let i = 0; i < tier + 1; i++) {
			this.qual[qualities[i]] = 0;
			get(name).insertAdjacentHTML('beforeend', "<span class='resLine'>"+qualities[i]+":</span>");
			get(name).insertAdjacentHTML('beforeend', "<span class='resValue "+qualities[i]+"' id="+name+qualities[i]+">0</span>");
		}

		for (let i = 0; i < upgrades.length; i++) {
			let x = name+upper(upgrades[i]);
			get(name).insertAdjacentHTML('beforeend', "<button id='"+x+"'>"+upgradesName[i]+"</button>");
			get(x).className+=("buttons upgrade "+upgrades[i]);
		}

		for (let i = 0; i < upgrades.length; i++) {
			get(name+upper(upgrades[i])).addEventListener("mouseenter", help.bind(this, upgrades[i]+"Cost"));
			get(name+upper(upgrades[i])).addEventListener("mouseleave", helpClear.bind(this, upgrades[i]+"Cost"));
		}

		get(name+"Sell").addEventListener("mouseup", this.sell.bind(this));
		get(name+upper(upgrades[0])).addEventListener("mouseup", this.oddsUp.bind(this));
		get(name+upper(upgrades[1])).addEventListener("mouseup", this.valueUp.bind(this));
		get(name+upper(upgrades[2])).addEventListener("mouseup", this.tickUp.bind(this));
		get(name+upper(upgrades[3])).addEventListener("mouseup", this.tierUp.bind(this));
		get("ttToggle"+this.nameU).addEventListener("mouseup", this.tooltip.bind(this));

		//begins to mine the resource
		let startMining = setInterval(function() {t.mine();}, this.tickLength);
		let startRefreshing = setInterval(function() { t.refreshTooltip();}, 100);
	}

	refreshTooltip() {
		get("tt"+this.nameU).innerHTML = "";
		for (let i = 0; i < this.tier + 1; i++) {
			if (i == 0) {
				get("tt" + this.nameU).insertAdjacentHTML('beforeend', "<thead><tr><th>Quality</th><th>Odds</th><th>Value</th></tr></thead>");
				get("tt" + this.nameU).insertAdjacentHTML('beforeend', "<tbody>");
			}
			get("tt" + this.nameU).insertAdjacentHTML('beforeend', "<tr><td>"+qualities[i]+"</td><td>"+this.odds[i].toFixed(3)+"</td><td>£"+this.saleVal[i]+"</td></tr>");
		}
		get("tt" + this.nameU).insertAdjacentHTML('beforeend', "</tbody");
	}

	mine() {
		if (pause === false) { 
			let x = Math.random(), j = 0, t = this;
			// console.log(this.name+" rolled: "+x.toFixed(3));
			get(this.name+"TickLength").classList.add("feedbackTick");
			setTimeout(function() { get(t.name+"TickLength").classList.remove("feedbackTick"); }, 499);
			for (let i in this.qual) {
				if (x < this.odds[j]) {
					this.qual[i]++;
					get(this.name+i).innerHTML = this.qual[i];
					get(this.name+"Value").innerHTML = this.val();
					get(this.name+i).classList.add("feedback"+i);
					setTimeout(function() { get(t.name+i).classList.remove("feedback"+i); }, 499);
					get("mineHistory").insertAdjacentHTML("afterbegin", "<span id="+x+" class='mineLog'></span>");
					get(x).classList.add(qualities[j]);
					get(x).innerHTML = t.nameShort;
					if (document.getElementsByClassName("mineLog").length > 30) {
						let el = document.getElementsByClassName("mineLog")[30].id;
						removeElement(el);
					}
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
	setTimeout(function() {
		get("cashDisplay").classList.remove("feedbackCash"); 
		get("infoDisplay").classList.remove("feedbackCash");
	}, 1000);
}

function get(el) {
	return document.getElementById(el);
}

function upper(str) {
	return str.replace(/^\w/, c => c.toUpperCase());
	//https://joshtronic.com/2016/02/14/how-to-capitalize-the-first-letter-in-a-string-in-javascript/
}

function pauseGame() {
	if (pause === false) {
		pause = true;
	}
	else {
		pause = false;
		}
	console.log(pause);
}

function gameHelp() {
	if (helpOn == false) {
		get("mainWrapper").style.opacity = "0.1";
		get("helpPopup").style.opacity = "1";
		get("helpPopup").style.zIndex = "1";
		document.body.style.backgroundColor = "#cccccc";
		helpOn = true;
	}
	else {
		get("mainWrapper").style.opacity = "1";
		get("helpPopup").style.opacity = "0";
		get("helpPopup").style.zIndex = "-100";
		document.body.style.backgroundColor = "#c2fcff";
		helpOn = false; 
	}
}

function help(item) {
	get("infoDisplay").style.opacity = "1";
	if (item == "oddsUpCost" && this.odds[4] == 1) {
		get("help").innerHTML = this.nameU +" is already at the maximum odds!";
	}
	else { 
		get("help").innerHTML = "This upgrade costs: £"+beautify(this[item]);
	}
}

function maxOdds(item) {
	get("infoDisplay").style.opacity = "1";
	get("help").innerHTML = item+" is already at the maximum odds!";
}

function helpClear() {
	get("infoDisplay").style.opacity = "0";
	get("help").innerHTML = " ";
}

function beautify(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


// constructor(name, tier, odds, saleVal, oddsUpCost, valueUpCost, tickUpCost, tierUpCost)
let Peridot = new Resource("peridot", 0, [0.2, 0.3, 0.35, 0.37, 0.375], [1, 2, 5, 15, 100], 3, 3, 3, 3);
// let Jasper = new Resource("jasper", 1, [0.2, 0.3, 0.35, 0.37, 0.375], [1, 2, 5, 15, 100], 3, 3, 3, 3);
// let Carnelian = new Resource("carnelian", 2, [0.2, 0.3, 0.35, 0.37, 0.375], [1, 2, 5, 15, 100], 3, 3, 3, 3);

function unlockNext(name, tier) {
	let el = "unlock" + upper(name);
	let upperName = upper(name);
	removeElement(el);
	get("resourceWrapper").insertAdjacentHTML('beforeend', '<div class="resource" id='+name+'></div>');
	get(name).classList.add("tier"+tier);
	upperName = new Resource(name, tier, [0.2, 0.3, 0.35, 0.37, 0.375], [1, 2, 5, 15, 100], 3, 3, 3, 3);
}

function unlockMineLog() {
	x = get("mineHistory").style;
	x.opacity = "1";
	x.visibility = "visible";
	x.height = "auto";
}

function removeElement(elementId) {
    // Removes an element from the document
    let element = document.getElementById(elementId);
    element.parentNode.removeChild(element);
}

window.setInterval(function() {
	get("cash").innerHTML = beautify(cash);
	}, 30);