document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("wedding-form");
  const presenca = document.getElementById("presenca");
  const adultosInput = document.getElementById("adultos");
  const criancasInput = document.getElementById("criancas");

  const nomeInput = document.getElementById("nome");
  const sobrenomeInput = document.getElementById("sobrenome");

  const guestCountSection = document.getElementById("guest-count-section");
  const adultosSection = document.getElementById("adultos-section");
  const criancasSection = document.getElementById("criancas-section");

  const adultosContainer = document.getElementById("adultos-container");
  const criancasContainer = document.getElementById("criancas-container");

  function createGuestRow(type, index) {
    const row = document.createElement("div");
    row.className = "guest-row";

    row.innerHTML = `
      <div class="guest-row-title">${type === "adulto" ? "Adulto" : "Criança"} ${index + 1}</div>
      <div class="form-grid-3">
        <div class="form-field">
          <label for="${type}-nome-${index}">Nome <span class="req">(obrigatório)</span></label>
          <input
            class="input guest-required"
            id="${type}-nome-${index}"
            name="${type}_nome_${index}"
            type="text"
          >
        </div>

        <div class="form-field">
          <label for="${type}-apelido-${index}">Apelido <span class="req">(obrigatório)</span></label>
          <input
            class="input guest-required"
            id="${type}-apelido-${index}"
            name="${type}_apelido_${index}"
            type="text"
          >
        </div>

        <div class="form-field">
          <label for="${type}-restricoes-${index}">Restrições Alimentares</label>
          <input
            class="input"
            id="${type}-restricoes-${index}"
            name="${type}_restricoes_${index}"
            type="text"
            placeholder="Ex.: vegetariano, sem glúten..."
          >
        </div>
      </div>
    `;

    return row;
  }

  function updateRequiredFieldsForGuests() {
    const shouldRequire = presenca.value === "Sim";

    document.querySelectorAll(".guest-required").forEach((field) => {
      field.required = shouldRequire;
    });
  }

  function shouldLockFirstAdult() {
    const confirmacao = presenca.value;
    const adultos = Math.max(0, parseInt(adultosInput.value, 10) || 0);

    return confirmacao === "Sim" && adultos >= 1;
  }

  function setLockedStyle(field, locked) {
    if (!field) return;

    field.readOnly = locked;
    field.style.backgroundColor = locked ? "#f2f2f2" : "";
    field.style.color = locked ? "#666" : "";
    field.style.cursor = locked ? "not-allowed" : "";
  }

  function preencherPrimeiroAdultoAutomaticamente() {
    const campoNomeAdulto = document.getElementById("adulto-nome-0");
    const campoApelidoAdulto = document.getElementById("adulto-apelido-0");

    if (!campoNomeAdulto || !campoApelidoAdulto) return;

    if (shouldLockFirstAdult()) {
      campoNomeAdulto.value = nomeInput.value.trim();
      campoApelidoAdulto.value = sobrenomeInput.value.trim();

      setLockedStyle(campoNomeAdulto, true);
      setLockedStyle(campoApelidoAdulto, true);
    } else {
      setLockedStyle(campoNomeAdulto, false);
      setLockedStyle(campoApelidoAdulto, false);
    }
  }

  function renderGuests(container, type, count) {
    container.innerHTML = "";

    for (let i = 0; i < count; i++) {
      const row = createGuestRow(type, i);
      container.appendChild(row);
    }

    updateRequiredFieldsForGuests();
  }

  function refreshGuestFields() {
    const confirmacao = presenca.value;

    if (confirmacao === "Sim") {
      guestCountSection.style.display = "block";

      const adultos = Math.max(0, parseInt(adultosInput.value, 10) || 0);
      const criancas = Math.max(0, parseInt(criancasInput.value, 10) || 0);

      renderGuests(adultosContainer, "adulto", adultos);
      renderGuests(criancasContainer, "crianca", criancas);

      adultosSection.style.display = adultos > 0 ? "block" : "none";
      criancasSection.style.display = criancas > 0 ? "block" : "none";

      preencherPrimeiroAdultoAutomaticamente();
    } else {
      guestCountSection.style.display = confirmacao === "Não" ? "none" : "block";
      adultosSection.style.display = "none";
      criancasSection.style.display = "none";
      adultosContainer.innerHTML = "";
      criancasContainer.innerHTML = "";
    }
  }

  function collectGuestData(type, count) {
    const guests = [];

    for (let i = 0; i < count; i++) {
      const nome = document.getElementById(`${type}-nome-${i}`)?.value.trim() || "";
      const apelido = document.getElementById(`${type}-apelido-${i}`)?.value.trim() || "";
      const restricoesAlimentares = document.getElementById(`${type}-restricoes-${i}`)?.value.trim() || "";

      guests.push({
        nome,
        apelido,
        restricoesAlimentares
      });
    }

    return guests;
  }

  presenca.addEventListener("change", function () {
    if (presenca.value === "Não") {
      adultosInput.value = 0;
      criancasInput.value = 0;
    } else if (presenca.value === "Sim" && !adultosInput.value) {
      adultosInput.value = 1;
    }

    refreshGuestFields();
  });

  adultosInput.addEventListener("input", function () {
    refreshGuestFields();
  });

  criancasInput.addEventListener("input", function () {
    refreshGuestFields();
  });

  nomeInput.addEventListener("input", preencherPrimeiroAdultoAutomaticamente);
  sobrenomeInput.addEventListener("input", preencherPrimeiroAdultoAutomaticamente);

  refreshGuestFields();

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const confirmacao = presenca.value;
    const adultos = confirmacao === "Sim" ? Math.max(0, parseInt(adultosInput.value, 10) || 0) : 0;
    const criancas = confirmacao === "Sim" ? Math.max(0, parseInt(criancasInput.value, 10) || 0) : 0;

    const data = {
      nome: document.getElementById("nome").value.trim(),
      sobrenome: document.getElementById("sobrenome").value.trim(),
      email: document.getElementById("email").value.trim(),
      telefone: document.getElementById("telefone").value.trim(),
      presenca: confirmacao,
      adultos: adultos,
      criancas: criancas,
      adultosDetalhes: confirmacao === "Sim" ? collectGuestData("adulto", adultos) : [],
      criancasDetalhes: confirmacao === "Sim" ? collectGuestData("crianca", criancas) : [],
      comentarios: ""
    };

    fetch("https://script.google.com/macros/s/AKfycbxrKEyYAucXJiwtiak4IIVNtvv-fpCb1D2NTb8CwUzxZlnqoRyBmvUjtieAm6BwFk7N/exec", {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
      .then(() => {
        alert("Resposta enviada com sucesso!");
        form.reset();
        adultosInput.value = 1;
        criancasInput.value = 0;
        refreshGuestFields();
      })
      .catch(() => {
        alert("Erro ao enviar. Tenta novamente.");
      });
  });
});