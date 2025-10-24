const btn = document.getElementById("mensajeBtn");
const mensaje = document.getElementById("mensaje");
const corazones = document.getElementById("corazones");

btn.addEventListener("click", () => {
  mensaje.classList.toggle("oculto");
  crearCorazones(15);
});

function crearCorazones(num) {
  for (let i = 0; i < num; i++) {
    const corazon = document.createElement("div");
    corazon.classList.add("corazon");
    corazon.textContent = "💖";
    corazon.style.left = Math.random() * 100 + "vw";
    corazon.style.fontSize = Math.random() * 20 + 10 + "px";
    corazon.style.animationDuration = Math.random() * 3 + 2 + "s";
    corazones.appendChild(corazon);

    setTimeout(() => {
      corazon.remove();
    }, 4000);
  }
}
