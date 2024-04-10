import data from "./data.json" with { type: "json" };
const starSvg =  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="#FFD43B" d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/></svg>'
const heartSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path fill="#ff0000" d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"/></svg>'
const deleteSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path fill="#ff5757" d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>'


var filteredData = data;

let filterCriteria = {
  deletedTitles : [],
  pinnedTitles: [],
  maxYear: null,
  minYear: null,
  minEpisode: null,
  maxEpisode: null,
  categories: [],
  rating: null,

};


function filterData() {
  filteredData = data.filter(item => {
    if (filterCriteria.deletedTitles.includes(item.title)) return false;

    if (filterCriteria.pinnedTitles.includes(item.title)) return true;

    const startYearMatches = filterCriteria.minYear ? item.start_year >= filterCriteria.minYear : true;
    
    let endYearMatches = true; 
    if (filterCriteria.maxYear) {
      if (item.end_year !== "Present") {
        endYearMatches = item.end_year <= filterCriteria.maxYear;
      } else {
        endYearMatches = item.start_year <= filterCriteria.maxYear;
      }
    }

    const minEpisodeMatches = filterCriteria.minEpisode ? item.episodes >= filterCriteria.minEpisode : true;
    const maxEpisodeMatches = filterCriteria.maxEpisode ? item.episodes <= filterCriteria.maxEpisode : true;

    const categoryMatches = filterCriteria.categories ? filterCriteria.categories.every(cat => item.categories.includes(cat)) : true;

    const ageRatingMatches = filterCriteria.rating ? item.age_rating == filterCriteria.rating : true;

    return startYearMatches && endYearMatches && minEpisodeMatches && maxEpisodeMatches && categoryMatches && ageRatingMatches;
  });



  const cardContainer = document.getElementById('card-container');
  cardContainer.innerHTML = '';

  initializeResultCounter()

  filteredData.forEach(item => {
    
    createShowCard(item);
  });
}


function createShowCard(item) {

  // Generates a card for a given item and appends it to the display. 
  // This includes handling for pinning and deleting items, as well as displaying 
  // the item's details like title, image, year, rating, episodes, and categories.

  const cardContainer = document.getElementById('card-container');
  const pined = filterCriteria.pinnedTitles.includes(item.title)

  const card = document.createElement('div');
  card.classList.add('card');
  cardContainer.appendChild(card);

  const header = document.createElement('div')
  header.classList.add("header")

  card.appendChild(header)


  const ButtonCont = document.createElement('div')
  if (pined){
    ButtonCont.textContent = "UNPIN"
    ButtonCont.addEventListener("click", function(){
      const pinedTitle = this.getAttribute("data-pin-name")
      filterCriteria.pinnedTitles.pop(pinedTitle)
      filterData()
  
    })
    card.classList.add("pin")
  }
  else {
  ButtonCont.textContent = "PIN"
  ButtonCont.addEventListener("click", function(){
    const pinedTitle = this.getAttribute("data-pin-name")
    filterCriteria.pinnedTitles.push(pinedTitle)
    filterData()
  })

}
  
  ButtonCont.classList.add("buttonCont")


  const favoriteButton = document.createElement("div")
  favoriteButton.classList.add("favoriteButton")
  favoriteButton.innerHTML = heartSvg

  ButtonCont.appendChild(favoriteButton)
  ButtonCont.setAttribute("data-pin-name",item.title)


  header.appendChild(ButtonCont)


  const anotherButtonCont = document.createElement('div')

  
  anotherButtonCont.classList.add("buttonCont")
  anotherButtonCont.setAttribute("data-delete-name",item.title)


  anotherButtonCont.addEventListener('click', function() {
    const deleteTitle = this.getAttribute('data-delete-name');
    filterCriteria.deletedTitles.push(deleteTitle)

    filterData()
  
  });

  const deleteButton = document.createElement('div')
  deleteButton.classList.add("deleteButton")
  deleteButton.innerHTML = deleteSvg
  anotherButtonCont.textContent = "Delete"
  anotherButtonCont.appendChild(deleteButton)
  header.appendChild(anotherButtonCont)
  

  


  const content = document.createElement("div")

  content.classList.add("content")

  const img = document.createElement('img');
  img.setAttribute('src', item.image_link);
  img.setAttribute('alt', item.title);
  content.appendChild(img);

  const textContentDiv = document.createElement('div')

  textContentDiv.classList.add('textContent')

  content.appendChild(textContentDiv)

  const titleDiv = document.createElement('div');
  titleDiv.classList.add('title');
  titleDiv.textContent = item.title;
  textContentDiv.appendChild(titleDiv);

  const innerTextContentCont = document.createElement('div')
  innerTextContentCont.classList.add("innerTextContentCont")

  textContentDiv.appendChild(innerTextContentCont);


  const miniTextContent = document.createElement('div')

  miniTextContent.classList.add("miniTextContent")

  innerTextContentCont.appendChild(miniTextContent);


  
  const yearDiv = document.createElement('div');
  yearDiv.classList.add('year');

  yearDiv.textContent = item.start_year + " - " + item.end_year;
  miniTextContent.appendChild(yearDiv);

  const ratingDiv = document.createElement('div');
  ratingDiv.classList.add('rating');
  const starDiv = document.createElement('div');
  starDiv.classList.add('star');
  starDiv.innerHTML = starSvg
  ratingDiv.appendChild(starDiv);
  const ratingP = document.createElement('p');
  ratingP.textContent = item.imdb_rating;
  ratingDiv.appendChild(ratingP);
  miniTextContent.appendChild(ratingDiv);


  const anotherMiniTextContent = document.createElement('div')

  anotherMiniTextContent.classList.add("miniTextContent")
  
  const episodeDiv = document.createElement('div')
  episodeDiv.classList.add("episodes")
  episodeDiv.textContent = item.episodes + " Episodes"
  const ageRatingDiv = document.createElement("div")
  ageRatingDiv.textContent = item.age_rating
  ageRatingDiv.classList.add("ageRating")

  anotherMiniTextContent.appendChild(episodeDiv)
  anotherMiniTextContent.appendChild(ageRatingDiv)


  innerTextContentCont.appendChild(anotherMiniTextContent)


  







  

  const categoryDiv = document.createElement('div');
  categoryDiv.classList.add('categorys');
  item.categories.forEach(category => {
      const p = document.createElement('p');
      p.textContent = category;
      categoryDiv.appendChild(p);
  });
  textContentDiv.appendChild(categoryDiv);

  card.appendChild(content)


  return cardContainer;
}


