document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("sponsorForm");
  const dropZone = document.getElementById("dropZone");
  const logoInput = document.getElementById("logoInput");
  const dropZoneContent = document.getElementById("dropZoneContent");
  const filePreview = document.getElementById("filePreview");
  const previewImg = document.getElementById("previewImg");
  const fileNameSpan = document.getElementById("fileName");
  const btnRemoveFile = document.getElementById("btnRemoveFile");
  const successAlert = document.getElementById("successAlert");

  if (!form) return;

  if (dropZone && logoInput) {
    dropZone.addEventListener("click", () => {
      logoInput.click();
    });

    ["dragenter", "dragover", "dragleave", "drop"].forEach(eventName => {
      dropZone.addEventListener(eventName, (event) => {
        event.preventDefault();
        event.stopPropagation();
      }, false);
    });

    ["dragenter", "dragover"].forEach(eventName => {
      dropZone.addEventListener(eventName, (event) => {
        dropZone.classList.add("dragover");
      }, false);
    });

    ["dragleave", "drop"].forEach(eventName => {
      dropZone.addEventListener(eventName, (event) => {
        dropZone.classList.remove("dragover");
      }, false);
    });

    dropZone.addEventListener("drop", (event) => {
      const files = event.dataTransfer.files;
      if (files.length > 0) {
        logoInput.files = files;
        handleFile(files[0]);
      }
    });

    logoInput.addEventListener("change", () => {
      if (logoInput.files.length > 0) {
        handleFile(logoInput.files[0]);
      }
    });
  }

  function handleFile(file) {
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert("El archivo es demasiado pesado. El tamaño máximo es 5MB.");
      logoInput.value = "";
      return;
    }

    if (fileNameSpan) fileNameSpan.textContent = file.name;

    const reader = new FileReader();
    reader.onload = function(event) {
      if (previewImg) previewImg.src = event.target.result;
      if (dropZoneContent) dropZoneContent.classList.add("d-none");
      if (filePreview) filePreview.classList.remove("d-none");
    }
    reader.readAsDataURL(file);
  }

  if (btnRemoveFile) {
    btnRemoveFile.addEventListener("click", (event) => {
      event.stopPropagation();
      logoInput.value = "";
      if (previewImg) previewImg.src = "";
      if (filePreview) filePreview.classList.add("d-none");
      if (dropZoneContent) dropZoneContent.classList.remove("d-none");
    });
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const nombre = form.querySelector("#nombre");
    const apellido = form.querySelector("#apellido");
    const empresa = form.querySelector("#empresa");
    const email = form.querySelector("#email");
    const tipoSponsor = form.querySelector("#tipoSponsor");

    let formIsValid = true;
    let primerCampoConError = null;

    function setError(inputElement, esError) {
      if (!inputElement) return;
      if (esError) {
        inputElement.classList.add("is-invalid");
        formIsValid = false;
        if (!primerCampoConError) {
          primerCampoConError = inputElement;
        }
      } else {
        inputElement.classList.remove("is-invalid");
      }
    }

    setError(nombre, !nombre || !nombre.value.trim());
    setError(apellido, !apellido || !apellido.value.trim());
    setError(empresa, !empresa || !empresa.value.trim());

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailInvalido = !email || !email.value.trim() || !emailRegex.test(email.value.trim());
    setError(email, emailInvalido);

    setError(tipoSponsor, !tipoSponsor || !tipoSponsor.value || tipoSponsor.value === "");

    if (!formIsValid) {
      primerCampoConError.focus();
      const labelText = primerCampoConError.previousElementSibling ? primerCampoConError.previousElementSibling.textContent.replace("*", "").trim() : "Campo obligatorio";
      alert("Por favor, revisa el campo marcado en rojo: " + labelText);
      return;
    }

    if (successAlert) {
      successAlert.innerHTML = `<i class="bi bi-check-circle-fill me-2"></i> Sponsor enviado. Recibirá una respuesta a la brevedad.`;
      successAlert.classList.remove("d-none");
    } else {
      alert("Sponsor enviado. Recibirá una respuesta a la brevedad.");
    }

    form.reset();
    if (filePreview && dropZoneContent) {
      filePreview.classList.add("d-none");
      dropZoneContent.classList.remove("d-none");
      if (previewImg) previewImg.src = "";
    }

    [nombre, apellido, empresa, email, tipoSponsor].forEach(input => {
      if (input) input.classList.remove("is-invalid");
    });

    setTimeout(() => {
      if (successAlert) {
        successAlert.classList.add("d-none");
      }
    }, 6000);
  });
});