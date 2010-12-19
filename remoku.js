//rokuAddress can't be automatically detected because ssdp uses multicast packets and javascript can't work with these kinds of packets
var rokuAddress = "192.168.1.10";
var rokupostframe;

//lastBtn stores the button the was pressed onMousedown, for release in btnUp()
var lastBtn;


function createCookie(name,value,days) {
  if (days) {
    var date = new Date();
    date.setTime(date.getTime()+(days*24*60*60*1000));
    var expires = "; expires="+date.toGMTString();
  }
  else var expires = "";
  alert(name+"="+value+expires+"; path=/");
  document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for(var i=0;i < ca.length;i++) {
    var c = ca[i];
    while (c.charAt(0)==' ') c = c.substring(1,c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
  }
  return null;
}

function rokupost(action, param){
	if(!rokupostframe){
	rokupostframe = document.createElement("iframe");
	rokupostframe.name="rokuresponse"
	rokupostframe.id="rokuresponse";
	rokupostframe.style.visibility="hidden";
	rokupostframe.style.display="none";
	rokupostframe = document.body.appendChild(rokupostframe);
	}
	var rokupost = document.getElementById('rokupost');
	rokupost.setAttribute("action", "http://" + rokuAddress + ":8060/" + action + "/" + param);
	rokupost.submit();
	//rokupost.focus();
	return false;
}

function btnDown(){
	lastBtn = this.id;
	rokupost("keydown",this.id);
}
function btnUp(){
	rokupost("keyup",lastBtn);
}

function showConfig(){

	var configScreen = document.getElementById("configscreen");
	var remoteScreen = document.getElementById("remote");
	var searchScreen = document.getElementById("searchdiv");
	
	if (configScreen.style.visibility != "visible"){
	configScreen.style.visibility = "visible";
	configScreen.style.display = "block";
	remoteScreen.style.visibility = "hidden";
	searchScreen.style.visibility = "hidden";
	remoteScreen.style.display = "none";
	searchScreen.style.display = "none";
	} else{
	rokuAddress = document.getElementById("octet1").value + "." + document.getElementById("octet2").value + "." + document.getElementById("octet3").value + "." + document.getElementById("octet4").value;
	//alert(rokuAddress);
	createCookie("rokuAddress", rokuAddress, 365);
	configScreen.style.visibility = "hidden";
	configScreen.style.display = "none";
	remoteScreen.style.visibility = "visible";
	searchScreen.style.visibility = "visible";	
	remoteScreen.style.display = "block";
	searchScreen.style.display = "block";
	}
}

function doSend(){
	rokupost("keypress","Enter");
	return false;
}

function doSearch(){
	//rokupost("keypress","Search");
	rokupost("keydown","Search");
	rokupost("keyup","Search");
	return false;
}

function keyWasPressed(evt){ 
	var backspace;
	if (evt.keyCode==8){
		backspace="Backspace";
		rokupost("keypress",backspace);
	}
	document.getElementById('searchtext').focus();
}

function keyWasReleased(evt){ 
	var searchChar;
	if (evt.keyCode!="8"){
		searchChar=String.fromCharCode(evt.keyCode);
		rokupost("keypress","LIT_" + Url.encode(searchChar));
	}
	document.getElementById('searchtext').focus();
}

function updateCache(){
appCache.swapCache();
console.log("Cache Refreshed");
}

var appCache;
window.onload = function(){
	var buttons = document.getElementById('remote').getElementsByTagName('button');
	for (var i=0;i<buttons.length;i++) {
		buttons[i].onmousedown = btnDown;
		buttons[i].ontouchstart = btnDown;
		buttons[i].onmouseup = btnUp;
		buttons[i].ontouchend = btnUp;
	}
	document.getElementById('Enter').onmousedown = btnDown;
	document.getElementById('Enter').ontouchstart = btnDown;
	document.getElementById('Enter').onmouseup = btnUp;
	document.getElementById('Enter').ontouchend = btnUp;
	document.getElementById('searchtext').onkeyup = keyWasPressed;
	document.getElementById('searchtext').onkeypress = keyWasReleased;
	//document.getElementById('searchtext').onblur = doSend;
	document.getElementById('Config').onclick = showConfig;
	if(window.applicationCache){
		appCache = window.applicationCache;
		appCache.addEventListener("updateready", updateCache, false);
	}
	rokuAddress = readCookie("rokuAddress");
	if (rokuAddress==null) {
		//alert("No Cookie");
		showConfig();
	} else{
		alert(rokuAddress);
	}
}