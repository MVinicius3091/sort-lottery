$(document).ready(function () {
  var NAME_GAME = "Mega-Sena";
  let CONCURSO = "megasena";

  const COLORS = {
    megasena: "#4CAF50",
    quina: "#2196F3",
    lotofacil: "#9C27B0",
    lotomania: "#FF9800",
  };

  const HITS = {
    megasena: 6,
    quina: 5,
    lotofacil: 15,
    lotomania: 20,
  };

  const SIZE_GAMES = {
    megasena: 60,
    quina: 80,
    lotofacil: 25,
    lotomania: 100,
  };

  const numberHits = $('input[name="number-hits"');
  numberHits.mask("00").on("keyup", function () {
    if ($(this).val() > HITS[CONCURSO]) {
      $(this).val(HITS[CONCURSO]);
    }
  });

  // HEADERS BUTTONS
  const btnMenuSortable = $(".btn-sortable");
  btnMenuSortable.each(function () {
    getLastResults($(this).data("game"), (data) => data);
  });

  // API RESULTS
  let inputGame = $("input[name='name-game']");
  let inputConcurso = $("input[name='concurso']");
  let divResult = $(".content-result");
  let infoResult = $(".info-result");
  let numberResult = $(".numbers-result");
  let accumulatorResult = $(".accumulator-result");
  let btnViewResult = $(".btn-view-result");
  inputGame.val(NAME_GAME);

  // GAMES
  const btnGenerateSortable = $("#btn-generate-numbers");
  let divContentNumbers = $(".div-content-numbers");
  let divTemplate = $(".div-template");
  let divTitle = $(".card-title > h5");

  btnMenuSortable.each(function () {
    $(this).css({
      color: COLORS[$(this).data("game")],
      borderColor: COLORS[$(this).data("game")],
    });
  });

  btnMenuSortable.click(function () {
    btnMenuSortable.removeClass("active");
    $(this).addClass("active");
    NAME_GAME = $(this).text().trim();
    CONCURSO = $(this).data("game");
    divContentNumbers.hide("50");
    inputGame.val(NAME_GAME);
    numberHits.val("");
  });

  btnViewResult.click(function () {
    getLastResults(CONCURSO, function (data) {
      inputConcurso.val(data.concurso);
      let repeat = CONCURSO === "megasena" ? 6 : 5;

      divResult.show("50");
      infoResult.html(`
        <p>Concurso: <strong>${data.concurso}</strong></p>  
        <p>Data: <strong>${data.data}</strong></p>
        <p>Próximo sorteio: <strong>${data.dataProximoConcurso}</strong></p>
        <p>Acumulou: <strong>${data.acumulou ? "Sim" : "Não"}</strong></p>
      `);
      numberResult.html("");
      numberResult.css({
        display: "grid",
        gridTemplateColumns: `repeat(${repeat}, 1fr)`,
        gap: "10px",
        alignItems: "center",
        justifyItems: "center",
      });
      data.dezenas.forEach(function (number) {
        numberResult.append(`
          <div 
            class="col rounded-circle text-light" 
            style="border: solid 1px ${COLORS[CONCURSO]}; background-color: ${COLORS[CONCURSO]}; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
            ${number}
          </div>
        `);
      });

      accumulatorResult.html(`
        <p>Valor acumulado do concurso: <strong>${formatMoney(
          data.valorAcumuladoProximoConcurso
        )}</strong></p>
        <p>Valor acumulado para o próximo concurso: <strong>${formatMoney(
          data.valorAcumuladoProximoConcurso
        )}</strong></p>
        <p>Valor estimado para o próximo concurso: <strong>${formatMoney(
          data.valorEstimadoProximoConcurso
        )}</strong></p>
      `);
    });
  });

  btnGenerateSortable.click(function () {
    let repeat = CONCURSO === "megasena" ? 6 : 5;

    divTemplate.css({
      display: "grid",
      gridTemplateColumns: `repeat(${repeat}, 1fr)`,
      gap: "10px",
      alignItems: "center",
      justifyItems: "center",
    });

    $(this).children().addClass("fa-spin");
    sleep(800).then(() => {
      divContentNumbers.show("50");
      divTitle.text(NAME_GAME);
      divTitle.css("color", COLORS[CONCURSO]);

      const numbersSoutable = randomNumbers(
        SIZE_GAMES[CONCURSO],
        HITS[CONCURSO],
        CONCURSO,
        numberHits.val()
      );
      divTemplate.empty();

      numbersSoutable.forEach(function (number) {
        divTemplate.append(`
          <div
            class="col rounded-circle btn-number-sortable"
            style="border: solid 1px ${COLORS[CONCURSO]}; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
            ${number}
          </div>
        `);
      });

      $(this).children().removeClass("fa-spin");
      $(".btn-number-sortable").click(function () {
        $(this).css({
          color: "#ffffff",
          backgroundColor: COLORS[CONCURSO],
        });
      });
    });
  });
});

function getLastResults(concurso, callback) {
  if (localStorage.getItem(`${concurso}`)) {
    const cachedData = JSON.parse(localStorage.getItem(`${concurso}`));
    if (cachedData.dataAtual == new Date().toLocaleDateString()) {
      callback(cachedData);
      return;
    }
  }

  $.ajax({
    url: `https://loteriascaixa-api.herokuapp.com/api/${concurso}/latest`,
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    dataType: "json",
    success: function (response) {
      callback(response);
      response.dataAtual = new Date().toLocaleDateString();
      localStorage.setItem(`${concurso}`, JSON.stringify(response));
    },
  });
}

function randomNumbers(size_game, match_hits, consurso, number_hits) {
  let numberResults = JSON.parse(localStorage.getItem(`${consurso}`));
  let numbers = [];

  if (number_hits) {
    const previousNumbers = numberResults.dezenas.map(Number);
    while (numbers.length < number_hits && previousNumbers.length > 0) {
      let idx = Math.floor(Math.random() * previousNumbers.length);
      let selected = previousNumbers[idx];
      if (!numbers.includes(selected)) {
        numbers.push(selected);
      }
    }
  }

  while (numbers.length < match_hits) {
    let randomNumber = Math.floor(Math.random() * size_game) + 1;
    if (!numbers.includes(randomNumber)) {
      numbers.push(randomNumber);
    }
  }

  return numbers.sort((a, b) => a - b);
}

function formatMoney(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
