$(document).ready(function () {
  var NAME_GAME = "Mega-Sena";
  let CONCURSO = "megasena";

  const COLORS = {
    megasena: "#4CAF50",
    quina: "#2196F3",
    lotofacil: "#FF9800",
    lotomania: "#9C27B0",
  };
  const SIZE_GAMES = {
    megasena: 60,
    quina: 80,
    lotofacil: 25,
    lotomania: 100,
  };

  // HEADERS BUTTONS
  const btnSortable = $("#btn-sortable");
  const btnMenuSortable = $(".btn-sortable");

  // API RESULTS
  let inputGame = $("input[name='name-game']");
  let inputConcurso = $("input[name='concurso']");
  let divResult = $(".content-result");
  let infoResult = $(".info-result");
  let numberResult = $(".numbers-result");
  let accumulatorResult = $(".accumulator-result");
  let btnViewResult = $(".btn-view-result");
  inputGame.val(NAME_GAME);

  let totalGames = $(".total-games");
  let divContentNumbers = $(".div-content-numbers");
  let divTemplate = $(".div-template");
  let divCard = $(".card");
  let divTitle = $(".card-title > h5");

  btnMenuSortable.click(function () {
    btnMenuSortable.removeClass("active");
    $(this).addClass("active");
    NAME_GAME = $(this).text().trim();
    CONCURSO = $(this).data("game");
    divContentNumbers.hide("50");
    inputGame.val(NAME_GAME);
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
            class="col rounded-circle" 
            style="border: solid 1px ${COLORS[CONCURSO]}; width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">
            ${number}
          </div>
        `);
      });

      accumulatorResult.html(`
        <p>Valor acumulado do concurso: <strong>${formatMoney(
          data.valorAcumuladoProximoConcurso
        )}</strong></p>
        <p>Valor estimado para o próximo concurso: <strong>${formatMoney(
          data.valorEstimadoProximoConcurso
        )}</strong></p>
      `);
    });
  });

  btnSortable.click(function () {
    divContentNumbers.show("50");
    if (NAME_GAME != "Favoritos") {
      console.log(COLORS[NAME_GAME], NAME_GAME);

      divTitle.text(NAME_GAME);
      divTitle.css("color", COLORS[NAME_GAME]);
    }
  });
});

function getLastResults(concurso, callback) {
  $.ajax({
    url: `https://loteriascaixa-api.herokuapp.com/api/${concurso}/latest`,
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    dataType: "json",
    success: function (response) {
      callback(response);
    },
  });
}

function formatMoney(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function template(data) {}

function templaterResuts(data) {}