function initializeResultCounter(){

  // Initializes The Result Counters
  const results = document.getElementById('results')
  results.textContent = filteredData.length + " Results"


}


function initializeRangeSelector(minValue, maxValue, startSliderId, endSliderId, startDisplayId, endDisplayId) {

  // Sets up range sliders for filtering by year or episode count. 
  // It ensures that the start slider cannot exceed the end slider's value and updates display elements to show the current slider values.
  const startSlider = document.getElementById(startSliderId);
  const endSlider = document.getElementById(endSliderId);
  const startDisplay = document.getElementById(startDisplayId);
  const endDisplay = document.getElementById(endDisplayId);


  startSlider.setAttribute("min", minValue);
  endSlider.setAttribute("min", minValue);
  startSlider.setAttribute("max", maxValue);
  endSlider.setAttribute("max", maxValue);
  startSlider.setAttribute("value", minValue);
  endSlider.setAttribute("value", maxValue);

  function updateDisplays() {
    startDisplay.textContent = startSlider.value;
    endDisplay.textContent = endSlider.value;
  }

  startSlider.oninput = function () {
    const startValue = parseInt(startSlider.value); 
    const endValue = parseInt(endSlider.value); 
    if (startValue >= endValue) {
      startSlider.value = Math.max(minValue, endValue - 1); 
    }
    updateDisplays();
  };

  endSlider.oninput = function () {
    const startValue = parseInt(startSlider.value); 
    const endValue = parseInt(endSlider.value); 
    if (endValue <= startValue) {
      endSlider.value = Math.min(maxValue, startValue + 1); 
  };
  updateDisplays(); 

  


 
}

updateDisplays(); 
}

function initializeDynamicZIndexForSliders(startSliderId, endSliderId) {
  // This Fucntions Solves The Problem Of Sliders OverLapping One Another
  const startSlider = document.getElementById(startSliderId);
  const endSlider = document.getElementById(endSliderId);

  startSlider.style.zIndex = '1';
  endSlider.style.zIndex = '0';


  function toggleZIndex() {
    if (startSlider.style.zIndex === '1') {
      startSlider.style.zIndex = '0';
      endSlider.style.zIndex = '1';
    } else {
      startSlider.style.zIndex = '1';
      endSlider.style.zIndex = '0';
    }
  }

 

  startSlider.addEventListener('input', toggleZIndex);
  startSlider.addEventListener('mouseover', toggleZIndex);
  endSlider.addEventListener('input', toggleZIndex);
  endSlider.addEventListener('mouseover', toggleZIndex);
}
function initializeSliders(){

  //Find The Min Max Episodes and Years To Be Set On The Range Of Sliders
  var minEpisode = Infinity;
  var maxEpisode = -Infinity;
  var minYear = Infinity; 
  var maxYear = -Infinity; 

  filteredData.forEach((item) => {
    var episodes = parseInt(item.episodes, 10); 
    var startYear = item.start_year ? parseInt(item.start_year, 10) : undefined; 
    var endYear = item.end_year ? parseInt(item.end_year, 10) : undefined;
  
    if (episodes > maxEpisode) {
      maxEpisode = episodes;
    }
    if (episodes < minEpisode) {
      minEpisode = episodes;
    }
    if (startYear && startYear < minYear) {
      minYear = startYear;
    }
    if (endYear && endYear > maxYear) {
      maxYear = endYear;
    }
  });
  

  initializeRangeSelector(minEpisode, maxEpisode, "startEpisodeSlider", "endEpisodeSlider", "startEpisode", "endEpisode");
  initializeRangeSelector(minYear, maxYear, "startYearSlider", "endYearSlider", "startYear", "endYear");
  initializeDynamicZIndexForSliders('startEpisodeSlider', 'endEpisodeSlider');
  initializeDynamicZIndexForSliders('startYearSlider','endYearSlider')


  // Add EventListiners
  const minEpisodeSlider = document.getElementById('startEpisodeSlider');

  const maxEpisodeSlider = document.getElementById('endEpisodeSlider');

  const minYearSlider = document.getElementById('startYearSlider')

  const maxYearSlider = document.getElementById('endYearSlider')

  minEpisodeSlider.addEventListener('input', () =>{
  filterCriteria.minEpisode = parseInt(minEpisodeSlider.value, 10);

  filterData();

  })

  maxEpisodeSlider.addEventListener('input', () =>{
  filterCriteria.maxEpisode = parseInt(maxEpisodeSlider.value, 10);
  filterData();

  })

  minYearSlider.addEventListener('input',()=>{
  filterCriteria.minYear = parseInt(minYearSlider.value,10)
  filterData()
  })

  maxYearSlider.addEventListener('input',()=>{
  filterCriteria.maxYear = parseInt(maxYearSlider.value,10)
  filterData()

  })




  

}

