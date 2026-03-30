let books = [];
let selectedBook = null;
let dropdown; 

let colours = {
  bg: "#05054F",
  spine1: "#FFEBA4",
  spine2: "#FFE1EC",
  text: "#ff9ecf",
  button: "#E0EFFF"
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont("Times New Roman");

  for (let i = 0; i < 20; i++) {
    books.push({
      w: 200,
      h: 25,
      y: height, 
      targetY: height,
      genre: i % 3 === 0 ? "Romance" : (i % 3 === 1 ? "Fantasy" : "Thriller"),
      author: i % 2 === 0 ? "Author A" : "Author B",
      title: "Bestseller " + (i + 1),
      visible: true
    });
  }

  //had to search up how to do this - i dont fully understand yet but i will 
  dropdown = createSelect();
  dropdown.position(30, 40);
  dropdown.size(160, 40);

  dropdown.option('Show All');
  dropdown.option('Romance');
  dropdown.option('Fantasy');
  dropdown.option('Thriller');

  dropdown.style('background-color', '#ff9ecf'); // Pink background
  dropdown.style('color', '#05054F');            // Dark blue text
  dropdown.style('border-radius', '15px');       // Rounded corners
  dropdown.style('padding-left', '10px');        // Space for text
  dropdown.style('font-family', 'Times New Roman');
  dropdown.style('font-size', '14px');
  dropdown.style('font-weight', 'bold');
  dropdown.style('appearance', 'none');          // Removes the default arrow in some browsers
  dropdown.style('cursor', 'pointer');

  dropdown.changed(applyFilter);

  restackBooks();
}

function draw() {
  background(colours.bg);
  drawTitle();
  drawBooks();
  drawPopup();
}

function drawTitle(){
  fill(colours.text);
  noStroke();
  textAlign(CENTER);
  textSize(24);
  text("bestseller book stack", width / 2, 80);
}

function drawBooks(){
  let visibleIndex = 0;

  for (let b of books){
    // Update animation for ALL books so they can fall off screen
    b.y = lerp(b.y, b.targetY, 0.1); // so that they slide instead of snapping into place 

    if(b.visible){
      if (b.y < height + 50){
        fill(visibleIndex % 2 === 0 ? colours.spine1 : colours.spine2);
        noStroke();
        let xPos = width / 2 - b.w / 2;
        rect(xPos, b.y, b.w, b.h, 5);

        stroke(colours.text);
        strokeWeight(0.5);
        line(xPos + 10, b.y + 3, xPos + 10, b.y + b.h - 3);

        if(mouseX > xPos && mouseX < xPos + b.w && mouseY > b.y && mouseY < b.y + b.h){
          fill('#ffffff44');
          noStroke();
          rect(xPos, b.y, b.w, b.h, 5);
        }
        visibleIndex++;
      }
    } 
  } // <--- This closes the 'for' loop correctly
}

function applyFilter() {
  let selected = dropdown.value();
  for (let b of books) {
    if (selected === 'Show All') {
      b.visible = true;
    } else {
      b.visible = (b.genre === selected);
    }
  }
  restackBooks();
}

function restackBooks() {
  let visibleCount = 0;
  for (let b of books) {
    if (b.visible) {
      b.targetY = (height - 100) - (visibleCount * (b.h + 5));
      visibleCount++;
    } else {
      b.targetY = height + 200; // The destination for falling books
    }
  }
}

function drawPopup() {
  if (selectedBook) {
    fill(0, 0, 0, 150);
    rect(0, 0, width, height);

    fill(255);
    stroke(colours.text);
    strokeWeight(2);
    rect(width / 2 - 150, height / 2 - 100, 300, 200, 15);

    noStroke();
    fill(colours.bg);
    textAlign(CENTER);
    textSize(18);
    text(selectedBook.title, width / 2, height / 2 - 50);
    
    textAlign(LEFT);
    textSize(14);
    text("Author: " + selectedBook.author, width / 2 - 120, height / 2 - 10);
    text("Genre: " + selectedBook.genre, width / 2 - 120, height / 2 + 20);
    text("Ethnicity: [Data Point]", width / 2 - 120, height / 2 + 50);

    textAlign(CENTER);
    textSize(10);
    text("Click anywhere to close", width / 2, height / 2 + 80);
  }
}

function mousePressed(){
  if (selectedBook) {
    selectedBook = null;
    return; 
  }

  for (let b of books) {
    let xPos = width / 2 - b.w / 2;
    if (b.visible && mouseX > xPos && mouseX < xPos + b.w && mouseY > b.y && mouseY < b.y + b.h) {
      selectedBook = b;
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  restackBooks(); 
}