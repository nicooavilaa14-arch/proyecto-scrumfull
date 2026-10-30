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
  const form = document.getElementById("checkout-section");
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
// --- INICIALIZACIÓN DEL MAPA INTERACTIVO DE ROLLING CODE SCHOOL ---
document.addEventListener("DOMContentLoaded", function () {
  // Coordenadas exactas de Gral. Paz 576, San Miguel de Tucumán
  const lat = -26.836600;
  const lng = -65.207200;

  // Carga del script de Leaflet dinámicamente si no está cargado
  if (typeof L !== 'undefined') {
    initMap(lat, lng);
  } else {
    const script = document.createElement('script');
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.integrity = "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=";
    script.crossOrigin = "";
    script.onload = () => initMap(lat, lng);
    document.head.appendChild(script);
  }

  function initMap(lat, lng) {
    const mapElement = document.getElementById('map');
    if (!mapElement) return;

    // Crear el mapa centrado en Rolling Code School
    const map = L.map('map', {
      zoomControl: false,
      attributionControl: false
    }).setView([lat, lng], 16);

    // Capa de OpenStreetMap directa y sin restricciones de API Key
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    }).addTo(map);

    // Marcador rojo personalizado exacto
    const redMarkerIcon = L.divIcon({
      className: 'custom-red-pin',
      html: '<div style="background-color: #e63946; width: 16px; height: 16px; border-radius: 50%; border: 3px solid #fff; box-shadow: 0 0 15px #e63946;"></div>',
      iconSize: [16, 16],
      iconAnchor: [8, 8]
    });

    L.marker([lat, lng], { icon: redMarkerIcon }).addTo(map)
      .bindPopup("<b>Rolling Code School</b><br>Gral. Paz 576, Entrepiso");
  }
});
document.addEventListener("DOMContentLoaded", function () {
  let ticketPrice = 25000;
  let ticketName = "Early Bird";
  let quantity = 1;
  const MAX_TICKETS = 200;

  const ticketCards = document.querySelectorAll(".ticket-card");
  const qtyInput = document.getElementById("ticket-qty");
  const increaseBtn = document.getElementById("increase-btn");
  const decreaseBtn = document.getElementById("decrease-btn");

  const step1 = document.getElementById("step-1");
  const step2 = document.getElementById("step-2");
  const step3 = document.getElementById("step-3");
  
  const ind1 = document.getElementById("ind-step-1");
  const ind2 = document.getElementById("ind-step-2");
  const ind3 = document.getElementById("ind-step-3");
  const ind4 = document.getElementById("ind-step-4");

  const btnToStep2 = document.getElementById("btn-to-step-2");
  const btnBackStep1 = document.getElementById("btn-back-to-step-1");
  const btnToStep3 = document.getElementById("btn-to-step-3");
  const btnBackStep2 = document.getElementById("btn-back-to-step-2");

  const summaryQty = document.getElementById("summary-qty");
  const summaryTicketName = document.getElementById("summary-ticket-name");
  const summarySubtotal = document.getElementById("summary-subtotal");
  const summaryFee = document.getElementById("summary-fee");
  const summaryTotal = document.getElementById("summary-total");
  const btnTotal = document.getElementById("btn-total");

  const fullNameInput = document.getElementById("full-name");
  const phoneInput = document.getElementById("phone");
  const emailInput = document.getElementById("email");
  const cardNumberInput = document.getElementById("card-number");
  const cardHolderInput = document.getElementById("card-holder");
  const cardExpiryInput = document.getElementById("card-expiry");
  const cardCvvInput = document.getElementById("card-cvv");

  // --- ACTUALIZAR INDICADORES SUPERIORES (4 PASOS) ---
  function updateIndicators(activeStep) {
    const indicators = [ind1, ind2, ind3, ind4];
    indicators.forEach((ind, index) => {
      if (index + 1 === activeStep) {
        ind.className = "badge bg-white text-danger px-3 py-2 rounded-pill fw-bold shadow-sm";
        ind.style.cssText = "font-size: 0.75rem; color: var(--rc-red, #a81d24) !important;";
      } else {
        ind.className = "badge px-3 py-2 rounded-pill fw-normal";
        ind.style.cssText = "font-size: 0.75rem; background-color: var(--rc-black, #000000); color: rgba(255,255,255,0.6); border: 1px solid rgba(255,255,255,0.15);";
      }
    });
  }

 
  if (btnToStep2) {
    btnToStep2.addEventListener("click", () => {
      step1.classList.add("d-none");
      step2.classList.remove("d-none");
      updateIndicators(2);
      window.scrollTo({ top: document.getElementById("checkout-section").offsetTop - 20, behavior: 'smooth' });
    });
  }

  if (btnBackStep1) {
    btnBackStep1.addEventListener("click", () => {
      step2.classList.add("d-none");
      step1.classList.remove("d-none");
      updateIndicators(1);
    });
  }

  if (btnToStep3) {
    btnToStep3.addEventListener("click", () => {
      let dataValid = true;
      fullNameInput.classList.remove("is-invalid");
      emailInput.classList.remove("is-invalid");
      phoneInput.classList.remove("is-invalid");

      if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{3,}$/.test(fullNameInput.value.trim())) {
        fullNameInput.classList.add("is-invalid");
        dataValid = false;
      }
      if (!emailInput.checkValidity()) {
        emailInput.classList.add("is-invalid");
        dataValid = false;
      }
      if (!/^[0-9]{8,15}$/.test(phoneInput.value.trim())) {
        phoneInput.classList.add("is-invalid");
        dataValid = false;
      }

      if (dataValid) {
        step2.classList.add("d-none");
        step3.classList.remove("d-none");
        updateIndicators(3);
        window.scrollTo({ top: document.getElementById("checkout-section").offsetTop - 20, behavior: 'smooth' });
      }
    });
  }

  if (btnBackStep2) {
    btnBackStep2.addEventListener("click", () => {
      step3.classList.add("d-none");
      step2.classList.remove("d-none");
      updateIndicators(2);
    });
  }

  
  ticketCards.forEach(card => {
    card.addEventListener("click", function () {
      ticketCards.forEach(c => c.classList.remove("selected"));
      this.classList.add("selected");

      ticketPrice = parseInt(this.getAttribute("data-price"));
      ticketName = this.getAttribute("data-name");
      updateTotals();
    });
  });

  
  if (qtyInput) {
    qtyInput.addEventListener("input", function () {
      let val = parseInt(this.value.replace(/[^0-9]/g, ""), 10);
      if (isNaN(val) || val < 1) {
        quantity = 1;
      } else if (val > MAX_TICKETS) {
        quantity = MAX_TICKETS;
        this.value = MAX_TICKETS;
      } else {
        quantity = val;
      }
      updateTotals();
    });

    qtyInput.addEventListener("blur", function () {
      if (this.value === "" || parseInt(this.value, 10) < 1) {
        this.value = 1;
        quantity = 1;
        updateTotals();
      }
    });
  }

  if (increaseBtn && decreaseBtn) {
    increaseBtn.addEventListener("click", () => {
      if (quantity < MAX_TICKETS) {
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

    let fSub = "$" + subtotal.toLocaleString("es-AR");
    let fFee = "$" + fee.toLocaleString("es-AR");
    let fTot = "$" + total.toLocaleString("es-AR");

    if (summaryQty) summaryQty.textContent = quantity;
    if (summaryTicketName) summaryTicketName.textContent = `${quantity} entrada${quantity > 1 ? 's' : ''} ${ticketName}`;
    if (summarySubtotal) summarySubtotal.textContent = fSub;
    if (summaryFee) summaryFee.textContent = fFee;
    if (summaryTotal) summaryTotal.textContent = fTot;
    if (btnTotal) btnTotal.textContent = total.toLocaleString("es-AR");

    const modalSummaryTicket = document.getElementById("modal-summary-ticket");
    const modalSummarySubtotal = document.getElementById("modal-summary-subtotal");
    const modalSummaryFee = document.getElementById("modal-summary-fee");
    const modalSummaryTotal = document.getElementById("modal-summary-total");

    if (modalSummaryTicket) modalSummaryTicket.textContent = `${quantity} entrada${quantity > 1 ? 's' : ''} ${ticketName}`;
    if (modalSummarySubtotal) modalSummarySubtotal.textContent = fSub;
    if (modalSummaryFee) modalSummaryFee.textContent = fFee;
    if (modalSummaryTotal) modalSummaryTotal.textContent = fTot;
  }


  function enforceLettersOnly(input) {
    if (input) input.addEventListener("input", function() { this.value = this.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, ""); });
  }
  function enforceNumbersOnly(input) {
    if (input) input.addEventListener("input", function() { this.value = this.value.replace(/[^0-9]/g, ""); });
  }

  enforceLettersOnly(fullNameInput);
  enforceLettersOnly(cardHolderInput);
  enforceNumbersOnly(phoneInput);
  enforceNumbersOnly(cardCvvInput);

  if (cardNumberInput) {
    cardNumberInput.addEventListener("input", function () {
      let raw = this.value.replace(/[^0-9]/g, "");
      if (raw.length > 16) raw = raw.substring(0, 16);
      this.value = raw.match(/.{1,4}/g)?.join(" ") || "";
    });
  }

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

  function validateCardExpiry(expiryStr) {
    const parts = expiryStr.split("/");
    if (parts.length !== 2) return false;
    const month = parseInt(parts[0], 10);
    const year = parseInt("20" + parts[1], 10);
    if (isNaN(month) || isNaN(year) || month < 1 || month > 12) return false;

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    if (year > currentYear) return true;
    if (year === currentYear && month >= currentMonth) return true;
    return false;
  }

  const form = document.getElementById("payment-form");
  const cardMethodActive = () => {
    const activeTab = document.querySelector(".payment-tab.active");
    return activeTab && activeTab.getAttribute("data-method") === "card";
  };

  if (form) {
    form.addEventListener("submit", function (event) {
    
      event.preventDefault();
      event.stopImmediatePropagation();

      let isValid = true;

      if (cardMethodActive()) {
        cardNumberInput.classList.remove("is-invalid");
        cardHolderInput.classList.remove("is-invalid");
        cardExpiryInput.classList.remove("is-invalid");
        cardCvvInput.classList.remove("is-invalid");

        const rawCardNum = cardNumberInput.value.replace(/\s/g, "");
        if (!/^[0-9]{13,16}$/.test(rawCardNum)) { 
          cardNumberInput.classList.add("is-invalid"); 
          isValid = false; 
        }

        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{3,}$/.test(cardHolderInput.value.trim())) { 
          cardHolderInput.classList.add("is-invalid"); 
          isValid = false; 
        }
        
        const expiryVal = cardExpiryInput.value.trim();
        if (!/^[0-9]{2}\/[0-9]{2}$/.test(expiryVal) || !validateCardExpiry(expiryVal)) {
          cardExpiryInput.classList.add("is-invalid");
          isValid = false;
        }

        if (!/^[0-9]{3,4}$/.test(cardCvvInput.value.trim())) { 
          cardCvvInput.classList.add("is-invalid"); 
          isValid = false; 
        }
      }

      
      if (!isValid) {
        updateIndicators(3); 
        return; 
      }

  
      updateIndicators(4); 
      const errorModal = new bootstrap.Modal(document.getElementById('errorPaymentModal'));
      errorModal.show();
    });
  }

  const tabs = document.querySelectorAll(".payment-tab");
  const cardFields = document.getElementById("card-fields");
  tabs.forEach(tab => {
    tab.addEventListener("click", function () {
      tabs.forEach(t => { 
        t.classList.remove("active"); 
        t.style.backgroundColor = "transparent";
        t.style.color = "#212529";
        t.classList.add("btn-outline-dark");
      });
      this.classList.add("active");
      this.classList.remove("btn-outline-dark");
      this.style.backgroundColor = "var(--rc-black, #000000)";
      this.style.color = "#ffffff";
      
      if (cardFields) {
        cardFields.style.display = (this.getAttribute("data-method") === "card") ? "block" : "none";
      }
    });
  });
});
document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");
  const fullNameInput = document.getElementById("full-name");

  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      event.stopImmediatePropagation();

      // Capturar el nombre del input y pasarlo al ticket digital
      const userName = fullNameInput ? (fullNameInput.value.trim() || "Participante") : "Participante";
      const holderElement = document.getElementById("qr-holder-name");
      
      if (holderElement) {
        holderElement.textContent = userName;
      }

      // Mostrar el modal de éxito de Bootstrap
      const modalElement = document.getElementById('errorPaymentModal');
      if (modalElement) {
        const successModal = new bootstrap.Modal(modalElement);
        successModal.show();
      }
    });
  }
});
// Forzar la actualización del nombre en tiempo real apenas hacés clic en el botón de pago
document.addEventListener("click", function (e) {
  if (e.target && e.target.type === "submit" || e.target.closest("button[type='submit']")) {
    const inputNombre = document.getElementById("full-name");
    const spanHolder = document.getElementById("qr-holder-name");
    
    if (inputNombre && spanHolder && inputNombre.value.trim() !== "") {
      spanHolder.textContent = inputNombre.value.trim();
    }
  }
});