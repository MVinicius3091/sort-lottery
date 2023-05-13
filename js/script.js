const btnHeader = document.querySelectorAll("header ul li");
const divContainer = document.querySelector("div.container");
const divContent = document.querySelector("div.container > div");
const btnSort = document.querySelector("button#sort");
const numberGames = document.querySelector("span#games");
const btnMenu = document.querySelector("span#btn-menu");
const divMenu = document.querySelector("div.box-menu");
const divFavorites = document.querySelector("div.container-favorite");
const divContentFavorites = document.querySelector("div.favorites-content");
const divBoxBtn = document.querySelector("div.box-btn");

let id = null;
let counter = 0;
let num = 0;
let arrNumbers = [];
let verifyContent = null;
let topScroll = 100;
let games = 0;
numberGames.innerHTML = games;

btnHeader.forEach((el) => {
  el.addEventListener("click", (element) => {
    const elem = element.target.innerText;

    switch (elem) {
      case "Mega-Sena":
        divContainer.innerHTML = "";
        numberGames.innerHTML = 0;

        id = "mega";
        counter = 6;
        num = 60;
        games = 0;

        moveMenu(divMenu, "hidden");
        break;

      case "Lotofácil":
        divContainer.innerHTML = "";
        numberGames.innerHTML = 0;

        id = "loto";
        counter = 15;
        num = 25;
        games = 0;

        moveMenu(divMenu, "hidden");
        break;

      case "Lotomania":
        divContainer.innerHTML = "";
        numberGames.innerHTML = 0;

        id = "mania";
        counter = 20;
        num = 100;
        games = 0;

        moveMenu(divMenu, "hidden");
        break;

      case "Quina":
        divContainer.innerHTML = "";
        numberGames.innerHTML = 0;

        id = "quina";
        counter = 5;
        num = 80;
        games = 0;

        moveMenu(divMenu, "hidden");
        break;

      case "Favoritos":
        getFavorites();
        moveMenu(divMenu, "hidden");
        numberGames.innerHTML = 0;
        games = 0;

        break;
    }
  });
});

btnSort.addEventListener("click", () => {
  switch (id) {
    case "mega":
      let mega = sortMegaSena();
      divContainer.innerHTML += mega;
      numberGames.innerHTML = ++games;
      break;
    case "loto":
      let loto = sortLotofacil();
      divContainer.innerHTML += loto;
      numberGames.innerHTML = ++games;
      break;
    case "mania":
      let mania = sortLotomania();
      divContainer.innerHTML += mania;
      numberGames.innerHTML = ++games;
      break;
    case "quina":
      let quina = sortQuina();
      divContainer.innerHTML += quina;
      numberGames.innerHTML = ++games;
      break;

    default:
      divContainer.innerHTML = '<h1 id="select-game">Selecione um jogo!</h1>';
      break;
  }

  topScroll += 300;
  divContainer.scroll({ top: topScroll, behavior: "smooth" });

  checkNumbers();
});

btnMenu.addEventListener("click", () => {
  moveMenu(divMenu, "visible");
});

function sortNumbers() {
  while (arrNumbers.length < counter) {
    let numbers = Math.floor(Math.random() * num + 1);

    if (arrNumbers.indexOf(numbers) == -1) {
      arrNumbers.push(numbers);
    }
  }

  return arrNumbers.sort((a, b) => a - b);
}

function sortMegaSena() {
  return geraTemplate("mega", "Mega-sena");
}

function sortLotofacil() {
  let style = "grid-template-columns: repeat(4, 1fr) 40px;  flex-wrap: wrap;";
  return geraTemplate("loto", "Lotofácil", style);
}

function sortLotomania() {
  let style = "grid-template-columns: repeat(4, 1fr) 40px;  flex-wrap: wrap;";
  return geraTemplate("mania", "Lotomania", style);
}

function sortQuina() {
  let style = "grid-template-columns: repeat(4, 1fr) 40px;  flex-wrap: wrap;";
  return geraTemplate("quina", "Quina", style);
}

function geraTemplate(classe, name, style = "") {
  let numbers = sortNumbers();
  let listNumbers = "";

  numbers.map((num) => {
    listNumbers += `<li>${num}</li>`;
  });

  let html = `
  <div class="box-content">
    <div class="box-favorite ${classe}">
      <h3>${name}</h3>
      <span>
        <ion-icon name="heart"></ion-icon> 
        <ion-icon name="heart"></ion-icon
      </span>
    </div>
    <div class="numbers">
      <ul style="${style}">
        ${listNumbers}
      </ul>
    </div>
  </div>`;

  arrNumbers = [];

  return html;
}

function moveMenu(div, handleMove) {
  let id = null;
  let position = -299;

  if (handleMove == "visible") {
    div.style.display = "block";
    id = setInterval(() => {
      div.style.right = ++position + "px";
      if (position == 0) {
        clearInterval(id);
      }
    }, 2);
  } else {
    position = 0;

    id = setInterval(() => {
      div.style.right = --position + "px";
      if (position == -299) {
        clearInterval(id);
        div.style.display = "none";
      }
    }, 2);
  }
}

