import View from './View.js';
//for views we will have one module for eahc view
//we are making it a class as later we have a class called View from whihc recipeView will inherit certain methods etc
//.. means parent folder
// import icons from '../img/icons.svg'; // Parcel 1
import icons from 'url:../../img/icons.svg'; // Parcel 2

/* NOTE: The Fractional package has been reported to cause an error when deployed to a server. I suggest you to use Fracty instead. */
// import { Fraction } from 'fractional';
import fracty from 'fracty';

//todo - inherits from View
class RecipeView extends View {
  _parentElement = document.querySelector('.recipe');
  //error messge , the view knows that it has to display .
  //display the error message when there are no search results for a term or invalid url (hash)
  _errorMessage = 'We could not find that recipe. Please try another one!';
  _message = '';

  //todo -method for rendering the recipe right at the beginning
  //todo -we implement event handlers in MVC pattern using Publisher Subscriber pattern and here the addHandlerRender() method is the publisher. handler method is the subscriber
  //it needs to be public so that we can call it in the controler .
  //this fn is actually listening for events in the view
  addHandlerRender(handler) {
    ['hashchange', 'load'].forEach(ev => window.addEventListener(ev, handler));
  }

  //todo-  create a new eventListener in the recipeView as the buttons are alreayd here
  addHandlerUpdateServings(handler) {
    //we will do event delegation using the parent element so that we dont have to attach separate event listeners for increase and decrease servings buttons
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--update-servings');
      //if we click outside of any of these buttons closeset will return null so use a guard clause for that
      if (!btn) return;
      const { updateTo } = btn.dataset; //when there is a dash in data property that is converted to camel case while writing in JS
      if (+updateTo > 0) handler(+updateTo);
    });
  }

  addHandlerAddBookmark(handler) {
    this._parentElement.addEventListener('click', function (e) {
      //todo- it is impossible to add an event listener on the bookamrk button when the page loads as when it loads the button doesnt exist only , thats why we have to select the parent element  instead SO WE USE event delegation and listen for click on parent element
      const btn = e.target.closest('.btn--bookmark');
      if (!btn) return;
      //otherwise call handler
      handler();
    });
  }

  _generateMarkup() {
    return `
      <figure class="recipe__fig">
        <img src="${this._data.image}" alt="${this._data.title}" class="recipe__img" />
        <h1 class="recipe__title">
          <span>${this._data.title}</span>
        </h1>
      </figure>
      <div class="recipe__details">
        <div class="recipe__info">
          <svg class="recipe__info-icon">
            <use href="${icons}#icon-clock"></use>
          </svg>
          <span class="recipe__info-data recipe__info-data--minutes">${this._data.cookingTime}</span>
          <span class="recipe__info-text">minutes</span>
        </div>
        <div class="recipe__info">
          <svg class="recipe__info-icon">
            <use href="${icons}#icon-users"></use>
          </svg>
          <span class="recipe__info-data recipe__info-data--people">${this._data.servings}</span>
          <span class="recipe__info-text">servings</span>
          <div class="recipe__info-buttons">
            <button class="btn--tiny btn--update-servings" data-update-to="${this._data.servings - 1}">
              <svg>
                <use href="${icons}#icon-minus-circle"></use>
              </svg>
            </button>
            <button class="btn--tiny btn--update-servings" data-update-to="${this._data.servings + 1}">
              <svg>
                <use href="${icons}#icon-plus-circle"></use>
              </svg>
            </button>
          </div>
        </div>
        <div class="recipe__user-generated ${this._data.key ? '' : 'hidden'}">
          <svg>
            <use href="${icons}#icon-user"></use>
          </svg>
        </div>
        <button class="btn--round btn--bookmark">
          <svg class="">
            <use href="${icons}#icon-bookmark${this._data.bookmarked ? '-fill' : ''}"></use>
          </svg>
        </button>
      </div>
      <div class="recipe__ingredients">
        <h2 class="heading--2">Recipe ingredients</h2>
        <ul class="recipe__ingredient-list">
          ${this._data.ingredients.map(this._generateMarkupIngredient).join('')}
      </div>
      <div class="recipe__directions">
        <h2 class="heading--2">How to cook it</h2>
        <p class="recipe__directions-text">
          This recipe was carefully designed and tested by
          <span class="recipe__publisher">${this._data.publisher}</span>. Please check out
          directions at their website.
        </p>
        <a
          class="btn--small recipe__btn"
          href="${this._data.sourceUrl}"
          target="_blank"
        >
          <span>Directions</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
        </a>
      </div>
    `;
  }

  _generateMarkupIngredient(ing) {
    return `
    <li class="recipe__ingredient">
      <svg class="recipe__icon">
        <use href="${icons}#icon-check"></use>
      </svg>
      <div class="recipe__quantity">${ing.quantity ? fracty(ing.quantity).toString() : ''}</div>
      <div class="recipe__description">
        <span class="recipe__unit">${ing.unit}</span>
        ${ing.description}
      </div>
    </li>
  `;
  }
}

export default new RecipeView();
