/**
 * @description Object used for uniformly making comparisons
 */
const cmp = {
  "LESSER": -1,
  "EQUAL": 0,
  "GREATER": 1,
  "DIFFERENT": 2, // used when strings/objects are different
}


/**
 * @description BasicData Object class
 */
class BasicData {
  constructor({ height, weight, diet }) {
    this.height = height;
    this.weight = weight;
    this.diet = diet;
  }

  compareHeightTo(other) {
    return this.height > other.height
      ? cmp.GREATER
      : (this.height === other.height ? cmp.EQUAL : cmp.LESSER);
  }

  compareWeightTo(other) {
    return this.weight > other.weight
      ? cmp.GREATER
      : (this.weight === other.weight ? cmp.EQUAL : cmp.LESSER);
  }

  compareDietTo(other) {
    return this.diet === other.diet ? cmp.EQUAL : cmp.DIFFERENT;
  }
}


/**
 * @description Human Object class
 */
class Human extends BasicData {
  constructor({ name, height, weight, diet }) {
    super({ height, weight, diet });

    this.name = name ? name : "Anonymous";
    this.fact = "Sorry, No interesting fact found!";
    this.imgURL = "";
  }
}


/**
 * @description Dinosaur Object class
 */
class Dinosaur extends BasicData {
  constructor({ species, weight, height, diet, where, when, fact }) {
    super({ height, weight, diet });

    this.species = species;
    this.where = where;
    this.when = when;
    this.fact = fact;
    this.imgURL = "";
  }
}


/**
 * @description Retrieve dino JSON data from dino.json file
 * @returns {promise[json]} A promise, which when fulfilled contains dino JSON data
 */
async function getDinoJSONData() {
  return await fetch("dino.json")
    .then(response => {
      return response.json();
    })
    .catch(e => {
      console.error("ERROR: Could not read `Dinosaur` data. ", e);
    });
}


/**
 * @description Create Dinosaur objects from dino JSON data
 * @returns {array[Dinosaur]} Array containing Dinosaur objects
 */
const dinosaurArray = (function getDinosaurArray() {
  let dinoArray = [];

  const dinoJSONData = getDinoJSONData();
  dinoJSONData.then(jsonData => {
    for (const data of jsonData.Dinos) {
      const dino = new Dinosaur(data);
      dino.imgURL = `/images/${dino.species.toLowerCase()}.png`;
      dinoArray.push(dino);
    }
  })

  return dinoArray;
})();


/**
 * @description Get data from form
 * @returns {object} Object containing form data
 */
function getFormData() {

  return (function() {
    const name = document.getElementById("name").value;
    const feet = Number(document.getElementById("feet").value);
    const inches = Number(document.getElementById("inches").value);
    const weight = Number(document.getElementById("weight").value);
    const diet = (document.getElementById("diet").value).toLowerCase();

    const height = (feet * 12) + inches;

    return { name, height, weight, diet };

  })();
}


const grid = document.getElementById("grid");
const form = document.getElementById("dino-compare");
const pageReloadBtn = document.getElementById("page-reload-btn");
const compareBtn = document.getElementById("btn");

/*
 * Main Entry
 *
 * Retrieve user data from form once `compare` button is clicked
 */
compareBtn.addEventListener("click", () => {
  const formData = getFormData();

  // create a human object from form data
  const human = (function(formData) {
    const human = new Human(formData);
    human.imgURL = "/images/human.png";
    return human;
  })(formData);

  // hide form before displaying infographic
  form.hidden = true;

  // make tiles or display infographic
  generateGridTiles(dinosaurArray, human);
  pageReloadBtn.hidden = false;

});

// Reload page to try again (with different data)
pageReloadBtn.addEventListener("click", () => {
  location.reload();
});


/**
 * @description Compare basic data (height, weight, diet) between human and dinosaur
 * @param {array[Dinosaur]} dinosaurs - An array containing Dinosaur objects
 * @param {Human} human - Human object from form data
 * @returns {object} Comparison statistics for each dinosaur and human
 */
const compareBasicData = (dinosaurs, human) => {

  const statistics = {}
  for (const dino of dinosaurs) {

    statistics[human.name] = {};
    if (dino.compareHeightTo(human) === cmp.LESSER) {
      statistics[human.name].height = `I'm <em>taller</em>  than a ${dino.species}!!`;
    }
    if (human.compareWeightTo(dino) === cmp.GREATER) {
      statistics[human.name].weight = `I <em>weigh</em>  more than a ${dino.species}!!`;
    }

    statistics[dino.species] = {};
    statistics[dino.species].height = compareHeight(dino, human);
    statistics[dino.species].weight = compareWeight(dino, human);
    statistics[dino.species].diet = compareDiet(dino, human);
  }

  return statistics;
};


/**
 * @description Compare height between human and dinosaur
 * @param {Dinosaur} dinosaur - Dinosaur object
 * @param {Human} human - Human object from form data
 * @returns {string} Comparison string between dinosaur and human
 */
