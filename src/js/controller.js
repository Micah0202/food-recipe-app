import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
//todo - in parcel we can imprt more that just JS files.
//todo -A polyfill is a piece of code (usually JavaScript on the Web) used to provide modern functionality on older browsers that do not natively support it.
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

//TODO -polyfilling code below
import 'core-js/stable';
//polyfilling for aysnc await below
import 'regenerator-runtime/runtime';
//console.log(icons);
//selecting the parent element on whihc we insert the html
import { async } from 'regenerator-runtime';

//todo - coming from parcel , to make the state remain
// if(module.hot){
//   module.hot.accept();
// }

//fetch will return a promise and async fn will return thta promise, asyn fn runs in the background
const controlRecipes = async function () {
  try {
    //dynamically getting the ID from the url
    const id = window.location.hash.slice(1);

    //guard clause, if there is no id then return, guard clause helps to not create unnecessary nesting
    if (!id) return;
    recipeView.renderSpinner();

    //0) Update results view to mark selected result
    resultsView.update(model.getSearchResultsPage());

    //1) Updating bookmarks view
    bookmarksView.update(model.state.bookmarks);

    //todo 2)  - Loading recipe
    await model.loadRecipe(id); //an async fn thta returns  a promise so handle it using await, recipe is loaded here and then stored in the state object

    //2) Rendering recipe, using template literals to change the html and then insert this html on the parent element using insertAdjacentHTML
    //render ,ethod will store this data in the
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};

//TODO -  function that is responsible for rendering the search results
const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    //1) get search query
    const query = searchView.getQuery();
    if (!query) return;
    //no need to store the await in a variable as loadSearchResults only manipulates the state and does not return anything

    //2) Load search results
    await model.loadSearchResults(query);

    //3)Render results
    //console.log(model.state.search.results);
    //resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage(1));

    //4) Render inital pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

//this controller fn will be executed when a click happens on the next page or prev page button
const controlPagination = function (goToPage) {
  //1)Render NEW results based on whichever button we press- prev or next
  //console.log(model.state.search.results);
  //resultsView.render(model.state.search.results);
  resultsView.render(model.getSearchResultsPage(goToPage)); //this goToPage go to model ka getSearchResultsPage  fn where it becomes equal to state.search.page
  //4) Render NEW pagination buttons
  paginationView.render(model.state.search);
};

//another handlker fn that runs when an event happens , it happens when the user presses the + or - button to increase or decrease the servings , IT WILL ALSO adjust the ingredients accordingly
const controlServings = function (newServings) {
  //Update the recipe serivngs(in state), model will manipulate the data
  model.updateServings(newServings);

  //todo -Update the recipe view , we will render the new recipe view again
  //recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

//controller that will be passed as a handler into addHandlerAddBookmark, this controlAddBookmark will be executed whenever we click on the bookmark button
const controlAddBookmark = function () {
  //todo -  only add a  bookmark when the recipe is not alreayd bookmarked
  //1) Add /remove a bookmark
  //if false
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe); //bookmark model.state.recipe
  } else {
    model.deleteBookmark(model.state.recipe.id);
  }

  //2) Update recipe view
  recipeView.update(model.state.recipe); //will fill bookmark button

  //3) Render bookmatks
  bookmarksView.render(model.state.bookmarks);
};

//todo - fn will receive the new recipe data
const controlAddRecipe = async function (newRecipe) {
  try {
    //Show loading recipe
    addRecipeView.renderSpinner();

    //Upload the new recipe data
    //awaitb the promise
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    //Render recipe
    recipeView.render(model.state.recipe);

    //Success message
    addRecipeView.renderMessage();

    //Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    //Change ID in URL , use history APi, allows us to change the url without refreshing the page
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    //Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('🤮💩', err);
    addRecipeView.renderError(err.message);
  }
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

//TODO -CALLING ALL THE CONTROLLERS BELOW
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults); //pass the controller fn inside
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
//event listeners for when the hash in the URL changes , the name of the event
// window.addEventListener('hashchange', controlRecipes);
//event will be fired when the page has completed loading
// window.addEventListener('load', controlRecipes);
