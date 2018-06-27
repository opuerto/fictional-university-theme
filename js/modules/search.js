import $ from "jquery";
class Search {
  //1. Describe and create/initiate our object
  constructor() {
    this.addSearchHTML();
    this.resultsDiv = $("#search-overlay__results");
    this.openButton = $(".js-search-trigger");
    this.closeButton = $(".search-overlay__close");
    this.searchOverlay = $(".search-overlay");
    this.searchField = $("#search-term");
    this.events();
    this.isOverlayOpen = false;
    this.typingTimer;
    this.previousValue;
    this.isSpinnerVisible = false;
  }

  //2. events
  events() {
    this.openButton.on("click", this.openOverlay.bind(this));
    this.closeButton.on("click", this.closeOverlay.bind(this));
    $(document).on("keydown", this.keyPressDispatcher.bind(this));
    this.searchField.on("keyup", this.typingLogic.bind(this));
  }

  //3 methods
  typingLogic() {
    if (this.searchField.val() != this.previousValue) {
      clearTimeout(this.typingTimer);

      if (this.searchField.val()) {
        if (!this.isSpinnerVisible) {
          this.resultsDiv.html('<div class="spinner-loader"></div>');
          this.isSpinnerVisible = true;
        }
        this.typingTimer = setTimeout(this.getResults.bind(this), 750);
      } else {
        this.resultsDiv.html("");
        this.isSpinnerVisible = false;
      }
    }

    this.previousValue = this.searchField.val();
  }

  getResults() {
    $.getJSON(
      universityData.root_url +
        "/wp-json/university/v1/search?term=" +
        this.searchField.val(),
      response => {
        this.resultsDiv.html(
          ` 
            <div class="row">
              <div class="one-third">
                <h2 class="search-overlay__section-title">General Information</h2>
                ${
                  response.generalInfo.length
                    ? '<ul class="link-list min-list">'
                    : "<p>No general Information matches that search</p>"
                }
                ${response.generalInfo
                  .map(
                    item =>
                      `<li><a href="${item.permalink}">${item.title}</a> ${
                        item.postType == "post" ? `by ${item.authorName}` : ""
                      }</li>`
                  )
                  .join("")}                    
                ${response.generalInfo.length ? "</ul>" : ""} 
              </div>
              <div class="one-third">
                <h2 class="search-overlay__section-title">Programs</h2>
                ${
                  response.programs.length
                    ? '<ul class="link-list min-list">'
                    : "<p>No programs matches that search</p>"
                }
                ${response.programs
                  .map(
                    item =>
                      `<li><a href="${item.permalink}">${item.title}</a></li>`
                  )
                  .join("")}                    
                ${response.programs.length ? "</ul>" : ""} 
                <h2 class="search-overlay__section-title">Professors</h2>
                ${
                  response.professors.length
                    ? '<ul class="professor-cards">'
                    : "<p>No professors matches that search</p>"
                }
                ${response.professors
                  .map(
                    item =>
                      `
                      <li class="professor-card__list-item">
                        <a class="professor-card" href="${item.permalink}">
                          <img class="professor-card__image" src="${
                            item.image
                          }" alt="">
                          <span class="professor-card__name">${
                            item.title
                          }</span>
                        </a>
                      </li>
                      `
                  )
                  .join("")}                    
                ${response.professors.length ? "</ul>" : ""} 

              </div>
              <div class="one-third">
                <h2 class="search-overlay__section-title">Campuses</h2>
                ${
                  response.campuses.length
                    ? '<ul class="link-list min-list">'
                    : "<p>No campus(es) matches that search</p>"
                }
                ${response.campuses
                  .map(
                    item =>
                      `<li><a href="${item.permalink}">${item.title}</a> ${
                        item.postType == "post" ? `by ${item.authorName}` : ""
                      }</li>`
                  )
                  .join("")}                    
                ${response.campuses.length ? "</ul>" : ""} 
                
                <h2 class="search-overlay__section-title">Events</h2>
                ${
                  response.events.length
                    ? ""
                    : "<p>No events matches that search</p>"
                }
                ${response.events
                  .map(
                    item =>
                      `
                      <div class="event-summary">
                      <a class="event-summary__date t-center" href="${item.permalink}">
                        <span class="event-summary__month">
                          ${item.month}
                        </span>
                        <span class="event-summary__day">${item.day}</span>
                      </a>
                      <div class="event-summary__content">
                        <h5 class="event-summary__title headline headline--tiny"><a href="${item.permalink}">${item.title}</a></h5>
                        <p>${item.description}<a href="${item.permalink}" class="nu gray">Learn more</a></p>
                      </div>
                    </div>
                      `
                  )
                  .join("")}                    
                
              </div>

            </div>
          `
        );
        this.isSpinnerVisible = false;
      }
    );

    //combined asyncronous calls
    /*$.when(
        $.getJSON(universityData.root_url +"/wp-json/wp/v2/posts?search=" + this.searchField.val()), 
        $.getJSON(universityData.root_url +"/wp-json/wp/v2/pages?search=" + this.searchField.val())
    ).then((posts, pages) => {
      var combinedResults = posts[0].concat(pages[0]);
      this.resultsDiv.html(`
        <h2 class="search-overlay__section-title">General Information</h2>
           ${
             combinedResults.length
               ? '<ul class="link-list min-list">'
               : "<p>No general Information matches that search</p>"
           }
           ${combinedResults
             .map(
               item =>
                 `<li><a href="${item.link}">${item.title.rendered}</a> ${item.type == 'post'? `by ${item.authorName}` : ''}</li>`
             )
             .join("")}                    
           ${combinedResults.length ? "</ul>" : ""} 
        `);
      this.isSpinnerVisible = false;
    }, () => {
        this.resultsDiv.html('<p>Unexpected error; please try again.</p>');
    });*/
  }

  openOverlay() {
    this.searchOverlay.addClass("search-overlay--active");
    $("body").addClass("body-no-scroll");
    this.searchField.val("");
    setTimeout(() => this.searchField.focus(), 301);
    this.isOverlayOpen = true;
    return false;
  }

  closeOverlay() {
    this.searchOverlay.removeClass("search-overlay--active");
    $("body").removeClass("body-no-scroll");
    this.isOverlayOpen = false;
  }

  keyPressDispatcher(e) {
    if (
      e.keyCode == 83 &&
      !this.isOverlayOpen &&
      !$("input, textarea").is(":focus")
    ) {
      this.openOverlay();
    }

    if (e.keyCode == 27 && this.isOverlayOpen) {
      this.closeOverlay();
    }
  }

  addSearchHTML() {
    $("body").append(`
        <div class="search-overlay">
        <div class="search-overlay__top">
              <div class="container">
                    <i class="fa fa-search search-overlay__icon" aria-hidden="true"></i>
                    <input type="text" class="search-term" placeholder="What are you looking for ? " id="search-term">
                    <i class="fa fa-window-close search-overlay__close" aria-hidden="true"></i>
              </div>      
        </div>
        <div class="container">
             <div id="search-overlay__results">
                  
             </div>       
        </div>
    </div>
        `);
  }
}

export default Search;
