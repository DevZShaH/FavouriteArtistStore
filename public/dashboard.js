// ===========================================================================================================================
// ========================SCRIPT for DASHBOARD PAGE=============================================================
// ===========================================================================================================================
//DOM ELEMENTS
const time = document.getElementById('time');
const greeting = document.getElementById('greeting');
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

		greeting.textContent = 'Good Morning';
		document.body.style.color = 'rgba(250,250,250,1)';
	} else if (hour < 18) {
		//Afternoon
		document.body.style.backgroundImage = "url('../images/afternoon-landscape.jpg')";
		greeting.textContent = 'Good Afternoon';
	} else if (hour < 21) {
		//Evening
		document.body.style.backgroundImage = "url('../images/evening-landscape.jpg')";
		greeting.textContent = 'Good Evening';
		document.body.style.color = 'rgba(250,250,250,1)';
	} else {
		//Evening
		document.body.style.backgroundImage = "url('../images/midnight-landscape.jpg')";
		greeting.textContent = 'Time To Say Good Night';
		document.body.style.color = 'rgba(250,250,250,1)';
	}
}

//GET focus
function getFocus() {
	if (localStorage.getItem('dashboard-focus') === null || localStorage.getItem('dashboard-focus') === '') {
		focus.textContent = `[Type Your Today's Focus Here]`;
	} else {
		focus.textContent = localStorage.getItem('dashboard-focus');
	}
}

//SET focus
function setFocus(e) {
	if (e.type === 'keypress') {
		//Make sure enter is pressed
		if (e.which == 13 || e.keyCode == 13) {
			localStorage.setItem('dashboard-focus', e.target.innerText);
			focus.blur();
		}
	} else {
		localStorage.setItem('dashboard-focus', e.target.innerText);
	}
}

//ADD EVENT-LISTENERS
focus.addEventListener('keypress', setFocus);
focus.addEventListener('blur', setFocus); //blur means click on any other area except the name field area

//Run functions
showTime();
setBgGreet();
// getName();
getFocus();
