import { async } from 'regenerator-runtime'; //piy by parcel by default , this line of code
import { TIMEOUT_SEC } from './config.js';
//TODO - contains all functions thay we will reuse throughout the projrct
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

//TODO -function called AJAX that will club the fucntionalities of sendJSON and getJSON .
export const AJAX = async function (url, uploadData = undefined) {
  try {
    //consditionallly defining the fetchPro variable
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          //headers give us info about the text itself
          headers: {
            'Content-Type': 'application/json',
          },
          //payload of the request ie the data we want to send , bodu should be in JSON
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    //res and timeout will race
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json(); //res.json() returns a proise

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data; //this data will be the resolved  value of the promise that getJSOn function returns
  } catch (err) {
    //rejected promise triggers the catch block
    //Temporary error handling
    throw err;
  }
};

/*
//it will do the fetching and then convert the prmoise into JSON , all in one step
export const getJSON = async function (url) {
  try {
    const fetchPro = fetch(url);
    //res and timeout will race
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json(); //res.json() returns a proise

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data; //this data will be the resolved  value of the promise that getJSOn function returns
  } catch (err) {
    //rejected promise triggers the catch block
    //Temporary error handling
    throw err;
  }
};

//method for sending JSON
export const sendJSON = async function (url, uploadData) {
  try {
    //pass an object of options as well
    const fetchPro = fetch(url, {
      method: 'POST',
      //headers give us info about the text itself
      headers: {
        'Content-Type': 'application/json',
      },
      //payload of the request ie the data we want to send , bodu should be in JSON
      body: JSON.stringify(uploadData),
    });
    //res and timeout will race so that it doen not run forver
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json(); //res.json() returns a proise

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data; //this data will be the resolved  value of the promise that getJSOn function returns
  } catch (err) {
    //rejected promise triggers the catch block
    //Temporary error handling
    throw err;
  }
};
*/