function checkNumbers() {
  let numbersList = document.querySelectorAll("div.numbers > ul > li");
  let colorContent = document.querySelector("div.box-favorite");
  const btnHeart = document.querySelectorAll("ion-icon[name='heart']");
  let classNumber = colorContent.className.slice(
    colorContent.className.indexOf(" ") + 1
  );

  numbersList.forEach((el) =>
    el.addEventListener("click", () => {
      el.classList.toggle(classNumber);
    })
  );

  btnHeart.forEach((el) => {
    el.addEventListener("click", (e) => {
      let currentColor = e.target.style.color;

      if (currentColor == "") {
        e.target.style.color = "red";
        saveNumbers(el);
      } else if ((currentColor = "red")) {
        e.target.style.color = "";
        removeNumbers(el);
      }
    });
  });
}

let arrFavoriteCache = JSON.parse(localStorage.getItem("saveNumbers"));
let savedNumArr = [];

if (arrFavoriteCache != null) {
  if (arrFavoriteCache.length > 0) {
    arrFavoriteCache.forEach((num) => {
      savedNumArr.push(num);
    });
  }
}

function removeNumbers(elem) {
  const numbersInList =
    elem.offsetParent.offsetParent.nextElementSibling.firstElementChild
      .children;
  let savedNum = JSON.parse(localStorage.getItem("saveNumbers"));

  let numFav = "";

  Array.from(numbersInList).forEach((numbers) => {
    numFav += numbers.innerHTML + ",";
  });

  let numbersSel = numFav.slice(0, -1);

  savedNum.forEach((num, index) => {
    if (num == numbersSel) {
      savedNum.splice(index, 1);
    }
  });

  localStorage.setItem("saveNumbers", JSON.stringify(savedNum));
  savedNumArr = savedNum;
}

function saveNumbers(elem) {
  let numberCont = "";
  const numbersInList =
    elem.offsetParent.offsetParent.nextElementSibling.firstElementChild
      .children;

  Array.from(numbersInList).forEach((numbers) => {
    numberCont += numbers.innerHTML + ",";
  });

  savedNumArr.push(numberCont.slice(0, -1));

  localStorage.setItem("saveNumbers", JSON.stringify(savedNumArr));
}

function getFavorites() {
  divFavorites.style.display = "block";
  divFavorites.classList.add("show-favorites");
  divFavorites.classList.remove("hide-favorites");
  divContentFavorites.innerHTML = "";
  divContainer.innerHTML = "";

  let savedNum = JSON.parse(localStorage.getItem("saveNumbers"));

  geraTemplateFavorites(savedNum, divContentFavorites);
}

function removeFavoriteList(elem) {
  let numbers = elem.offsetParent.nextElementSibling.children;
  let currentNum = "";

  Array.from(numbers).forEach((num) => {
    currentNum += num.innerHTML + ",";
  });

  let numFor = currentNum.slice(0, -1);
  let savedNum = JSON.parse(localStorage.getItem("saveNumbers"));

  savedNum.forEach((num, index) => {
    if (num == numFor) {
      savedNum.splice(index, 1);
    }
  });

  localStorage.setItem("saveNumbers", JSON.stringify(savedNum));
  divContentFavorites.innerHTML = "";
  geraTemplateFavorites(savedNum, divContentFavorites);
  savedNumArr = savedNum;
}

function geraTemplateFavorites(savedNum, div) {
  if (savedNum == null || savedNum.length == 0) {
    div.innerHTML =
      '<h3 id="empty-favorite">Nenhum jogo salvo nos favoritos.</h3>';
    return;
  }

  savedNum.forEach((num) => {
    let favorite = num.split(",");
    let flength = favorite.length;
    let style = "";
    let grid = "";
    let nameGame = "";

    switch (flength) {
      case 6:
        style = "mega";
        nameGame = "Mega-Sena";
        break;
      case 15:
        style = "loto";
        nameGame = "Lotofácil";
        grid = "grid";
        break;
      case 20:
        style = "mania";
        nameGame = "Lotomania";
        grid = "grid";
        break;
      case 5:
        style = "quina";
        nameGame = "Quina";
        grid = "grid";
        break;
    }

    let html = `<div class="box-saved-favorites">
                  <div class="name-game ${style}">
                    <h3>${nameGame}</h3>
                    <button id="btn-remove-favorite" onclick="removeFavoriteList(this)">
                      <ion-icon name="close-circle-outline">
                    </button>
                  </div>
                  
                  <ul class="${grid}">
                    ${favorite.map((nu) => `<li>${nu}</li>`).join("")}
                  </ul>
                </div>`;

    div.innerHTML += html;
  });
}

function hideFavorites() {
  divFavorites.classList.add("hide-favorites");
  divFavorites.classList.remove("show-favorites");
  setTimeout(() => {
    divFavorites.style.display = "none";
  }, 1000);
}
