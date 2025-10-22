/**
 * Calculadora Hídrica - JavaScript
 * Oceano no Sertão: O Portal da Cultura Hídrica
 */

// Constantes para cálculos de consumo de água
const WATER_CONSUMPTION = {
  // Consumo por minuto de banho (litros)
  SHOWER_PER_MINUTE: 15,

  // Consumo por descarga (litros)
  FLUSH_CONSUMPTION: 6,

  // Consumo por lavagem de roupa (litros)
  LAUNDRY_CONSUMPTION: 120,

  // Consumo por minuto de lavagem de pratos (litros)
  DISHES_PER_MINUTE: 12,

  // Consumo por lavagem de carro (litros)
  CAR_WASH_CONSUMPTION: 200,
};

// Consumo sustentável ideal por pessoa (litros por mês)
const SUSTAINABLE_CONSUMPTION = {
  1: { min: 4500, max: 5100 },
  2: { min: 9000, max: 10200 },
  3: { min: 13500, max: 15300 },
  4: { min: 18000, max: 20400 },
  5: { min: 22500, max: 25500 },
  6: { min: 27000, max: 30600 },
  7: { min: 31500, max: 35700 },
  8: { min: 36000, max: 40800 },
  9: { min: 40500, max: 45900 },
  10: { min: 45000, max: 51000 },
};

// Mensagens de status
const STATUS_MESSAGES = {
  SUCCESS: {
    text: "Parabéns! Seu consumo está dentro do limite sustentável. Continue assim!",
    class: "success",
  },
  WARNING: {
    text: "Seu consumo está próximo do limite. Algumas dicas podem ajudar a economizar.",
    class: "warning",
  },
  DANGER: {
    text: "Seu consumo está acima do ideal. É importante adotar hábitos mais sustentáveis.",
    class: "danger",
  },
};

// Inicialização quando o DOM estiver carregado
document.addEventListener("DOMContentLoaded", function () {
  initializeCalculator();
});

/**
 * Inicializa a calculadora
 */
function initializeCalculator() {
  const form = document.getElementById("waterCalculatorForm");
  const calculateButton = form.querySelector(".btn-calculate");

  // Adiciona event listener ao formulário
  form.addEventListener("submit", handleFormSubmit);

  // Adiciona validação em tempo real
  const inputs = form.querySelectorAll('input[type="number"]');
  inputs.forEach((input) => {
    input.addEventListener("input", validateInput);
    input.addEventListener("blur", validateInput);
  });

  // Inicializa com valores padrão
  setDefaultValues();
}

/**
 * Define valores padrão para o formulário
 */
function setDefaultValues() {
  const defaults = {
    people: 4,
    showers: 1,
    showerDuration: 10,
    flushes: 5,
    laundry: 3,
    dishes: 2,
    dishesDuration: 15,
    carWash: 1,
  };

  Object.keys(defaults).forEach((key) => {
    const input = document.getElementById(key);
    if (input && !input.value) {
      input.value = defaults[key];
    }
  });
}

/**
 * Valida um input individual
 */
function validateInput(event) {
  const input = event.target;
  const value = parseFloat(input.value);
  const min = parseFloat(input.min);
  const max = parseFloat(input.max);

  // Remove classes de erro anteriores
  input.classList.remove("is-invalid");

  // Valida se o valor está dentro dos limites
  if (isNaN(value) || value < min || value > max) {
    input.classList.add("is-invalid");
    return false;
  }

  return true;
}

/**
 * Valida todo o formulário
 */
function validateForm(formData) {
  const errors = [];

  // Validação básica
  if (!formData.people || formData.people < 1) {
    errors.push("Número de pessoas deve ser pelo menos 1");
  }

  if (formData.showerDuration < 1 || formData.showerDuration > 60) {
    errors.push("Duração do banho deve estar entre 1 e 60 minutos");
  }

  if (formData.dishesDuration < 1 || formData.dishesDuration > 60) {
    errors.push("Duração da lavagem de pratos deve estar entre 1 e 60 minutos");
  }

  return errors;
}

/**
 * Manipula o envio do formulário
 */
