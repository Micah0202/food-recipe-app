import View from './View.js';
import icons from 'url:../../img/icons.svg'; //Parcel 2

//we will create a parent class so that the methods can be reused across all the clases
//paginationView is just inheriting the methods from the parent class View,such as  renderSpinner etc
class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  //listen for the event in view  , event when we click next page /prev page bbutton
  addHandlerClick(handler) {
    //we will use event delegation as we dont want to listen to the 2 buttons separately ,so add eventListenr to common parent,u can use closest that searched up the DOM tree
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      const goToPage = +btn.dataset.goto; //using + to convert the string to number

      handler(goToPage);
    });
  }

  //render will call the generateMarkup to render the particular markup
  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(this._data.results.length / this._data.resultsPerPage);
    console.log(numPages);

    //different cases of pagination
    //Page 1 ,and there are other pages (that means he currPage < numof pages)

    if (curPage === 1 && numPages > 1) {
      //adding the data attribute to create a relation between our DOM and code so that we can go to the desired page
      return `
      <button data-goto="${curPage + 1}" class="btn--inline pagination__btn--next">
      <span>Page ${curPage + 1}</span>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
    </button>`;
    }
    //todo -the search property inside state will give us the relevant info regarding whihc page we are on , results array , results per page etc, we will need this data  decide whihc pagination buttons to display

    //Last page-means the current page is tje same as the number of pages
    if (curPage === numPages && numPages > 1) {
      return `
      <button data-goto="${curPage - 1}" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${curPage - 1}</span>
      </button> `;
    }

    //Other page- means the curr page is less than the number of pages
    if (curPage < numPages) {
      return `
        <button data-goto="${curPage - 1}" class="btn--inline pagination__btn--prev">
              <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
              </svg>
              <span>Page ${curPage - 1}</span>
        </button> 
        <button data-goto="${curPage + 1}" class="btn--inline pagination__btn--next">
      <span>Page ${curPage + 1}</span>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
       </button>
        `;
    }

    //todo -if none of the above scenarios are met means we are on the page 1 and that there are no other pages
    return ``;
  }
}

export default new PaginationView();
