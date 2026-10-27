document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("sponsorForm");
  const dropZone = document.getElementById("dropZone");
  const logoInput = document.getElementById("logoInput");
  const dropZoneContent = document.getElementById("dropZoneContent");
  const filePreview = document.getElementById("filePreview");
  const previewImg = document.getElementById("previewImg");
  const fileName = document.getElementById("fileName");
  const btnRemoveFile = document.getElementById("btnRemoveFile");
  const successAlert = document.getElementById("successAlert");

  // 1. Abrir explorador al hacer clic en la zona de drop
  dropZone.addEventListener("click", function (e) {
    if (e.target !== btnRemoveFile && !btnRemoveFile.contains(e.target)) {
      logoInput.click();
    }
  });

  // 2. Efecto Drag and Drop
  ["dragenter", "dragover"].forEach((eventName) => {
    dropZone.addEventListener(eventName, (e) => {
      e.preventDefault();
      dropZone.classList.add("dragover");
    });
  });

  ["dragleave", "drop"].forEach((eventName) => {
    dropZone.addEventListener(eventName, (e) => {
      e.preventDefault();
      dropZone.classList.remove("dragover");
    });
  });

  dropZone.addEventListener("drop", (e) => {
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      logoInput.files = files;
      mostrarVistaPrevia(files[0]);
    }
  });

  // 3. Selección manual de archivo
  logoInput.addEventListener("change", function () {
    if (this.files && this.files[0]) {
      mostrarVistaPrevia(this.files[0]);
    }
  });

  // Función para renderizar la vista previa
  function mostrarVistaPrevia(file) {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = function (e) {
        previewImg.src = e.target.result;
        fileName.textContent = file.name;
        dropZoneContent.classList.add("d-none");
        filePreview.classList.remove("d-none");
      };
      reader.readAsDataURL(file);
    }
  }

  // Quitar el archivo seleccionado
  btnRemoveFile.addEventListener("click", function (e) {
    e.stopPropagation();
    logoInput.value = "";
    previewImg.src = "";
    fileName.textContent = "";
    filePreview.classList.add("d-none");
    dropZoneContent.classList.remove("d-none");
  });

  // 4. Validación del Formulario al Enviar
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    let isValid = true;

    // Campos requeridos
    const inputs = form.querySelectorAll("[required]");
    inputs.forEach((input) => {
      if (!input.value.trim()) {
        input.classList.add("is-invalid");
        isValid = false;
      } else {
        input.classList.remove("is-invalid");
      }
    });

    // Validación de formato de email
    const emailInput = document.getElementById("email");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailInput.value && !emailRegex.test(emailInput.value)) {
      emailInput.classList.add("is-invalid");
      isValid = false;
    }

    // Si todo está válido, mostramos el mensaje de éxito
    if (isValid) {
      successAlert.classList.remove("d-none");
      form.reset();
      // Resetear la zona del archivo
      logoInput.value = "";
      filePreview.classList.add("d-none");
      dropZoneContent.classList.remove("d-none");

      // Ocultar la alerta después de 5 segundos
      setTimeout(() => {
        successAlert.classList.add("d-none");
      }, 5000);
    }
  });
});