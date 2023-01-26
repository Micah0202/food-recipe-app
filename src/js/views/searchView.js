//the view that respresents the search bar
//creating classes for views instead of functions as we want diff views  to inherit from parent class  .

class SearchView {
  _parentEl = document.querySelector('.search');

  getQuery() {
    const query = this._parentEl.querySelector('.search__field').value;
    this._clearInput();
    return query;
  }

  _clearInput() {
    this._parentEl.querySelector('.search__field').value = '';
  }

  //addHandlerSearch() is the publisher and
  addHandlerSearch(handler) {
    this._parentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }
}
//export an instance of the class ie an object
export default new SearchView();
