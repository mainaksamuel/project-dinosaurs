// Comparison metrics
const cmp = {
  "LESSER": -1,
  "EQUAL": 0,
  "GREATER": 1,
  "DIFFERENT": 2, // used for different strings
}

class BasicData {
  constructor({ height, weight, diet }) {
    this.height = height;
    this.weight = weight;
    this.diet = diet;
  }

  isTallerThan(other) {
    return this.height > other.height
      ? cmp.GREATER
      : (this.height === other.height ? cmp.EQUAL : cmp.LESSER);
  }

  isHeavierThan(other) {
    return this.weight > other.weight
      ? cmp.GREATER
      : (this.weight === other.weight ? cmp.EQUAL : cmp.LESSER);
  }

  hasSameDietAs(other) {
    return this.diet === other.diet ? cmp.EQUAL : cmp.DIFFERENT;
  }
}


// Create Human Object
class Human extends BasicData {
  constructor({ name, height, weight, diet }) {
    super({ height, weight, diet });

    this.name = name;
  }
}


// Create Dino Constructor
class Dino extends BasicData {
  constructor({ species, weight, height, diet, where, when, fact }) {
    super({ height, weight, diet });

    this.species = species;
    this.where = where;
    this.when = when;
    this.fact = fact;
    this.imgURL = "";
  }
}


// Create Dino Objects
async function getDinosaurs() {
  return await fetch("dino.json")
    .then(response => {
      return response.json();
    })
    .then(jsonData => {
      const dinoArray = [];
      for (const data of jsonData.Dinos) {
        const dino = new Dino(data);
        dino.imgURL = `/images/${dino.species.toLowerCase()}.png`;
        dinoArray.push(dino);
      }
      return dinoArray;
    })
    .catch(e => {
      console.error("ERROR: Could not read `Dinosaur` data. ", e);
    });
}
const dinos = getDinosaurs();


// Use IIFE to get human data from form
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


function validateFormInput(formData) {
  // TODO
  return formData;
}


const compareBtn = document.getElementById("btn");
compareBtn.addEventListener("click", () => {

  const formData = getFormData();

  // validate form input
  const validatedFormData = validateFormInput(formData);

  // create a human object from valid form data
  const human = (function(validatedFormData) {
    return new Human(validatedFormData);
  })(validatedFormData);

  // make comparison between dinos and human
  dinos.then(dinoObjects => {
    for (const dino of dinoObjects) {
      compareBasicData(human, dino);
    }
  });

  // make tiles or display infographic
  // TODO

});


const compareBasicData = (human, dino) => {
  // compare height
  console.log("Is Taller: ", human.isTallerThan(dino));
  // compare weight
  console.log("Is Heavier: ", human.isHeavierThan(dino));
  // compare diet
  console.log("Same Diet: ", human.hasSameDietAs(dino));

};



/*
    Tile layout:
        H => human tile (5)
    _____________
    | 1 | 2 | 3 |
    -------------
    | 4 | H | 6 |
    -------------
    | 7 | 8 | 9 |
    -------------
*/


const grid = document.getElementById("grid");

const tiles = document.createDocumentFragment("div");
const generateTile = (human, dino) => {
  return `
<article>
</article>
`;
};

// Generate Tiles for each Dino in Array

        // Add tiles to DOM

    // Remove form from screen


// On button click, prepare and display infographic
