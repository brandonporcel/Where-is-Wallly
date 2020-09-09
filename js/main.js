const zoom = () => {
	$(document).ready(function () {
		$('#img-game').blowup({
			background: 'BLUE',
			width: 205,
			height: 205,
			cursor: true,
			round: true,
			shadow: '0 10px 15px 0 rgba(0,0,0,0.2)',
		});
	});
};

const $countdownEl = document.getElementById('countdown');
const tiempo = 2;
let tiempoLimite = tiempo * 60;
let state = false;
let minutes;
let seconds;
let cronometrooo;
// header del game
const $startButton = document.getElementById('startGame');
const $remainingTime = document.getElementById('remaining-time');
const $countdownBox = document.getElementById('countdown-box');
const $pauseButton = document.getElementById('pauseGame');
const $backGame = document.getElementById('back-game');
const $pauseText = document.getElementById('pause-text');
const $giveUpOption = document.getElementById('give-up');
const $playAgainButton = document.getElementById('playAgain');
// mostrar el overlay y para ocoultar todo el contenido
const $overlay = document.getElementById('overlay');
const $overlayContent = document.getElementById('overlay-content');
// para la funcion que te dice que tan cerca estas
const $mapa = document.getElementById('img-game');
const $resultado = document.getElementById('resultado');
let clicks = 0;
const addSolutionImg = () => {
	const imagen = document.createElement('img');
	imagen.src = '../img/solutions/beachGameSolution.jpg';
	imagen.classList.add('game__img-solution');
	const $contendorImg = document.getElementById('game-img-container');
	const $box = document.getElementById('box');
	$contendorImg.appendChild(imagen);
	$contendorImg.classList.add('big-solution');
	$box.classList.add('big-solution');
};
// finish algorithm and put him 00m:00s
const endCountdown = () => {
	clearInterval(cronometrooo);
	$mapa.classList.add('disabled');
	addSolutionImg();
	$pauseButton.classList.remove('enabled');
	$giveUpOption.classList.remove('enabled');
	$playAgainButton.classList.add('enabled');
};
// countdown algorithm(logic)
const countdownAlgorithm = () => {
	minutes = `${Math.floor(tiempoLimite / 60)}`;
	minutes.slice(-2);
	seconds = `${Math.floor(tiempoLimite % 60)}`;
	if (seconds < 10) {
		seconds = `0${seconds}`;
	}
	if (minutes < 10) {
		minutes = `0${minutes}`;
	}
	$countdownEl.innerHTML = `${minutes}m:${seconds}s`;
	if (tiempoLimite === 0) {
		endCountdown();
	} else {
		tiempoLimite -= 1;
	}
};
// start countdown with the start button
const startCountdown = () => {
	if (state === false) {
		cronometrooo = setInterval(countdownAlgorithm, 1000);
		state = true;
	}
};
// start countdown with the pause button
const pauseCountdown = () => {
	if (state === true) {
		$overlay.classList.add('enabled');
		$overlayContent.classList.add('enabled');
		$remainingTime.innerHTML = `${minutes}m:${seconds}s`;
		clearInterval(cronometrooo);
		state = false;
	} else {
		$pauseText.innerHTML = '⏸';
		cronometrooo = setInterval(countdownAlgorithm, 1000);
		state = true;
	}
};
// click in the option giveUp
const giveUp = () => {
	$countdownEl.innerHTML = '00m:00s';
	$pauseButton.classList.remove('enabled');
	$giveUpOption.classList.remove('enabled');
	$playAgainButton.classList.add('enabled');
	$countdownBox.classList.remove('disabled');
	clearInterval(cronometrooo);
};
let stateStart = false;
// digo donde esta el objetgivo
const goalToLookFoor = {
	x: 624,
	y: 235,
};
// calcula la distancia entre el click y el objetivo
const distancia = (e, tesoroo) => {
	const difX = e.offsetX - tesoroo.x;
	const difY = e.offsetY - tesoroo.y;
	return Math.ceil(Math.sqrt(difX * difX + difY * difY));
};

const closerTextObject = {
	100: 'Really Hot',
	200: 'Hot',
	300: 'Warm',
	360: 'Cold',
	500: 'Really Cold',
};

const pickerCloserText = (distance) => {
	// en lvl se va a crear un array de los items que en el objeto(e)
	// find retorna el primer elemento que cumpla la conficion.else->return undf
	const lvl = Object.keys(closerTextObject).find((e) => distance < e);
	// pero parfa que no retorne undefined hago esto
	if (!lvl) return 'Freezing!!';
	/* retorna el valor del item(elememrto) */
	return `${closerTextObject[lvl]}`;
};
// estart countdown and show button pause, give up option,enabled zoom
$startButton.addEventListener('click', () => {
	if (stateStart === false) {
		zoom();
		countdownAlgorithm();
		startCountdown();
		$startButton.classList.add('disabled');
		$pauseButton.classList.add('enabled');
		$giveUpOption.classList.add('enabled');
		stateStart = true;
		console.log(stateStart);
	}
});

// pause to the game and enabled the overlay for dont see the game map
$pauseButton.addEventListener('click', () => {
	pauseCountdown();
});
// back game with countdown
$backGame.addEventListener('click', () => {
	$overlay.classList.remove('enabled');
	$overlayContent.classList.remove('enabled');
	startCountdown();
});

$giveUpOption.addEventListener('click', () => {
	endCountdown();
	giveUp();
});
$playAgainButton.addEventListener('click', () => {
	window.location.reload();
});

$mapa.addEventListener('click', (e) => {
	if (stateStart === true) {
		clicks += 1;
		const distanciaa = distancia(e, goalToLookFoor);
		$resultado.innerHTML = pickerCloserText(distanciaa);
		if (distanciaa < 10) {
			alert(`encontraste en ${clicks} clicks`);
			window.location.reload();
		}
	}
});
