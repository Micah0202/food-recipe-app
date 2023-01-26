import View from './View.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg'; //Parcel 2

//we will create a prent class so that the methods can be reused across all the clases
//ResultsView is just inheriting the methods from the parent class View,such as  renderSpinner etc
class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  //error messge , the view knows that it has to display .
  //display the error message when there are no search results for a term or invalid url (hash)
  _errorMessage = 'No recipes found for your query! Please try again 😥😢';

  _message = '';

  _generateMarkup() {
    //console.log(this._data); //this._data is an array of objects so we have to loop over the array and then dispaly/render each object to UI

    return this._data.map(result => previewView.render(result, false)).join('');
  }
}

export default new ResultsView();
