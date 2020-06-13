// ===========================================================================================================================
// ========================SCRIPT for WELCOME PAGE=============================================================
// ===========================================================================================================================
//DOM ELEMENTS
const time = document.getElementById('time');
const greeting = document.getElementById('greeting');
const name = document.getElementById('name');
const focus = document.getElementById('focus');

//Options
const showAmPm = true;

//SHOW TIME
function showTime() {
	// let today = new Date(2020, 28, 05, 22, 30, 30);
	let today = new Date();
	hour = today.getHours();
	min = today.getMinutes();
	sec = today.getSeconds();

	//SET AM OR PM
	const amPm = hour >= 12 ? 'PM' : 'AM';

	//12hr FORMAT
	hour = hour % 12 || 12;

	//Output Time
	time.innerHTML = `${hour}<span>:</span>${addZero(min)}<span>:</span>${addZero(sec)} ${showAmPm ? amPm : ''}`;

	//ADD ZERO function to make double digit place for n < 10 else display n
	function addZero(n) {
		return (parseInt(n, 10) < 10 ? '0' : '') + n;
	}

	setTimeout(showTime, 1000);
}

//SET BACKGROUND AND GREETING
function setBgGreet() {
	// let today = new Date(2020, 28, 05, 22, 30, 30);
	let today = new Date();

	hour = today.getHours();

	if (hour < 12) {
		//Morning
		document.body.style.backgroundImage = "url('../images/morning-landscape.jpg')";
		// $('body').css('background-color', 'rgba(192,192,192,0.1)');
		// document.body.style.background = 'rgba(192,192,192,0.1)';
		// shimmer.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
		// $('body').css('opacity', '0.9');
		greeting.textContent = 'Good Morning';
	} else if (hour < 18) {
		//Afternoon
		document.body.style.backgroundImage = "url('../images/afternoon-landscape.jpg')";
		greeting.textContent = 'Good Afternoon';
	} else if (hour < 21) {
		//Evening
		document.body.style.backgroundImage = "url('../images/evening-landscape.jpg')";
		greeting.textContent = 'Good Evening';
		// $('body').css('color', 'rgba(0,0,0,1)');
		document.body.style.color = 'rgba(250,250,250,1)';
	} else {
		//Evening
		document.body.style.backgroundImage = "url('../images/night-landscape.jpg')";
		greeting.textContent = 'Time To Say Good Night';
		document.body.style.color = 'rgba(250,250,250,1)';
	}
}

//GET NAME
function getName() {
	if (localStorage.getItem('name') === null || localStorage.getItem('name') === '') {
		name.textContent = '[Type Your Name Here]';
	} else {
		name.textContent = localStorage.getItem('name');
	}
}

//SET NAME
function setName(e) {
	if (e.type === 'keypress') {
		//Make sure enter is pressed
		if (e.which == 13 || e.keyCode == 13) {
			localStorage.setItem('name', e.target.innerText);
			name.blur();
		}
	} else {
		localStorage.setItem('name', e.target.innerText);
	}
}

//GET focus
function getFocus() {
	if (localStorage.getItem('focus') === null || localStorage.getItem('focus') === '') {
		focus.textContent = `[Type Your Today's Focus Here]`;
	} else {
		focus.textContent = localStorage.getItem('focus');
	}
}

//SET focus

function setFocus(e) {
	if (e.type === 'keypress') {
		//Make sure enter is pressed
		if (e.which == 13 || e.keyCode == 13) {
			localStorage.setItem('focus', e.target.innerText);
			focus.blur();
		}
	} else {
		localStorage.setItem('focus', e.target.innerText);
	}
}

//ADD EVENT-LISTENERS
name.addEventListener('keypress', setName);
name.addEventListener('blur', setName); //blur means click on any other area except the name field area

focus.addEventListener('keypress', setFocus);
focus.addEventListener('blur', setFocus); //blur means click on any other area except the name field area

//Run functions
showTime();
setBgGreet();
getName();
getFocus();
