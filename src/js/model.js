import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE, KEY } from './config.js';
// import { getJSON, sendJSON } from './helpers.js';
import { AJAX } from './helpers.js';
//where we will write our entire model ie the business logic
//export it so that we can use it in controller
//todo - state should contain all the data about the application
export const state = {
  recipe: {},
  search: {
    query: '',
    results: [], //results array
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [], ///adding a bookmark means pushing the recipe into the bookmarks array
};

const createRecipeObject = function (data) {
  //using destructuring to get the recipe from data.data
  const { recipe } = data.data;
  //recipe object wiht all its properties
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }), //of recipe.key is  a falsy value then nothing happens , but if truue then we can spread the object (only if the key exists )
  };
};

//responsible for fetching data from foodbook API
//contrller will get the id
export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
    state.recipe = createRecipeObject(data);
    //using the some method we can see if there is the current recipe is already in the bookmarks array,search for element in array and return true if any of them satisfy condition
    if (state.bookmarks.some(bookmark => bookmark.id === id)) {
      state.recipe.bookmarked = true; //then bookmark it
    } else {
      state.recipe.bookmarked = false; //so now all the recipes will be either true or false
    }

    console.log(state.recipe);
  } catch (err) {
    console.error(`${err} 💩💩`);
    throw err;
  }
};

//TODO =implementing the search fucntionality , we will xport this function so that it can be used by the controller , will perform AJAX calls so its an async fn , controller will tell the fn what it needs to search for
export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    //use the getJSON that we already made, whihc will fetch the dta and convert to JSON , it returns a promise
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    console.log(data);

    //map will return a new array with the new objects
    //if we type pizza in search bar then state.search.results is an array of objects where every object has the id ,title, image etc
    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
    //when we load a new search then the page number will reset to 1 because of below line
    state.search.page = 1;
  } catch (err) {
    console.error(`${err} !!!`);
    throw err;
  }
};

//function that will take in an  argument and onlty render a certain number of search results on the page , get the data for the page that is being passed in

//wont be async fn as the page is alredy loaded at this point
export const getSearchResultsPage = function (page = state.search.page) {
  //store on whihc pg we are
  state.search.page = page;

  //we will return only parts of the result  array, we want 10 results on each page so use slicce for that
  const start = (page - 1) * state.search.resultsPerPage; //for eg fpr 2nd page it will be (2-1)*10 ie from 11 to 20 you display for 2nd page
  const end = page * state.search.resultsPerPage;

  return state.search.results.slice(start, end);
};

//thif fn will reach into the state specifically the recipe ingredients and then change the quanitiyy in each ingredient
export const updateServings = function (newServings) {
  //ingredients is an array of objects where each object has the properties of quantity, unit , description
  //each ingredients is an object which contains the quantity, we have to mutate the quantity property
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
    //newQt = oldQt * newServings/oldServings // eg 2*8/4 =4
  });

  //we also need to update the servings in state
  state.recipe.servings = newServings;
};

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

//TODO - bookmarks feature code
//will recieve a recipe and set the recipe as a bookmark
export const addBookmark = function (recipe) {
  //Add bookmarks
  state.bookmarks.push(recipe);

  //Mark current recipe as bookmarked
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true; //setting a new property bookmarked on the recipe object

  persistBookmarks();
};

//TODO -FUCNTION TO REMOVE BOOKMARK , delete the recipe with the input id paramter from bookmarks array
export const deleteBookmark = function (id) {
  const index = state.bookmarks.findIndex(el => el.id === id); //find the bookmark where current bookmark ka id is equal to input id, findIndex will return index if found
  state.bookmarks.splice(index, 1); //deleteing only 1 item

  //Mark the current recipe as not a bookmark anymore
  if (id === state.recipe.id) state.recipe.bookmarked = false;
  persistBookmarks();
};

//TODO -  code for taking out the bookmarks from local storage and putting back into the bookmarks tab when we relaoad the page , inside the local storage it is in the string form so use JSON.parse to convert the string back to an object

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage); //JSON.parse sconverts the string back into an object
};

init();

//todo =method only for me when i am developing in order to delete bookmarks
const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
// clearBookmarks();

//function to upload recipe to API
export const uploadRecipe = async function (newRecipe) {
  //first step is to take the raw input data and transfor into same format as the data we get out of the API .
  //so take the data out of the 6 ingredients and put it into an object
  //we want to create an array of ingredients so use map
  //use filter to get  only those entries whose forst element is  ingredient and the second element should exist ie not be an empty string
  //map to take the data out of the string and put it into an object
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim()); //to add space in the recipe ingredients when we have many words
        //const ingArr = ing[1].replaceAll(' ', '').split(',');
        if (ingArr.length !== 3) throw new Error('Wrong ingredient format! Please use the correct format :)  ');

        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description }; //the above statements will give us quanitity, unit and description all inside one array
      });
    //todo =create the object that is ready to be uploaded , the data format has to be the same as the Api sent, we have to send the data back to the API in the same format
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    //USING sendJSON to create AJAX request
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe); //sendJSON has 2 paramters -  the URL and the data
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
