import View from './View.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg'; //Parcel 2

class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  //error messge , the view knows that it has to display .
  //display the error message when there are no search results for a term or invalid url (hash)
  _errorMessage = 'No bookmarks yet .Find a nice recipe and bookmark it 😥😢';

  _message = '';

  //creating new handler
  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }
  //every view has their oown generateMarkup method
  _generateMarkup() {
    //console.log(this._data); //this._data is an array of objects so we have to loop over the array and then dispaly/render each object to UI
    
    return this._data.map(bookmark => previewView.render(bookmark, false )).join('');
  }
}

export default new BookmarksView();