const compareHeight = (dino, human) => {
  const height = dino.height.toLocaleString("en-US");
  const comparison = human.height > 0
    ? Math.round((dino.height / human.height)) : dino.height;

  if (dino.compareHeightTo(human) === cmp.GREATER) {
    return `At ${height} inches, I am <em>${comparison}</em> times taller than hooman!`;
  } else if (dino.compareHeightTo(human) === cmp.EQUAL) {
    return `At ${height} inches, I am the <em>same</em> height as hooman!`;
  } else {
    return `At ${height} inches, hooman is <em>${Math.round((human.height / dino.height))}</em> times taller than me!`;
  }
};


/**
 * @description Compare weight between human and dinosaur
 * @param {Dinosaur} dinosaur - Dinosaur object
 * @param {Human} human - Human object from form data
 * @returns {string} Comparison string between dinosaur and human
 */
const compareWeight = (dino, human) => {
  const weight = dino.weight.toLocaleString("en-US");
  const comparison = human.weight > 0
    ? Math.round((dino.weight / human.weight)) : dino.weight;

  if (dino.compareWeightTo(human) === cmp.GREATER) {
    return `At ${weight} pounds, I am <em>${comparison}</em> times heavier than hooman!`;
  } else if (dino.compareWeightTo(human) === cmp.EQUAL) {
    return `At ${weight} pounds, I am the <em>same</em> weight as hooman!`;
  } else {
    return `At ${weight} pounds, hooman is <em>${Math.round((human.weight / dino.weight))}</em> times heavier than me!`;
  }
};


/**
 * @description Compare diet between human and dinosaur
 * @param {Dinosaur} dinosaur - Dinosaur object
 * @param {Human} human - Human object from form data
 * @returns {string} Comparison string between dinosaur and human
 */
const compareDiet = (dino, human) => {
  if (dino.compareDietTo(human) === cmp.DIFFERENT) {
    return `As ${dino.diet[0] === "o" ? "an <em>" + dino.diet : "a <em>" + dino.diet}</em>, I eat differently from hooman!`;
  } else {
    return `As ${dino.diet[0] === "o" ? "an <em>" + dino.diet : "a <em>" + dino.diet}</em>, I have same diet as hooman!`;
  }
};

/*
    Grid Tile layout:
      _____________
      | 1 | 2 | 3 |
      -------------
      | 4 | H | 6 |
      -------------
      | 7 | 8 | 9 |
      -------------
    Note:  H => human tile (5)
*/

/**
 * @description Generate Grid Tiles and display infographic with the `human` in the center tile
 * @param {array[Dinosaur]} dinosaurs - An array containing Dinosaur objects
 * @param {Human} human - Human object from form data
 * @returns {object} Comparison statistics for each dinosaur and human
 */
const generateGridTiles = (dinosaurs, human) => {
  const gridTileObjects = randomizeGridTileOrder(dinosaurs)
  const statistics = compareBasicData(dinosaurs, human);

  // position human at the center of the grid tile objects
  gridTileObjects.splice(4, 0, human);

  for (const object of gridTileObjects) {
    const objectStats = object.species ? object.species : object.name;
    grid.innerHTML += generateTile(object, statistics[objectStats]);
  }
};


/**
 * @description Randomize the order of elements in grid tile array
 * @param {array} gridTiles - An array containing grid tile objects
 * @returns {array} Array object with elements in random order
 */
const randomizeGridTileOrder = (gridTiles) => {
  return gridTiles.sort(() => Math.random() - 0.5)
};


/**
 * @description Generate markup for each tile object in grid array
 * @param {object} entity - A grid tile object representing a dinosaur or human
 * @param {object} stats - Statistics for the grid tile object (entity)
 * @returns {string} String markup representation of a grid tile
 */
const generateTile = (entity, stats) => {
  const identity = {};

  if (entity instanceof Human) {
    // Entity is a Human
    identity.id = entity.name;
    identity.class = "human";
    identity.imgCaption = "hooman";
    identity.statsList = `
        <ul>
            <li> I am <em>${entity.height}</em> inches tall</li>
            <li> My current weight is <em>${entity.weight}</em> pounds </li>
            <li> I am ${entity.diet[0] === "o" ? "an <em>" + entity.diet : "a <em>" + entity.diet}</em> .</li>
        </ul>
        `;

    // set a random fact for the human from the stats
    if ((Object.keys(stats).length !== 0)) {
      entity.fact = (Math.random() < 0.5) ? stats.height : stats.weight;
    }

  } else {
    // Entity is a Dinosaur
    identity.id = entity.species;
    identity.class = "dinosaur";
    identity.imgCaption = entity.species.split(" ").join("-").toLowerCase();
    identity.statsList = `
        <ul>
          <li>${stats.height}</li>
          <li>${stats.weight}</li>
          <li>${stats.diet}</li>
          <li>${entity.where ? "I made <em>" + entity.where + "</em> my backyard" : ""} </li>
          <li>${entity.when ? "I lived in <em>" + entity.when + "</em> period" : ""} </li>
        </ul >
      `;
  };

  // return grid-tile template
  return `
        <div class="grid-item" data-entity="${identity.class}">
          <header class="grid-item-header">
            <h3>${identity.id}</h3>
            <figure>
                <img src="${entity.imgURL}" alt="${identity.id.toLowerCase()} image"/>
                <figcaption>${identity.imgCaption}</figcaption>
            </figure>
          </header>

          ${identity.statsList}

          <footer class="grid-item-footer">
            <p>${entity.fact ? entity.fact : ""}</p>
          </footer>
        </div >
       `;
};
