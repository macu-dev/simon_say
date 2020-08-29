const topleft = document.querySelector("#topleft");
const topright = document.querySelector("#topright");
const bottomleft = document.querySelector("#bottomleft");
const bottomright = document.querySelector("#bottomright");
const start = document.querySelector("#start");
const nombreJugador = document.querySelector("#nombreJugador");
const on_simon = document.querySelector("#on");
const turn = document.querySelector("#turn");
const mensajeJugador = document.querySelector("#mensaje-jugador");

var song;
var songProgress=-1;
var userProgress;
var jugador;

topleft.onclick = userinput;
topright.onclick = userinput;
bottomleft.onclick = userinput;
bottomright.onclick = userinput;

start.addEventListener("click", startGame);

class Jugador{
  constructor(nombre, oportunidades){
    this.nombre = nombre;
    this.oportunidades = oportunidades;
  }
}

function startGame(){ 
  jugador = new Jugador(prompt("Ingrese su nombre"), 0);

  if(jugador.nombre == "" || !isNaN(Number(jugador.nombre))){
    nombreJugador.innerHTML = `Por favor ingrese su nombre para jugar`;
  }else{
    start.disabled = true;
    nombreJugador.innerHTML = `Hola! ${jugador.nombre}`;
    turn.innerHTML = `${jugador.oportunidades}`;
    on_simon.checked = true;
    
    desactivarBotones();
    playAnimation([1,2,3,4]);
    setTimeout(playGame, 3000);

  }
}

function playGame(from){
  mensajeJugador.innerHTML = `Vamos a Jugar!! c:`;
  songProgress = from ?? 1;
  userProgress = 0;
  if (!from) song = [ getNextButton() ];
  playAnimation(song.slice(0,songProgress));
}

function getNextButton(){
  let number = 1+ Math.floor(4 * (Math.random()));
  return number > 3 ? 4 : number;
}

function userinput(e){
  if (songProgress==-1) return;
  let datakey = e.target.getAttribute('data-key');
  if(datakey == song[userProgress]){
    activeButton(datakey);
    if (userProgress==songProgress-1) {
      song.push(getNextButton());
      continueGame();
    } else
      userProgress++;
  }else{
    jugador.oportunidades++;
    turn.innerHTML = `${jugador.oportunidades}`;
    userProgress=-1;
    if( jugador.oportunidades > 3 ) {
      jugador.oportunidades=0;
      turn.innerHTML = `${jugador.oportunidades}`;
      alert("Perdiste!");
      songProgress = -1;
      start.disabled = false;
    } else
      playGame(songProgress);
  }
}

function continueGame(){
  songProgress++;

  setTimeout(()=>{
    playGame(songProgress);
  }, 1500);
  
}

function desactivarBotones(){
  topleft.style.opacity=0.5;
  topright.style.opacity=0.5;
  bottomleft.style.opacity=0.5;
  bottomright.style.opacity=0.5;
}

function activeButton(n) {
  const volumen = 0.3;
  document.querySelector(
    `.outer-circle > div[data-key='${n}']`
  ).style.opacity = 1;
  let audio= document.querySelector(
    `audio[data-key='${n}']`
  );
  audio.volume = volumen;
  audio.play();
  setTimeout(() => desactivarBotones(), 450);
}

function playAnimation(animation){
  let counter = 0;
  let timerId;
  activeButton(animation[counter]);
  if (animation.length==1) return; 
  timerId = setInterval(() => {
    ++counter;
    activeButton(animation[counter]);
    if (counter>=animation.length-1) clearInterval(timerId);
  }, 700);

}