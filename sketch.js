//global variables 
let books = [];
let selectedBook = null;
let dropdownGenre, dropdownEthnicity;
let bookTable;
let bookImages = {};
// array to store all of our book images because theres a lot
let logoImg;

let iconImages = [];
let dataImages = [];
let showDataPopup = -1;

//colour palette where colourrs are chosen from the design sheet we made (on google docs)
let colours = {
  bg: "#05054F",
  text: "#ff9ecf",
  popupBg: "#ffffff",
  spine1: "#FFEBA4",
  spine2: "#FFE1EC"
};

function preload() {
  logoImg = loadImage('logo.png');

  // Icons for the small buttons on top right of screen
  iconImages[0] = loadImage('icons/NZ-Flag.png');
  iconImages[1] = loadImage('icons/UK-Flag.png');
  iconImages[2] = loadImage('icons/US-Flag.png');
  iconImages[3] = loadImage('icons/bar-chart.png');
  iconImages[4] = loadImage('icons/summary-icon.png');

  //storing images of pie charts etc
  dataImages[0] = loadImage('icons/nz.png');
  dataImages[1] = loadImage('icons/uk.png');
  dataImages[2] = loadImage('icons/us.png');
  dataImages[3] = loadImage('icons/all.png');
  // 27.04.2026- need to add  written summary of findings
  // 27.04.2026- this has now been added ! 
  dataImages[4] = loadImage('icons/writing.png'); 

  bookTable = loadTable('book.csv', 'header', () => { //this is the actual data from google sheets
    for (let i = 0; i < bookTable.getRowCount(); i++) {
      let row = bookTable.getRow(i);
      let t = row.get("Title").trim();
      let fileName = row.get("ImageFile").trim(); //figured that adding a column to our google sheets with the images is just easier than trying to get the code to assign images to certain rectangles , too complex
      if (fileName && !bookImages[t]) { //making sure that the file names match up to the images
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
    
    let rawRating = row.get("Good reads rating "); //the gap after the column name is intentional!!! it is how its formatted in our spreadsheet
    let cleanRating = parseFloat(String(rawRating).replace(/[^0-9.]/g, '')); //had to search up how to do this

    books.push({
      w: 120, 
      h: 18, 
      y: height, 
      targetY: height, 
      x: width/2, 
      xOffset: random(-5, 5),
      genre: row.get("Genre"),
      author: row.get("Author "), //gap after author here is also intentional
      title: row.get("Title").trim(),
      ethnicity: row.get("Author Ethnicity"),
      rank: row.get("Rank"),
      published: row.get("Published"),
      rating: cleanRating, //trying to figure out how to get it to not just display a number for the rating 
      visible: true
    });
  }

  setupDropdowns();
  restackBooks();
}

function draw() {
  background(colours.bg);

  if (selectedBook !== null || showDataPopup !== -1) {
    dropdownGenre.hide();
    dropdownEthnicity.hide();
  } else {
    dropdownGenre.show();
    dropdownEthnicity.show();
  }
  
  if (logoImg) { //logo we designed
    imageMode(CENTER);
    image(logoImg, width / 2, 100, 400, 200); 
    imageMode(CORNER);
  }

  drawDataButtons();
  drawBooks();
  drawPopup();
  drawDataExhibition();
}

//things for the dashboard in the top right
function drawDataButtons() {
  let labels = ["NZ", "UK", "US", "All", "Summary"];
  let buttonCount = 5;
  let size = 55; 
  let padding = 30;
  let startX = width - (buttonCount * (size + padding)) - 20; 
  let y = 100;

  fill(colours.text);
  noStroke();
  textAlign(RIGHT);
  textSize(20);
  textStyle(ITALIC);
  text("Find out more about our data!", width - 150, y - 70); 
  textStyle(NORMAL);

// recognises when you hover over the buttons
  for (let i = 0; i < buttonCount; i++) {
    let x = startX + i * (size + padding);

    let d = dist(mouseX, mouseY, x, y);
    if (d < size / 2) {
      fill(colours.text);
      cursor(HAND);
    } else {
      fill(colours.spine1);
    }

    noStroke();
    circle(x, y, size);

    if (iconImages[i]) {
      imageMode(CENTER);
      image(iconImages[i], x, y, size * 0.7, size * 0.5);
      imageMode(CORNER);
    }

    fill(colours.text);
    textAlign(CENTER, TOP);
    textSize(11);
    textStyle(BOLD);
    text(labels[i], x, y + size / 2 + 5);
    textStyle(NORMAL);

  }
}

function drawDataExhibition() {
  if (showDataPopup !== -1) {
    fill(0, 230); 
    rect(0, 0, width, height);

    if (dataImages[showDataPopup]) {
      imageMode(CENTER);
      let img = dataImages[showDataPopup];
      let imgRatio = img.width / img.height;
      let h = height * 0.8;
      let w = h * imgRatio;
      
      //keeps it within the screen width 
      if (w > width * 0.9) {
        w = width * 0.9;
        h = w / imgRatio;
      }
      
      image(img, width / 2, height / 2, w, h);
      imageMode(CORNER);
    }

    fill(255);
    textAlign(CENTER);
    textSize(16);
    text("click anywhere to exit", width / 2, height - 50);
  }
}

//trying to make the animation smooth when you apply a filter
function restackBooks() {
  let visibleBooks = books.filter(b => b.visible);
  let booksPerStack = 18; //deciced to split the stack so that its not too visually overwhelming - v hard to focus on 150 books at once otherwise
  let numCols = Math.ceil(visibleBooks.length / booksPerStack);
  let spacing = 160;
  
  let totalWidth = (numCols - 1) * spacing;
  let startX = (width / 2) - (totalWidth / 2) - 60;

  let count = 0;
  for (let b of books) {
    if (b.visible) {
      let col = Math.floor(count / booksPerStack);
      let rowInStack = count % booksPerStack;

      b.x = startX + (col * spacing) + b.xOffset;
      b.targetY = (height - 150) - (rowInStack * (b.h + 3));
      count++;
    } else {
      b.targetY = height + 500;
    }
  }
}

function drawBooks() {
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
      
      //when you hover over a book it becomes slightly shaded
      if (mouseX > b.x && mouseX < b.x + b.w && mouseY > b.y && mouseY < b.y + b.h) {
        fill(255, 120);
        rect(b.x, b.y, b.w, b.h, 3);
        cursor(HAND);
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
    rect(width / 2, height / 2, 400, 350, 20); 
    rectMode(CORNER);

    //24.04.2026 some of the book titles were a bit too long for the pop-up and weren't staying within the boundaries of the rectangle
    //25.04.2026 this has now been fixed
    noStroke();
    fill(colours.bg);
    textAlign(CENTER, TOP);
    textSize(20);
    textStyle(BOLD);
    text(selectedBook.title, width / 2 - 180, height / 2 - 140, 360, 100);

    textStyle(NORMAL);
    textSize(15);
    textAlign(LEFT);
    let detailsX = width / 2 - 170;
    let startY = height / 2 - 30;

    //all the info that comes up when you click on a book 
    text("Author: " + selectedBook.author, detailsX, startY);
    text("Genre: " + selectedBook.genre, detailsX, startY + 25);
    text("Ethnicity: " + selectedBook.ethnicity, detailsX, startY + 50);
    text("Rank: " + selectedBook.rank, detailsX, startY + 75);
    text("Published: " + selectedBook.published, detailsX, startY + 100);
    
    //drawing stars to represent the goodreads rating!!
    text("Rating: ", detailsX, startY + 135);
    drawStars(detailsX + 65, startY + 135, selectedBook.rating);

    textAlign(CENTER);
    textSize(11);
    fill(100);
    text("Click anywhere to close", width / 2, height / 2 + 150);
  }
}

function drawStars(x, y, rating) {
  textSize(18);
  //this is the fallback in case it can't recognise some of the numbers for the dating, however we have cleaned the data so this HOPEFULLY should not be an issue
  // useful to have a fallback regardless
  if (isNaN(rating)) {
    fill(100);
    text("No rating", x, y);
    return;
  }

  //using ascii images, hopefully the half stars load otherwise there is a fallback 
  for (let i = 1; i <= 5; i++) {
    let starX = x + (i - 1) * 22;
    if (rating >= i) {
      fill("#FFD700");
      text("★", starX, y);
    } else if (rating >= i - 0.5) {
      fill("#FFD700");
      text("⯨", starX, y); 
    } else {
      fill(200);
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


//two different dropdowns to filter between genre and ethnicity
function setupDropdowns() {
  dropdownGenre = createSelect();
  dropdownGenre.position(30, 40);
  dropdownGenre.option('All Genres');
  ['Mystery', 'Thriller', 'Historical', 'Memoir', 'Dystopia', 'Sci-fi', 'Self Help', 'Educational', 'Romance', 'Fantasy', 'Other', 'Childrens', 'Coming-of-Age', 'Lit-Fic'].forEach(o => dropdownGenre.option(o));
  dropdownGenre.changed(applyFilter);
  styleDropdown(dropdownGenre);

  dropdownEthnicity = createSelect();
  dropdownEthnicity.position(200, 40); 
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
}

function mousePressed() {
  if (showDataPopup !== -1) {
    showDataPopup = -1;
    return;
  }
  if (selectedBook) {
    selectedBook = null;
    return;
  }

  // recognition for when the user clicks on one of the buttons

  let buttonCount = 5;
  let size = 55;
  let padding = 30;
  let startX = width - (buttonCount * (size + padding)) - 20;
  let y = 100;

  for (let i = 0; i < buttonCount; i++) {
    let x = startX + i * (size + padding);
    if (dist(mouseX, mouseY, x, y) < size / 2) {
      showDataPopup = i;
      return;
    }
  }

  for (let b of books) {
    if (b.visible && mouseX > b.x && mouseX < b.x + b.w && mouseY > b.y && mouseY < b.y + b.h) {
      selectedBook = b;
      return;
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  restackBooks();
}
