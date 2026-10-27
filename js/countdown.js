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
document.addEventListener("DOMContentLoaded", function () {
  let ticketPrice = 25000;
  let ticketName = "Early Bird";
  let quantity = 1;

  const ticketCards = document.querySelectorAll(".ticket-card");
  const qtyInput = document.getElementById("ticket-qty");
  const increaseBtn = document.getElementById("increase-btn");
  const decreaseBtn = document.getElementById("decrease-btn");

  // Elementos de texto del resumen
  const summaryQty = document.getElementById("summary-qty");
  const summaryTicketName = document.getElementById("summary-ticket-name");
  const summarySubtotal = document.getElementById("summary-subtotal");
  const summaryFee = document.getElementById("summary-fee");
  const summaryTotal = document.getElementById("summary-total");
  const btnTotal = document.getElementById("btn-total");

  // Elementos de texto del modal
  const modalSummaryTicket = document.getElementById("modal-summary-ticket");
  const modalSummarySubtotal = document.getElementById("modal-summary-subtotal");
  const modalSummaryFee = document.getElementById("modal-summary-fee");
  const modalSummaryTotal = document.getElementById("modal-summary-total");

  // Inputs para aplicar restricciones
  const fullNameInput = document.getElementById("full-name");
  const phoneInput = document.getElementById("phone");
  const cardNumberInput = document.getElementById("card-number");
  const cardHolderInput = document.getElementById("card-holder");
  const cardExpiryInput = document.getElementById("card-expiry");
  const cardCvvInput = document.getElementById("card-cvv");

  // --- RESTRICCIONES DE ENTRADA EN TIEMPO REAL ---

  // Solo letras (con acentos y espacios)
  function enforceLettersOnly(input) {
    input.addEventListener("input", function () {
      this.value = this.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");
    });
  }

  // Solo números
  function enforceNumbersOnly(input) {
    input.addEventListener("input", function () {
      this.value = this.value.replace(/[^0-9]/g, "");
    });
  }

  if (fullNameInput) enforceLettersOnly(fullNameInput);
  if (cardHolderInput) enforceLettersOnly(cardHolderInput);
  if (phoneInput) enforceNumbersOnly(phoneInput);
  if (cardCvvInput) enforceNumbersOnly(cardCvvInput);

  // Formato número de tarjeta (Solo números, máx 19 con espacios)
  if (cardNumberInput) {
    cardNumberInput.addEventListener("input", function () {
      let raw = this.value.replace(/[^0-9]/g, "");
      if (raw.length > 16) raw = raw.substring(0, 16);
      // Agrupa de a 4 dígitos
      this.value = raw.match(/.{1,4}/g)?.join(" ") || "";
    });
  }

  // Formato vencimiento MM/AA (Solo números y autocompleta /)
  if (cardExpiryInput) {
    cardExpiryInput.addEventListener("input", function () {
      let raw = this.value.replace(/[^0-9]/g, "");
      if (raw.length > 4) raw = raw.substring(0, 4);
      if (raw.length >= 3) {
        this.value = raw.substring(0, 2) + "/" + raw.substring(2);
      } else {
        this.value = raw;
      }
    });
  }

  // --- LÓGICA DEL CHECKOUT ---

  ticketCards.forEach(card => {
    card.addEventListener("click", function () {
      ticketCards.forEach(c => c.classList.remove("selected"));
      this.classList.add("selected");
      ticketPrice = parseInt(this.getAttribute("data-price"));
      ticketName = this.getAttribute("data-name");
      updateTotals();
    });
  });

  // Límite máximo de 100 entradas
  if (increaseBtn && decreaseBtn) {
    increaseBtn.addEventListener("click", () => {
      if (quantity < 100) {
        quantity++;
        qtyInput.value = quantity;
        updateTotals();
      }
    });

    decreaseBtn.addEventListener("click", () => {
      if (quantity > 1) {
        quantity--;
        qtyInput.value = quantity;
        updateTotals();
      }
    });
  }

  function updateTotals() {
    let subtotal = ticketPrice * quantity;
    let fee = subtotal * 0.05;
    let total = subtotal + fee;

    let formattedSubtotal = "$" + subtotal.toLocaleString("es-AR");
    let formattedFee = "$" + fee.toLocaleString("es-AR");
    let formattedTotal = "$" + total.toLocaleString("es-AR");

    if (summaryQty) summaryQty.textContent = quantity;
    if (summaryTicketName) summaryTicketName.textContent = `Entrada ${ticketName} x ${quantity}`;
    if (summarySubtotal) summarySubtotal.textContent = formattedSubtotal;
    if (summaryFee) summaryFee.textContent = formattedFee;
    if (summaryTotal) summaryTotal.textContent = formattedTotal;
    if (btnTotal) btnTotal.textContent = total.toLocaleString("es-AR");

    if (modalSummaryTicket) modalSummaryTicket.textContent = `Entrada ${ticketName} x ${quantity}`;
    if (modalSummarySubtotal) modalSummarySubtotal.textContent = formattedSubtotal;
    if (modalSummaryFee) modalSummaryFee.textContent = formattedFee;
    if (modalSummaryTotal) modalSummaryTotal.textContent = formattedTotal;
  }

  // --- VALIDACIÓN AL HACER CLIC EN PAGAR ---
  const form = document.getElementById("payment-form");
  const cardMethodActive = () => {
    const activeTab = document.querySelector(".payment-tab.active");
    return activeTab && activeTab.getAttribute("data-method") === "card";
  };

  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      event.stopPropagation();

      let isValid = true;

      // Reset de clases de error
      form.querySelectorAll(".form-control").forEach(i => i.classList.remove("is-invalid"));

      // Validar Nombre (solo letras, mín 3)
      const nameVal = fullNameInput.value.trim();
      if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{3,}$/.test(nameVal)) {
        fullNameInput.classList.add("is-invalid");
        isValid = false;
      }

      // Validar Email
      const emailInput = document.getElementById("email");
      if (!emailInput.checkValidity()) {
        emailInput.classList.add("is-invalid");
        isValid = false;
      }

      // Validar Teléfono (solo números, mín 8)
      if (!/^[0-9]{8,15}$/.test(phoneInput.value.trim())) {
        phoneInput.classList.add("is-invalid");
        isValid = false;
      }

      // Si el método seleccionado es Tarjeta, se aplican las restricciones de tarjeta
      if (cardMethodActive()) {
        const rawCardNum = cardNumberInput.value.replace(/\s/g, "");
        if (!/^[0-9]{13,16}$/.test(rawCardNum)) {
          cardNumberInput.classList.add("is-invalid");
          isValid = false;
        }

        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{3,}$/.test(cardHolderInput.value.trim())) {
          cardHolderInput.classList.add("is-invalid");
          isValid = false;
        }

        const rawExpiry = cardExpiryInput.value.replace("/", "");
        if (!/^[0-9]{4}$/.test(rawExpiry)) {
          cardExpiryInput.classList.add("is-invalid");
          isValid = false;
        }

        if (!/^[0-9]{3,4}$/.test(cardCvvInput.value.trim())) {
          cardCvvInput.classList.add("is-invalid");
          isValid = false;
        }
      }

      if (isValid) {
        const errorModal = new bootstrap.Modal(document.getElementById('errorPaymentModal'));
        errorModal.show();
      }
    });
  }

  // Manejo de pestañas de pago
  const tabs = document.querySelectorAll(".payment-tab");
  const cardFields = document.getElementById("card-fields");
  tabs.forEach(tab => {
    tab.addEventListener("click", function () {
      tabs.forEach(t => {
        t.classList.remove("active", "btn-dark");
        t.classList.add("btn-outline-dark");
      });
      this.classList.remove("btn-outline-dark");
      this.classList.add("active", "btn-dark");

      if (cardFields) {
        if (this.getAttribute("data-method") === "card") {
          cardFields.style.display = "block";
        } else {
          cardFields.style.display = "none";
        }
      }
    });
  });
});