function handleFormSubmit(event) {
  event.preventDefault();

  const form = event.target;
  const calculateButton = form.querySelector(".btn-calculate");

  // Adiciona estado de loading
  calculateButton.classList.add("loading");
  calculateButton.disabled = true;

  // Simula um pequeno delay para melhor UX
  setTimeout(() => {
    try {
      const formData = getFormData(form);
      const errors = validateForm(formData);

      if (errors.length > 0) {
        showError(errors.join("<br>"));
        return;
      }

      const results = calculateWaterConsumption(formData);
      displayResults(results);
    } catch (error) {
      console.error("Erro no cálculo:", error);
      showError("Ocorreu um erro no cálculo. Tente novamente.");
    } finally {
      // Remove estado de loading
      calculateButton.classList.remove("loading");
      calculateButton.disabled = false;
    }
  }, 500);
}

/**
 * Obtém os dados do formulário
 */
function getFormData(form) {
  const formData = new FormData(form);
  return {
    people: parseInt(formData.get("people")),
    showers: parseInt(formData.get("showers")),
    showerDuration: parseInt(formData.get("showerDuration")),
    flushes: parseInt(formData.get("flushes")),
    laundry: parseInt(formData.get("laundry")),
    dishes: parseInt(formData.get("dishes")),
    dishesDuration: parseInt(formData.get("dishesDuration")),
    carWash: parseInt(formData.get("carWash")),
  };
}

/**
 * Calcula o consumo total de água
 */
function calculateWaterConsumption(data) {
  const {
    people,
    showers,
    showerDuration,
    flushes,
    laundry,
    dishes,
    dishesDuration,
    carWash,
  } = data;

  // Cálculos mensais (30 dias)
  const monthlyShowerConsumption =
    showers * showerDuration * WATER_CONSUMPTION.SHOWER_PER_MINUTE * 30;
  const monthlyFlushConsumption =
    people * flushes * WATER_CONSUMPTION.FLUSH_CONSUMPTION * 30;
  const monthlyLaundryConsumption =
    laundry * WATER_CONSUMPTION.LAUNDRY_CONSUMPTION * 4; // 4 semanas
  const monthlyDishesConsumption =
    dishes * dishesDuration * WATER_CONSUMPTION.DISHES_PER_MINUTE * 30;
  const monthlyCarWashConsumption =
    carWash * WATER_CONSUMPTION.CAR_WASH_CONSUMPTION * 4; // 4 semanas

  const totalConsumption =
    monthlyShowerConsumption +
    monthlyFlushConsumption +
    monthlyLaundryConsumption +
    monthlyDishesConsumption +
    monthlyCarWashConsumption;

  // Consumo ideal baseado no número de pessoas
  const idealRange =
    SUSTAINABLE_CONSUMPTION[people] || SUSTAINABLE_CONSUMPTION[6];
  const idealConsumption = (idealRange.min + idealRange.max) / 2;

  // Calcula a diferença percentual
  const difference =
    ((totalConsumption - idealConsumption) / idealConsumption) * 100;

  // Determina o status
  let status;
  if (totalConsumption <= idealRange.max) {
    status = "SUCCESS";
  } else if (totalConsumption <= idealRange.max * 1.2) {
    status = "WARNING";
  } else {
    status = "DANGER";
  }

  return {
    totalConsumption: Math.round(totalConsumption),
    idealConsumption: Math.round(idealConsumption),
    idealRange: idealRange,
    difference: Math.round(difference * 10) / 10,
    status: status,
    breakdown: {
      shower: Math.round(monthlyShowerConsumption),
      flush: Math.round(monthlyFlushConsumption),
      laundry: Math.round(monthlyLaundryConsumption),
      dishes: Math.round(monthlyDishesConsumption),
      carWash: Math.round(monthlyCarWashConsumption),
    },
  };
}

/**
 * Exibe os resultados na tela
 */
function displayResults(results) {
  const { totalConsumption, idealConsumption, difference, status } = results;

  // Atualiza os valores
  document.getElementById("totalConsumption").textContent =
    formatNumber(totalConsumption);
  document.getElementById("idealConsumption").textContent =
    formatNumber(idealConsumption);
  document.getElementById("difference").textContent =
    formatDifference(difference);

  // Atualiza a mensagem de status
  const statusMessage = document.getElementById("statusMessage");
  const statusData = STATUS_MESSAGES[status];

  statusMessage.className = `status-message ${statusData.class}`;
  statusMessage.innerHTML = `<p>${statusData.text}</p>`;

  // Atualiza as classes dos cards de resultado
  updateResultCards(status);

  // Scroll suave para os resultados
  document.getElementById("results").scrollIntoView({
    behavior: "smooth",
    block: "start",
  });

  // Adiciona animação aos resultados
  animateResults();
}