function initializeCategroies(){

  //Set up filters based on categories and age ratings found in the dataset, allowing users to filter the displayed items by these criteria.

  const container = document.getElementById("filterByCategory")

  container.innerHTML = ""

  let categories = new Set();

  data.map((item) => {
  item.categories.forEach(category => {
    if (!categories.has(category)) { 
      categories.add(category);
      const buttonDiv = document.createElement("div")
      buttonDiv.classList.add("button")
      buttonDiv.textContent = category
      container.appendChild(buttonDiv)

      buttonDiv.addEventListener('click', () => {
        const category = buttonDiv.textContent;
        if (filterCriteria.categories.includes(category)) {
          filterCriteria.categories = filterCriteria.categories.filter(cat => cat !== category);
          buttonDiv.classList.remove("activebutton");
        } else {
          filterCriteria.categories.push(category);
          buttonDiv.classList.add("activebutton");
        }
    
        filterData(); 
        
      })
    }
  });




});

  }



function initializeRatings(){

  const clearRatingButtons = () => {
    const ratingButtons = document.querySelectorAll("#filterByRating .button");
  
    ratingButtons.forEach((button) => {
      button.classList.remove("activebutton")
    })
  }
      const container = document.getElementById("filterByRating")
  
    container.innerHTML = ""
  
    let rating = new Set();
    data.map((item) => {
    if (!rating.has(item.age_rating)) { 
        rating.add(item.age_rating);
        const buttonDiv = document.createElement("div")
        buttonDiv.classList.add("button")
        buttonDiv.textContent = item.age_rating
        container.appendChild(buttonDiv)
        buttonDiv.addEventListener('click',()=>{
          if (filterCriteria.rating == buttonDiv.textContent){
            filterCriteria.rating = null
            buttonDiv.classList.remove("activebutton");
          }
          else{
            filterCriteria.rating = buttonDiv.textContent
            clearRatingButtons()
            buttonDiv.classList.add("activebutton")
          }
           filterData()
          
        })
        
      }
      }
    );
  }
  

function initializeFilterButtons(){

  const filterBox = document.getElementById("filterContainer")
  const buttons = document.querySelectorAll('.options .button');
  const filters = document.querySelectorAll('.filter');
  const filterTitle = document.getElementById("filterTitle")
  
  buttons.forEach(button => {
    button.addEventListener('click', function() {
      const filterId = this.getAttribute('data-filter');
      const selectedFilter = document.getElementById(filterId);
      if (selectedFilter) {
        filterTitle.textContent =  this.textContent
        filters.forEach((filter) => filter.classList.add('hide'))
        filterBox.classList.remove("hide")
        selectedFilter.classList.remove("hide")
      }
    });
  });

  document.addEventListener('click', function(event) {
    const isClickInsideFilterBox = filterBox.contains(event.target);
    let isClickOnButton = false;
    buttons.forEach(button => {
      if (button.contains(event.target)) {
          isClickOnButton = true;
      }
  });
    if (!isClickInsideFilterBox && !isClickOnButton) {
      filterBox.classList.add("hide");
      filters.forEach((filter) => filter.classList.add('hide'));
    }
  });


}


document.addEventListener('DOMContentLoaded', function() {


initializeFilterButtons()
initializeSliders()
initializeCategroies()
initializeRatings()
initializeResultCounter()
data.forEach(item => {
    createShowCard(item);
});

const resetButton = document.getElementById('RESET')

resetButton.addEventListener('click' ,()=>{
  location.reload();
  
})





  




})
