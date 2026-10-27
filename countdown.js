document.addEventListener("DOMContentLoaded", function() {
  // Fecha límite en formato ISO estándar (Año-Mes-Día Hora:Minuto:Segundo)
  const countdownDate = new Date("2026-10-31T23:59:59").getTime();

  const actualizarContador = setInterval(function() {
    const ahora = new Date().getTime();
    const distancia = countdownDate - ahora;

    if (distancia < 0) {
      clearInterval(actualizarContador);
      document.getElementById("days").innerText = "00";
      document.getElementById("hours").innerText = "00";
      document.getElementById("minutes").innerText = "00";
      return;
    }

    // Cálculos de tiempo
    const dias = Math.floor(distancia / (1000 * 60 * 60 * 24));
    const horas = Math.floor((distancia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutos = Math.floor((distancia % (1000 * 60 * 60)) / (1000 * 60));

    // Seleccionamos los elementos y actualizamos el texto de manera segura
    const daysElement = document.getElementById("days");
    const hoursElement = document.getElementById("hours");
    const minutesElement = document.getElementById("minutes");

    if (daysElement && hoursElement && minutesElement) {
      daysElement.innerText = dias < 10 ? "0" + dias : dias;
      hoursElement.innerText = horas < 10 ? "0" + horas : horas;
      minutesElement.innerText = minutos < 10 ? "0" + minutos : minutos;
    }

  }, 1000);
});