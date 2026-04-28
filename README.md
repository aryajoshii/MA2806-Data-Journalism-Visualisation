# MA2806-Data-Journalism-Visualisation

<img width="2393" height="1334" alt="image" src="https://github.com/user-attachments/assets/18d04d77-5053-4777-a05f-663ca7ead602" />

_Image of our visualisation_

## GitHub Pages Link 

https://aryajoshii.github.io/MA2806-Data-Journalism-Visualisation/

## Link to the Repository

https://github.com/aryajoshii/MA2806-Data-Journalism-Visualisation.git

## Summary of Our Project

_Be True To Your-Shelf_ is an interactive data visualisation that explores diversity within global bestseller lists. By looking at three different bestseller sources (_The Sunday Times_ - United Kingdom, _Whitcoulls_ - New Zealand and _Barnes & Noble_ - United States) we have created a 'library' of sorts where users can filter books by attributes such as **Genre** and **Author Ethnicity**. Our goal was to make this data visually engaging and interesting and to allow users to actually see the makeup of our literary landscape through an interactive experience. 

## Key Features

- **Interactive Book Stacks**: 150 books have been rendered as interactive objects that respond to user interaction, you are able to actually click the books and find out the data that we have collected about them. We have also assigned the actual images of the book spines (where possible) to the shapes so that they look like the titles users are familiar with.
- **Filtering**: Users can filter the system so that they are only shown certain genres or ethnicities to see the library re-stack in real time. When clicking on certain attributes you will notice that there are very few titles which fall into that category, which is key to our project.
- **Dataset Insights**: A dashboard in the top right provide users with deep-dives into specific regional data and our overall findings through various graphs, charts and a written summary that explains our conclusion.
- **Metadata**: When you click on a book, you are shown a pop up display that outlines the title, author's name, the book's rank on a bestseller list, date of published and a visual GoodReads star rating.
  
## Our Dataset

The data for this project has been collected through three bestseller lists. We manually recorded this data to include the following attributes in a Google Sheets spreadsheet: 
1. Title
2. Category (fiction/non-fiction)
3. Genre
4. Author
5. Website (which bestseller list it was on)
6. Rating (obtained from GoodReads)
7. Published date
8. Rank
9. Author ethnicity
10. Language of origin
    
In addition to this, 150 unique book spine images were mapped to the dataset for a realistic aesthetic,these images needed to be shrunk so that the project did not lag.

## File Structure

- /images - book spine assets 
- /icons - flags and data charts for the dashboard
- book.csv - the master dataset 
- sketch.js - main visualisation logic

## Development of Project

The main ideas and aesthetic choices behind our project were developed by all of us, after discussion and meetings in person to talk about how we wanted it to look. We made these choices together to ensure that everyone was happy with the choices that were being made. Our first steps in developing this project were reading theory about this industry and previous investigations into diversity in publishing and then collecting the data we needed to begin. 

## Challenges

- Converting our Google Sheets dataset into a functional CSV required cleaning, we ran into issues with ghost spaces in headers and numbers in the GoodReads rating column as they were not all whole numbers. Using parseFloat() logic made sure that the data was readable and this issue was rectified.
- Loading so many image assets was also difficult. There were issues with the file names and these were hard to identify when there were so many to work through. Some of the files were also too big and caused the program to crash. Our solution was to standardise all the file names to a hyphenated format and used a bulk resize tool to make all of our images the same, manageable size.
- Finding the images of the book spines was sometimes difficult, as not all of them were accessible online. To solve this, we gathered images of what we could and for those titles that were not accessible online we created replacements on Canva, which are just simple rectangles that say the book name.
  
## Our Group

* **Ellie Wall**: Copywriter & Dataset
* **Keely Ilton**: Management & Dataset
* **Arya Joshi**: Coder & Dataset
* **Design**: All Members
  
We communicated via a group chat on Instagram as this was most convenient and easily accessible for everyone and shared resources through our emails. We distributed the workload accordingly and were flexible with who was responsible for which elements so that if any section of the project needed extra support, we were able to offer it wherever possible.
Our decisions were all made collectively and we decided on these through discussion and hearing each other's opinions. As our group members were in different places during the development of this project (Arya commutes to university and therefore was not always on campus), we made sure that it was possible for the development to be done remotely to make the experience inclusive and convenient for everyone without hindering the progress of the project. 

## References 

**Dataset**

https://www.thetimes.com/culture/books/article/sunday-times-top-50-bestselling-books-2025-7tp7g5lpf?gaa_at=eafs&gaa_n=AWEtsqcEnuiEHqoyRSSDgVSvTRHG7AgrN13f9cmXZAq7X1wkKA2vpIkSO4lOQTDayvc%3D&gaa_ts=69bef89c&gaa_sig=MBx1VBmwz5ExZZlMPnmbhQUbUskJl_juoSAtYYjC7I7_ACB3Gg_OvxwQr9WCcAxoGlLc7tXHtdogxS7ENXYKTg%3D%3D
https://www.whitcoulls.co.nz/recommends/top-100?s=SEQUENCE
https://www.barnesandnoble.com/b/books/_/N-1fZ29Z8q8
https://www.goodreads.com/

**Theory and Technical References**

https://anthillsocial.github.io/example-student-projects/public/MA2806-DataVisualisation/MA2806-2023-%E2%80%94-SetJetting/index.html
https://doaj.org/article/bafe686f54fd438782d5f1b1724fd391
https://www.booksellers.org.uk/BookSellers/media/Booksellers/Rethinking_Diversity_in_Publishing-Full-Report.pdf
