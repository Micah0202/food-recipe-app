import View from './View.js';
import icons from 'url:../../img/icons.svg'; //Parcel 2

//we will create a parent class so that the methods can be reused across all the clases
//paginationView is just inheriting the methods from the parent class View,such as  renderSpinner etc
class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _message = 'Recipe was successfully uploaded :) ';

  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  //selecting the button to add recipe
  _btnOpen = document.querySelector('.nav__btn--add-recipe');

  //selecting button to close form
  _btnClose = document.querySelector('.btn--close-modal');

  //constructor is called when the page is loaded
  constructor() {
    //since this a child class start vy calling supper, only then can we use super
    super();
    this._addHandlerShowWindow(); //protected
    this._addHandlerHideWindow();
  }
  toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }

  //listening for events of clicking on open button and close button
  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this)); //we bund it to the this keyword because in the event handlre the this was pointing to the element the event listeber is attached to , which we dont want
  }

  //TODO - form should be closed when we press the cross button or click outside the form
  _addHandlerHideWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }

  //listen for event on the upload button, takes the handler function
  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      //using form data,it takes a form
      const dataArr = [...new FormData(this)]; //here the form is the this keyword as we are inside the handler
      const data = Object.fromEntries(dataArr); //fromEntries takes an array of entries and converts it into an object
      handler(data); //this is the data that we will want to upload to the API,API calls happen in the model , this handler is the controlAddRecipe fn that is in tje controller
    });
  }
  //render will call the generateMarkup to render the particular markup
  _generateMarkup() {}
}

export default new AddRecipeView();
