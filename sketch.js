//global variables 
let books = [];
let selectedBook = null;
let dropdownGenre, dropdownEthnicity;
let bookTable;
let bookImages = {};
let logoImg;

//colour palette where colourrs are chosen from the design sheet we made
let colours = {
  bg: "#05054F",
  text: "#ff9ecf",
  popupBg: "#ffffff",
  spine1: "#FFEBA4",
  spine2: "#FFE1EC"
};

//26.04.2026- taking hours for the book images to work 
// 27.04.2026- shrunk the images, added a column to the spreadsheet with the image names and it is now working
function preload() {
  logoImg = loadImage('logo.png');
  bookTable = loadTable('book.csv', 'header', () => {
    for (let i = 0; i < bookTable.getRowCount(); i++) {
      let row = bookTable.getRow(i);
      let t = row.get("Title").trim();
      let fileName = row.get("ImageFile").trim();
      if (fileName && !bookImages[t]) {
        bookImages[t] = loadImage('images/' + fileName);
      }
    }
  });
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont("Times New Roman");

  for (let i = 0; i < bookTable.getRowCount(); i++) {
    let row = bookTable.getRow(i);
    
    //had to search up how to do this- more complicated than i thought 
    let rawRating = row.get("Good reads rating ");
    let cleanRating = parseFloat(String(rawRating).replace(/[^0-9.]/g, ''));

    //when you click on a book spine, there will be a pop up with this information 
    books.push({
      w: 120, 
      h: 18, 
      y: height, 
      targetY: height, 
      x: 0,
      xOffset: random(-5, 5),
      genre: row.get("Genre"),
      author: row.get("Author "),
      title: row.get("Title").trim(),
      ethnicity: row.get("Author Ethnicity"),
      rank: row.get("Rank"),
      published: row.get("Published"),
      rating: cleanRating, 
      visible: true
    });
  }

  setupDropdowns();
  restackBooks();
}

function draw() {
  background(colours.bg);
  
  if (logoImg) {
    imageMode(CENTER);
    image(logoImg, width / 2, 90, 500, 240); // Adjust size here
    imageMode(CORNER);
  }

  drawBooks();
  drawPopup();
}

//separated books into multiple stacks because of the amount that we have
function restackBooks() {
  let visibleBooks = books.filter(b => b.visible);
  let booksPerStack = 20;
  let numCols = Math.ceil(visibleBooks.length / booksPerStack);
  let spacing = 150;
  let startX = (width / 2) - (((numCols - 1) * spacing) / 2) - 60;
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
      let img = bookImages[b.title];
      if (img && img.width > 1) {
        image(img, b.x, b.y, b.w, b.h);
      } else {
        fill(books.indexOf(b) % 2 === 0 ? colours.spine1 : colours.spine2);
        noStroke();
        rect(b.x, b.y, b.w, b.h, 3);
      }
      if (mouseX > b.x && mouseX < b.x + b.w && mouseY > b.y && mouseY < b.y + b.h) {
        fill(255, 100);
        rect(b.x, b.y, b.w, b.h, 3);
        cursor(HAND);
        //when you hover over a book it goes slightly shaded so you can see that youve clicked it
      }
    }
  }
}

function drawPopup() {
  if (selectedBook) {
    fill(0, 180);
    rect(0, 0, width, height);
    fill(255);
    stroke(colours.text);
    strokeWeight(3);
    rectMode(CENTER);
    rect(width / 2, height / 2, 400, 320, 20); // Made bigger for all info
    rectMode(CORNER);
    noStroke();
    fill(colours.bg);
    textAlign(CENTER, TOP);
    textSize(18);
    textStyle(BOLD);
    text(selectedBook.title, width / 2 - 180, height / 2 - 130, 360, 100);

    textStyle(NORMAL);
    textSize(14);
    textAlign(LEFT);
    let detailsX = width / 2 - 170;
    let startY = height / 2 - 40;
    
    text("Author: " + selectedBook.author, detailsX, startY);
    text("Genre: " + selectedBook.genre, detailsX, startY + 25);
    text("Ethnicity: " + selectedBook.ethnicity, detailsX, startY + 50);
    text("Rank: " + selectedBook.rank, detailsX, startY + 75);
    text("Date Published: " + selectedBook.published, detailsX, startY + 100);
    
  //thought it would be fun to display the goodreads rating as actual stars!
    text("Rating: ", detailsX, startY + 125);
    drawStars(detailsX + 60, startY + 125, selectedBook.rating);

    textAlign(CENTER);
    textSize(10);
    fill(100);
    text("Click anywhere to close", width / 2, height / 2 + 135);
  }
}

function drawStars(x, y, rating) {
  textSize(16);
  //fallback if the rating is unreadable, but HOPEFULLY shouldn't be necessary
  if (isNaN(rating)) {
    fill(100);
    textSize(12);
    text("No rating available", x, y);
    return;
  }

  for (let i = 1; i <= 5; i++) {
    let starX = x + (i - 1) * 20;

    if (rating >= i) {
      // tryin to get it to display half stars aswell as full
      fill("#FFD700"); // Gold
      text("★", starX, y);
    } else if (rating >= i - 0.5) {
      fill("#FFD700"); // Gold
      text("⯨", starX, y); 
    } else {
      fill(200); // Gray
      text("☆", starX, y);
    }
  }
}
function applyFilter() {
  let g = dropdownGenre.value();
  let e = dropdownEthnicity.value();
  for (let b of books) {
    b.visible = (g === 'All Genres' || b.genre === g) && (e === 'All Ethnicities' || b.ethnicity === e);
  }
  restackBooks();
}

//two drop downs to filter by ethnicity and by genre
function setupDropdowns() {
  dropdownGenre = createSelect();
  dropdownGenre.position(30, 50); 
  dropdownGenre.option('All Genres');
  ['Mystery', 'Thriller', 'Historical', 'Memoir', 'Dystopia', 'Sci-fi', 'Self Help', 'Educational', 'Romance', 'Fantasy', 'Other', 'Childrens', 'Coming-of-Age', 'Lit-Fic'].forEach(o => dropdownGenre.option(o));
  dropdownGenre.changed(applyFilter);
  styleDropdown(dropdownGenre);

  dropdownEthnicity = createSelect();
  dropdownEthnicity.position(200, 50); 
  dropdownEthnicity.option('All Ethnicities');
  ['Western/Northern European', 'White (North American)', 'Southeast Asian', 'Central Asian', 'White (Oceanic)', 'East Asian', 'Unknown', 'Western Asia', 'Mixed', 'South Asian'].forEach(o => dropdownEthnicity.option(o));
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
    let xPos = b.x;
    if (b.visible && mouseX > xPos && mouseX < xPos + b.w && mouseY > b.y && mouseY < b.y + b.h) {
      selectedBook = b;
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  restackBooks();
}