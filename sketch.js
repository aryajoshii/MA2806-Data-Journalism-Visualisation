let books = [];
let selectedBook = null;
let dropdownGenre, dropdownEthnicity;
let bookTable; 

let colours = {
  bg: "#05054F",
  text: "#ff9ecf",
  popupBg: "#ffffff",
  spine1: "#FFEBA4",
  spine2: "#FFE1EC"
};

function preload(){
  bookTable = loadTable('book.csv', 'header');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont("Times New Roman");

  for (let i = 0; i < bookTable.getRowCount(); i++) {
    let row = bookTable.getRow(i);
    books.push({
      w: 120,
      h: 18,
      y: height,
      targetY: height,
      x: 0,
      xOffset: random(-5, 5), 
      genre: row.get("Genre"),
      author: row.get("Author "),
      title: row.get("Title"),
      ethnicity: row.get("Author Ethnicity"),
      visible: true
    });
  }

  setupDropdowns();
  restackBooks();
}

function draw() {
  background(colours.bg);
  drawTitle();
  drawBooks();
  drawPopup();
}

function restackBooks() {
  let visibleBooks = books.filter(b => b.visible);
  let totalVisible = visibleBooks.length;
  
  let booksPerStack = 20; 
  let numCols = Math.ceil(totalVisible / booksPerStack);
  let spacing = 150;
  
  let totalWidth = (numCols - 1) * spacing;
  let startX = (width / 2) - (totalWidth / 2) - 60; 

  let count = 0;
  for (let b of books) {
    if (b.visible) {
      let col = Math.floor(count / booksPerStack);
      let rowInStack = count % booksPerStack;

      b.x = startX + (col * spacing) + b.xOffset;
      b.targetY = (height - 120) - (rowInStack * (b.h + 2));
      count++;
    } else {
      b.targetY = height + 500; 
    }
  }
}

function drawBooks() {
  cursor(ARROW);
  for (let b of books) {
    b.y = lerp(b.y, b.targetY, 0.1);
    
    if (b.y < height) {
      fill(books.indexOf(b) % 2 === 0 ? colours.spine1 : colours.spine2);
      noStroke();
      rect(b.x, b.y, b.w, b.h, 3);

      if (mouseX > b.x && mouseX < b.x + b.w && mouseY > b.y && mouseY < b.y + b.h) {
        fill(255, 100);
        rect(b.x, b.y, b.w, b.h, 3);
        cursor(HAND);
      }
    }
  }
}

function drawPopup() {
  if (selectedBook) {
    cursor(ARROW);
    fill(0, 180);
    rect(0, 0, width, height);

    fill(255);
    stroke(colours.text);
    strokeWeight(3);
    rectMode(CENTER);
    rect(width / 2, height / 2, 350, 250, 20);
    rectMode(CORNER);

    noStroke();
    fill(colours.bg);
    
    textAlign(CENTER, TOP);
    textSize(18);
    textStyle(BOLD);
    text(selectedBook.title, width / 2 - 150, height / 2 - 90, 300, 100);

    textStyle(NORMAL);
    textSize(14);
    textAlign(LEFT);
    let detailsX = width / 2 - 140;
    text("Author: " + selectedBook.author, detailsX, height / 2 + 10);
    text("Genre: " + selectedBook.genre, detailsX, height / 2 + 35);
    text("Ethnicity: " + selectedBook.ethnicity, detailsX, height / 2 + 60);

    textAlign(CENTER);
    textSize(10);
    fill(100);
    text("Click anywhere to close", width / 2, height / 2 + 100);
  }
}

function applyFilter() {
  let g = dropdownGenre.value();
  let e = dropdownEthnicity.value();

  for (let b of books) {
    let gMatch = (g === 'All Genres' || b.genre === g);
    let eMatch = (e === 'All Ethnicities' || b.ethnicity === e);
    b.visible = (gMatch && eMatch);
  }
  restackBooks();
}

function setupDropdowns() {
  dropdownGenre = createSelect();
  dropdownGenre.position(30, 30);
  dropdownGenre.option('All Genres');
  dropdownGenre.option('Mystery');
  dropdownGenre.option('Thriller');
  dropdownGenre.option('Historical');
  dropdownGenre.option('Memoir');
  dropdownGenre.option('Dystopia');
  dropdownGenre.option('Sci-fi');
  dropdownGenre.option('Self Help');
  dropdownGenre.option('Educational');
  dropdownGenre.option('Romance');
  dropdownGenre.option('Fantasy');
  dropdownGenre.option('Other');
  dropdownGenre.option('Childrens');
  dropdownGenre.option('Coming-of-Age');
  dropdownGenre.option('Lit-Fic');
  dropdownGenre.changed(applyFilter);
  styleDropdown(dropdownGenre);

  dropdownEthnicity = createSelect();
  dropdownEthnicity.position(200, 30);
  dropdownEthnicity.option('All Ethnicities');
  dropdownEthnicity.option('Western/Northern European');
  dropdownEthnicity.option('White (North American)');
  dropdownEthnicity.option('Southeast Asian');
  dropdownEthnicity.option('Central Asian');
  dropdownEthnicity.option('White (Oceanic)');
  dropdownEthnicity.option('East Asian');
  dropdownEthnicity.option('Unknown');
  dropdownEthnicity.option('Western Asia');
  dropdownEthnicity.option('Mixed');
  dropdownEthnicity.option('South Asian');
  dropdownEthnicity.changed(applyFilter);
  styleDropdown(dropdownEthnicity);
}

function styleDropdown(d) {
  d.size(150, 35);
  d.style('background-color', '#ff9ecf');
  d.style('color', '#05054F');
  d.style('border-radius', '10px');
  d.style('font-family', 'Times New Roman');
}

function mousePressed() {
  if (selectedBook) { selectedBook = null; return; }
  for (let b of books) {
    if (b.visible && mouseX > b.x && mouseX < b.x + b.w && mouseY > b.y && mouseY < b.y + b.h) {
      selectedBook = b;
    }
  }
}

function drawTitle() {
  fill(colours.text);
  noStroke();
  textAlign(CENTER);
  textSize(22);
  text("bestseller library", width / 2, height - 40);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  restackBooks();
}