/**
 * Atualiza as classes dos cards de resultado baseado no status
 */
function updateResultCards(status) {
  const resultCards = document.querySelectorAll(".result-card");

  resultCards.forEach((card) => {
    // Remove classes anteriores
    card.classList.remove("success", "warning", "danger");

    // Adiciona a nova classe baseada no status
    if (status === "SUCCESS") {
      card.classList.add("success");
    } else if (status === "WARNING") {
      card.classList.add("warning");
    } else {
      card.classList.add("danger");
    }
  });
}

/**
 * Formata números com separadores de milhares
 */
function formatNumber(number) {
  return new Intl.NumberFormat("pt-BR").format(number);
}

/**
 * Formata a diferença percentual
 */
function formatDifference(difference) {
  const sign = difference > 0 ? "+" : "";
  return `${sign}${difference}%`;
}

/**
 * Anima os resultados
 */
function animateResults() {
  const resultCards = document.querySelectorAll(".result-card");

  resultCards.forEach((card, index) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(20px)";

    setTimeout(() => {
      card.style.transition = "all 0.6s ease-out";
      card.style.opacity = "1";
      card.style.transform = "translateY(0)";
    }, index * 100);
  });
}

/**
 * Exibe mensagem de erro
 */
function showError(message) {
  const statusMessage = document.getElementById("statusMessage");
  statusMessage.className = "status-message danger";
  statusMessage.innerHTML = `<p>${message}</p>`;

  // Scroll para a mensagem
  statusMessage.scrollIntoView({
    behavior: "smooth",
    block: "center",
  });
}

/**
 * Utilitário para debounce
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Adiciona funcionalidade de tooltip para as dicas
document.addEventListener("DOMContentLoaded", function () {
  const tipCards = document.querySelectorAll(".tip-card");

  tipCards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-5px) scale(1.02)";
    });

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0) scale(1)";
    });
  });
});

// Adiciona funcionalidade de validação em tempo real com debounce
const debouncedValidation = debounce(function (input) {
  validateInput({ target: input });
}, 300);

// Adiciona event listeners para validação em tempo real
document.addEventListener("DOMContentLoaded", function () {
  const inputs = document.querySelectorAll('input[type="number"]');

  inputs.forEach((input) => {
    input.addEventListener("input", function () {
      debouncedValidation(this);
    });
  });
});

// Adiciona funcionalidade de teclado para melhor acessibilidade
document.addEventListener("keydown", function (event) {
  // Enter no formulário
  if (event.key === "Enter" && event.target.tagName === "INPUT") {
    const form = event.target.closest("form");
    if (form) {
      event.preventDefault();
      form.dispatchEvent(new Event("submit"));
    }
  }

  // Escape para limpar formulário
  if (event.key === "Escape") {
    const form = document.getElementById("waterCalculatorForm");
    if (form) {
      form.reset();
      setDefaultValues();
    }
  }
});

// Adiciona funcionalidade de impressão dos resultados
function printResults() {
  const results = document.getElementById("results");
  const printWindow = window.open("", "_blank");

  printWindow.document.write(`
    <html>
      <head>
        <title>Resultados da Calculadora Hídrica</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .result-card { border: 1px solid #ccc; padding: 15px; margin: 10px 0; border-radius: 8px; }
          .result-info h3 { margin: 0 0 5px 0; font-size: 14px; }
          .result-info p { margin: 0; font-size: 18px; font-weight: bold; }
        </style>
      </head>
      <body>
        <h1>Resultados da Calculadora Hídrica</h1>
        ${results.innerHTML}
        <p><small>Gerado em: ${new Date().toLocaleDateString(
          "pt-BR"
        )}</small></p>
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.print();
}

// Adiciona botão de impressão (opcional)
document.addEventListener("DOMContentLoaded", function () {
  const resultsSection = document.querySelector(".calculator-results");

  if (resultsSection) {
    const printButton = document.createElement("button");
    printButton.innerHTML = '<i class="bi bi-printer"></i> Imprimir Resultados';
    printButton.className = "btn btn-outline-secondary btn-sm mt-3";
    printButton.onclick = printResults;

    resultsSection.appendChild(printButton);
  }
});
