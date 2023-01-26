import icons from 'url:../../img/icons.svg'; //Parcel 2

//parent class, we will not use any instance of this View ,just use it as a parent class for the child views
export default class View {
  _data;

  //TODO- the data we expect in render function is an Object or an array of Objects . 2nd parameteer here is optional .@returns describes what the function returns
  /**
   * Render the received object to the DOM
   * @param {Object | Object[a]} data The data to be rendered (e.g. recipe)
   * @param {boolean} [render=true] If false create markup string instead of rendering to the DOM
   * @returns {undefined | string} A markup string is returned if render=false
   * @this {Object} View instance
   * @author Micah Philip
   * @todo Finish  implementation
   */

  render(data, render = true) {
    //right in the beginning when the render method is first called  and recieves the data for the first time , we can 9immediately check if this data exists
    //guard clause - if there is no data then return immediately and render the error ,also check if the received data is an array and is empty
    if (!data || (Array.isArray(data) && data.length === 0)) return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();

    //if render is false then return the markup that was just generated
    if (!render) return markup;

    //TODO -before inserting any new markup remove the markup that is already there
    this._clear();
    //afterbegin means that the new HTML should be inserted as the first child of the element on which the method is called ie recipeContainer
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  //DOM updating algorithm
  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();

    //newDOM is like a virtual DOM that is living in the memory .
    const newDOM = document.createRange().createContextualFragment(newMarkup);

    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));
    //console.log(curElements);
    //console.log(newElements);

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      //console.log(curEl, newEl.isEqualNode(curEl));

      //Updates changed TEXT
      if (!newEl.isEqualNode(curEl) && newEl.firstChild?.nodeValue.trim() !== '') {
        curEl.textContent = newEl.textContent;
      }

      //Updates changed ATTRIBUTES
      if (!newEl.isEqualNode(curEl))
        Array.from(newEl.attributes).forEach(attr => curEl.setAttribute(attr.name, attr.value));
    });
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  //public mehod so that comntroller can call it when it fetches the data
  renderSpinner() {
    const markup = `
     <div class="spinner">
              <svg>
                <use href="${icons}#icon-loader"></use>
              </svg>
            </div>`;
    this._clear();
    //add this html as a child of the parent element
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `
      <div class="error">
              <div>
                <svg>
                  <use href="${icons}#icon-alert-triangle"></use>
                </svg>
              </div>
              <p>${message}</p>
        </div> `;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._message) {
    const markup = `
      <div class="message">
              <div>
                <svg>
                  <use href="${icons}#icon-smile"></use>
                </svg>
              </div>
              <p>${message}</p>
        </div> `;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
