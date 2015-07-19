(function(){
"use strict"
window.mtgJSON = function(json){
	mtg.cards = json;
	mtg.forEach(function(){
		var colors = this.data.colors;
		
	});
}

Array.prototype.indexOf||(Array.prototype.indexOf=function(r,t){var n
if(null==this)throw new TypeError('"this" is null or undefined')
var a=Object(this),e=a.length>>>0
if(0===e)return-1
var i=+t||0
if(Math.abs(i)===1/0&&(i=0),i>=e)return-1
for(n=Math.max(i>=0?i:e-Math.abs(i),0);e>n;){if(n in a&&a[n]===r)return n
n++}return-1})

if (!String.prototype.trim) {
    (function() {
        // Make sure we trim BOM and NBSP
        var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
        String.prototype.trim = function() {
            return this.replace(rtrim, '');
        };
    })();
}
function addRequest(o, o2, type){
    if((type == 2 || type == 4) && o.length > 1){
        return [{request:1, sub:o}, o2];
    }
    o.push(o2);
    return o;
}
function getEndParenthese(str, pos){
    if(pos < 0){pos=0};
    var instring = false,
        nb = 0;
    for(var i=pos, l = str.length, char;i<l;i++){
        char = str.charAt(i);
        pos = i;
        if(char == '"'){
            instring = !instring;
        }
        else if(instring){
            continue;
        }
        else if(char == "("){
            nb++;
        }
        else if(char == ")"){
            nb--;
            if(nb < 0){
                pos--;
                break;
            }
        }
    }
    return pos+1;
}
function transformRequest(str){
    var o = [],
        typeOfRequest = 1;
        str = str.trim();
        
    for(var i=0, l = str.length, char;i<l;i++){
        char = str.charAt(i);
        if(char=="!" && i==0){
            return [{request:0, name:str.substring(1)}]
        }
        if(char == " " || char == "\t" || char == "\n"){
            var operator = /^(?:(\s+or\s+not\s+)|(\s+or\s+-)|(\s+and\s+not\s+)|(\s+and\s+-)|(\s+and\s+)|(\s+or\s+)|(\s+not\s+)|(\s+-)|(\s+))/i.exec(str.substring(i));
            if(!operator){continue;}
            operator = (operator[1]||operator[2]||operator[3]||operator[4]||operator[5]||operator[6]||operator[7]||operator[8]||operator[9]).toLowerCase();
            i+=operator.length-1;
            operator = operator.replace(/\s+/," ");
            if(operator == " or not " || operator == " or -"){
                typeOfRequest = 4;
            }
            else if(operator == " or "){
                typeOfRequest = 2;
            }
            else if(operator == " not " || operator == " -" || operator == " and not " || operator == " and -"){
                typeOfRequest = 3;
            }
            else{
                typeOfRequest = 1;
            }
            continue;
        }
        if(char=="("){
           var subText = str.substring(i+1, getEndParenthese(str, i+1)),
               result = transformRequest(subText);
            o = addRequest(o, {request:typeOfRequest, sub:result}, typeOfRequest)
           i+=subText+1;
           continue;
        }
        var bcolon = /^([a-z]+)(\:|\!|>=|<=|\=|<|>)/i.exec(str.substring(i));
        if(bcolon){
            var colon = bcolon[2],
                bcolon = bcolon[1].toLowerCase(),
                arg = /(?:^([^\s\"]+))|(?:^"([^\"]+)")/.exec(str.substring(i+bcolon.length+colon.length));
            if(!arg){continue;}
	    var oldi = i;
            i+=bcolon.length+arg[0].length;
            arg = (arg[1] || arg[2]).trim();

            if(bcolon == "o"){
               o = addRequest(o, {request:typeOfRequest, text:arg}, typeOfRequest);
            }
            else if(bcolon == "t"){
                if(arg.indexOf(" ") > 0){
                    var args = arg.toLowerCase().split(/\s+/g),
                        o2 = [];
                    for(var j=0;j<args.length;j++){
                        o2.push({request:1, type:args[j]});
                    }
                    o = addRequest(o, {request:typeOfRequest, sub:o2}, typeOfRequest);
                }
                else{
                    o = addRequest(o, {request:typeOfRequest, type:arg}, typeOfRequest);
                }
            }
            else if(bcolon == "cmc"){
                o = addRequest(o, {request:typeOfRequest, comp:colon, cmc:arg}, typeOfRequest);
            }
            else if(bcolon == "pow"){
                o = addRequest(o, {request:typeOfRequest, comp:colon, pow:arg}, typeOfRequest);
            }
            else if(bcolon == "tou"){
                o = addRequest(o, {request:typeOfRequest, comp:colon, tou:arg}, typeOfRequest);
            }
            else if(bcolon == "loy"){
                o = addRequest(o, {request:typeOfRequest, comp:colon, loy:arg}, typeOfRequest);
            }
            else if(bcolon == "c"){
		arg = arg.toLowerCase(),
		    oColor = {multi:arg.indexOf("m") > -1,
			      w: arg.indexOf("w") > -1,
			      b: arg.indexOf("b") > -1,
			      u: arg.indexOf("w") > -1,
			      r: arg.indexOf("r") > -1,
			      g: arg.indexOf("g") > -1,
			      c: arg.indexOf("c") > -1,
			      land: arg.indexOf("l") > -1
			};
		    oColor.str = (oColor.w ? "w" : "") + (oColor.r ? "r" : "") + (oColor.b ? "b" : "") + (oColor.u ? "u" : "") + (oColor.g ? "g" : "")
                o = addRequest(o, {request:typeOfRequest, comp:colon, color:oColor}, typeOfRequest);
            }
            else if(bcolon == "is"){
                o = addRequest(o, {request:typeOfRequest, is:arg}, typeOfRequest);
            }
	    else if(bcolon == "reg"){
		if(arg.charAt(0) == "/"){
			var corr = str.substring(oldi+5).replace(/\\./g, "##"),
			body = str.substring(oldi+5, oldi+5+corr.substring(0, corr.indexOf("/")).length),
			flags = (/\/([a-z]*)/i.exec(corr) || [])[1] || "";
			o = addRequest(o, {request:typeOfRequest, reg:new RegExp(body, flags)}, typeOfRequest);
		}
		else{
			o = addRequest(o, {request:typeOfRequest, reg:new RegExp(arg, "i")}, typeOfRequest);
		}
	    }
	    else if(bcolon == "ab"){
		o = addRequest(o, {request:typeOfRequest, reg:new RegExp("((^|\n) *"+arg+"\b)|(, *"+arg+" *(\n|$))|(, *"+arg+",[^\n]*)", "i")}, typeOfRequest);
	    }
	    else if(bcolon == "a"){
		o = addRequest(o, {request:typeOfRequest, artist:arg}, typeOfRequest);
	    }
	    else if(bcolon == "f"){
		o = addRequest(o, {request:typeOfRequest, format:arg.toLowerCase()}, typeOfRequest);
	    }
	    else if(bcolon == "r"){
		o = addRequest(o, {request:typeOfRequest, rarity:arg.toLowerCase()}, typeOfRequest);
	    }
        }
	else if(char == '"'){
		var exec = /^"([^"]*)"?/.exec(str.substring(i));
		i += exec[0].length;
		o = addRequest(o, {request:typeOfRequest, name:exec[1]}, typeOfRequest);				
	}
	else{
		var name = /^\S+/.exec(str.substring(i))[0];
		i+=name.length-1;
		o = addRequest(o, {request:typeOfRequest, name:name}, typeOfRequest);
	}
    }
    return o;
}
var onceCache = {};
var mtg = new function(){
	this.cards = {};
	this._TESTSYMBOLS = "{t}{q}|{w}{u}{b}{r}{g}{s}|{16}|{w/u}{w/b}{u/b}{u/r}{b/r}{b/g}{r/g}{r/w}{g/w}{g/u}|{2/w}{2/u}{2/b}{2/r}{2/g}|{p}{wp}{up}{bp}{rp}{gp}|{x}{y}|{c}{pw}";
	this.getCardByName = function(name){
		name = name.trim().toLowerCase();
		if(this.cards[name]){
			return card(name, true);
		}
	}
	this.version = "0.4";
	this.once = function(fn, fnElse){
		var txt = fn.toString();
		if(onceCache[txt]){
			if(fnElse){
				return fnElse.call();
			}
		}
		else{
			onceCache[txt] = true;
			return fn.call();
		}
	}
	this.createElement = function(tag, callback){
		var element = document.createElement(tag);
		if(callback){
			callback.call(element);
		}
		document.getElementById('header').appendChild(element);
		return element;
	}
	this.forEach = function(fn){
		for(var i in this.cards){
			if(this.cards.hasOwnProperty(i)){
				var value = fn.call(card(i), this.cards[i].name);
				if(value === false){
					return false;
				}
			}
		}
		return true;
	}
	this.print = function(arr, options){
		options = options || {};
		var ul = document.createElement("ul");
		arr.forEach(function(el){
			var data;
			if(typeof el != "string" && el.data.name){
				data = el.data;
				el = data.name;
			}
			else {
				data = mtg.cards[el.toLowerCase()];
				el = data.name;
			}
			var v = document.createElement("li"),
			link;
			if(options.url === "1"){
				link = "<a href='http://gatherer.wizards.com/Pages/Card/Details.aspx?name="+encodeURIComponent(el).replace("'","%27")+"'>"+el+"</a>";
			}
			else{
				link = "<a href='http://magiccards.info/query?q=%21"+encodeURIComponent(el).replace("'","%27")+"&v=card&s=cname'>"+el+"</a>";
			}
			if(options.full === false || options.full === 0 || ((!options.full || options.full == "auto") && arr.length>100)){
				v.innerHTML = link;
			}
			else{
				var txt;
				txt = link+"<span class='manaCost'>"+mtg.symbolize(data.manaCost || "")+"</span><div class='types'>"+(data.type||"")+"</div>";
				txt += "<div class='oracle'>"+mtg.symbolize(data.text || "")+"</div>"
				if(data.toughness){
					txt+="<div class='powtou'><span class='pow'>"+data.power+"</span>/<span class='tou'>"+data.toughness+"</span></div>"
				}
				if(data.loyalty){
					txt += "<div class='loyalty'>(Loyalty: <span class='loy'>"+data.loyalty+"</span>)</div>"
				}
				v.innerHTML = txt;
			}
			ul.appendChild(v);
		});
		var li = document.createElement("li");
		li.innerHTML = ul.childNodes.length +" result(s)";
		ul.insertBefore(li,ul.firstChild);
		var element = document.getElementById('results');
		element.innerHTML = "";
		element.appendChild(ul);
	}
	this.symbolize = function(str){
		return str.replace(/\{([0-9]+|[sgwrbuqtxpcy]|[wrbug]p|[wrbug]\/[wrbug]|2\/[wrbug]|pw)}/gi, function(b,a){
			a = a.toLowerCase();
			var r = false;
			if(a=="t"){r="tap.gif"}
			else if(a=="q"){r="untap.gif"}
			else if(/^[rwgubxys]$/.test(a)){
				r= "m"+a+".gif";
			}
			else if(/^[0-9]+$/.test(a) && parseInt(a) <=16){
				r = "m"+a+".gif";
			}
			else if(a == "p"){
				r = "p.png"
			}
			else if(a == "pw"){
				r = "planeswalk.png"
			}
			else if(a == "c"){
				r = "c.png"
			}
			else if(/^2\/[rwgub]$/.test(a)){
				r=a.charAt(2)+"2.png";
			}
			else if(/^[rwgub]p$/.test(a)){
				r = "p"+a.charAt(0)+".png";
			}
			else if(manaChart[a]){
				r = manaChart[a]
			}
			if(r){
				return '<img src="icons/'+r+'" title="'+b.toUpperCase()+'">'
			}
			return b;
		}).replace(/\n/g,"<br>");
	}
	this.query = function(str, fn){
		var request = transformRequest(str),
		    results = [];
		this.forEach(function(name){
			if(match(this, request)){
				results.push(this)
				return fn.call(this, name);
			}
		})
		return results;
	}
},
manaChart = {
"w/u" : "wu.gif",
"w/b" : "wb.gif",
"u/b" : "ub.gif",
"u/r" : "ur.gif",
"b/r" : "br.gif",
"b/g" : "bg.gif",
"r/g" : "rg.gif",
"r/w" : "rw.gif",
"g/w" : "gw.gif",
"g/u" : "gu.gif"
},
formatChart = {
"commander" : "Commander",
"freeform" : "Freeform",
"legacy" : "Legacy",
"modern" : "Modern",
"prismatic" : "Prismatic",
"singleton 100" : "Singleton 100",
"standard" : "Standard",
"tribal wars legacy" : "Tribal Wars Legacy",
"tribal wars standard" : "Tribal Wars Standard",
"vintage" : "Vintage",
"c" : "Commander",
"l" : "Legacy",
"m" : "Modern",
"s" : "Standard"
},
rarityChart = {
"r" : "rare",
"u" : "uncommon",
"c" : "common",
"m" : "mythic rare",
"mythic" : "mythic rare"
},
match = function(item, request){
	var data = item.data,
	    colorChart = {w:"White", r:"Red", b:"Black", u:"Blue", g:"Green"},
	    lastOne = null;
	for(var i=0, subr, good, l=request.length;i<l;i++){
		subr = request[i];
		good = false;
		if(lastOne && (subr.request == 2 || subr.request == 4)){
			continue;
		}
		else if(subr.sub){
			good = match(item, subr.sub);
		}
		else if(subr.text){
			good = (data.text || "").toLowerCase().indexOf(subr.text.replace(/~/g, data.name || "").toLowerCase()) > -1;
		}
		else if(subr.type && data.type){
			good = (" "+data.type.toLowerCase()+" ").indexOf(" "+subr.type.toLowerCase()+" ") != -1;
		}
		else if(subr.is){
			if(subr.is == "timeshifted"){
				good = data.timeshifted
			}
			else if(subr.is == "hybrid"){
				good = /[^2]\//.test(data.manaCost)
			}
			else if(subr.is == "monohybrid"){
				good = /2\//.test(data.manaCost)
			}
		}
		else if(subr.cmc){
			var cmc = subr.cmc;
			if(!data.cmc){data.cmc=0;}
			if(cmc=="*" && subr.comp == ">="){
				// TODO
			}
			else{
				// TODO : Fix "|| 0" for spells
				cmc = parseInt(cmc.toString().replace(/pow/i, data.power || 0).replace(/tou/i, data.toughness || 0));
				if(isNaN(cmc)){
					good = false;
				}
				else if(subr.comp == "="){
					good = cmc === data.cmc;
				}
				else if(subr.comp == "<"){
					good = data.cmc < cmc;
				}
				else if(subr.comp == ">"){
					good = data.cmc > cmc;
				}
				else if(subr.comp == "<="){
					good = cmc >= data.cmc;
				}
				else if(subr.comp == ">="){
					good = cmc <= data.cmc;
				}
			}
		}
		else if(subr.pow && data.pow){
			// TODO : Fix "|| 0" for spells
			var pow = parseInt(subr.pow.toString().replace(/cmc/i, data.cmc || 0).replace(/tou/i, data.toughness || 0));
				if(isNaN(pow)){
					good = false;
				}
				else if(subr.comp == "="){
					good = pow === data.pow;
				}
				else if(subr.comp == "<"){
					good = data.pow < pow;
				}
				else if(subr.comp == ">"){
					good = data.pow > pow;
				}
				else if(subr.comp == "<="){
					good = pow >= data.pow;
				}
				else if(subr.comp == ">="){
					good = pow <= data.pow;
				}
		}
		else if(subr.tou && data.toughness){
			// TODO : Fix "|| 0" for spells
			var tou = parseInt(subr.tou.toString().replace(/cmc/i, data.cmc || 0).replace(/pow/i, data.power || 0)),
			    tou2 = data.toughness;
				if(isNaN(tou)){
					good = false;
				}
				else if(subr.comp == "="){
					good = tou === tou2;
				}
				else if(subr.comp == "<"){
					good = tou2 < tou;
				}
				else if(subr.comp == ">"){
					good = tou2 > tou;
				}
				else if(subr.comp == "<="){
					good = tou >= tou2;
				}
				else if(subr.comp == ">="){
					good = tou <= tou2;
				}
		}
		else if(subr.loy && data.loyalty){
			// TODO : Fix "|| 0" for spells
			var loy = parseInt(subr.loy.toString().replace(/cmc/i, data.cmc || 0)),
			    loy2 = data.loyalty;
				if(isNaN(loy)){
					good = false;
				}
				else if(subr.comp == "="){
					good = loy === loy2;
				}
				else if(subr.comp == "<"){
					good = loy2 < loy;
				}
				else if(subr.comp == ">"){
					good = loy2 > loy;
				}
				else if(subr.comp == "<="){
					good = loy >= loy2;
				}
				else if(subr.comp == ">="){
					good = loy <= loy2;
				}
		}
		else if(subr.color){

			var color = subr.color,
			cardColors = data.colors;
				if(color.land && (!cardColors || cardColors.length == 0) && !data.manaCost){
					good = true;
				}
				else if(color.c && (!cardColors || cardColors.length == 0) && data.manaCost){
					good = true;
				}
				else if(!cardColors){
					// good = false;
				}
				else if(color.c && subr.comp == "!"){
					// good = false

					/*
					/* Comment #24 : This behavior is very strange. However, it was programmed this way to reproduce magiccards.info behavior.
					/*/
				}
				else if(subr.comp == "!"){
					var nb = 0;
					for(var k=0, col;k<color.str.length;k++){
						col = colorChart[color.str.charAt(k)];
						if(cardColors.indexOf(col) > -1){
							nb++;
						}
					}
					if(color.multi){
						good = (nb === color.str.length && nb === cardColors.length);
					}
					else{
						good = cardColors.length === nb;
					}
				}
				else{
					for(var k=0, col;k<color.str.length;k++){
						if(cardColors.indexOf(colorChart[color.str.charAt(k)]) > -1){
							if(!color.multi || cardColors.length>1){
								good = true;
							}
							break;
						}
					}
				}
			
		}
		else if(subr.name){
			if(subr.request === 0){
				if(data.name.toLowerCase() == subr.name.toLowerCase()){
					good = true;
				}
			}
			else{
				good = data.name.toLowerCase().indexOf(subr.name.toLowerCase()) > -1;
			}
		}
		else if(subr.reg){
			good = subr.reg.test(data.text || "");
		}
		else if(subr.legality){
			good = (new RegExp(subr.reg, "i")).test(data.text || "");
		}
		else if(subr.rarity && data.rarity){
			var rarity = subr.rarity.toLowerCase();
			rarity = rarityChart[rarity] ? rarityChart[rarity] : rarity;
			return !!data.rarity[rarity];
		}
		else if(subr.format && data.legalities){
			var format = formatChart[subr.format];
			good = data.legalities[format] && data.legalities[format] != "Banned";
		}
		else if(subr.artist && data.artistsAvailable){
			good = !!data.artistsAvailable[subr.artist.toLowerCase()]
		}
		if(subr.request == 3 || subr.request == 4){
			good = !good;
		}
		if(!good){
			if(request[i+1] && (request[i+1].request == 2 || request[i+1].request == 4)){
				lastOne = false;
			}
			else{
				return false;
			}
		}
		lastOne = good;
	}
	return true;
},
card = function(name){
	var item = mtg.cards[name.toLowerCase()];
	return new function(){
		this.match = function(query){
			var request = transformRequest(query);
			return match(this, request)
		}
		this.data = item;
	}
}
window.run = function(code){
	try{
		var fn = new Function("mtg", code);
	}
	catch(e){
		throw e;
		alert('Errors on compilation. Check your code and the console.');
		return;
	}
	fn(mtg);
	
}
})();