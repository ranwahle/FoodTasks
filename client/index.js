import { getItems, setItem, whoBringsWhat } from "./food-service.js";
import { notify } from "./notiifcations.js";
import "./selectbox-component.js";
import "./who-brings-what.js";
import "./selection-form.js";
import routerConfig from  './routes.js';

const parametersDict = (searchString) => {
  const params = searchString.substr(1).split('&');
  const result = {};

  params.forEach(param => {
    const [key, value] = param.split('=');
    if (result[key]) {
      if (!Array.isArray(result[key])) {
        result[key] = [result[key]];
      }
      result[key].push(value);
    } else {
      result[key] = value;
    }
  });

  return result;
}


const getParameter = (paramName) => {


  const searchString = window.location.search;

  if (!searchString) {
    return null;
  }
  const paramsDict = parametersDict(searchString);
  return paramsDict[paramName];
};

document.addEventListener("DOMContentLoaded", async () => {

  const eventId = getParameter('eventId');

  const getWhoBringsWhat = async () => {
    const selectedItems = await whoBringsWhat(eventId);
//    document.querySelector("who-brings-what").items = selectedItems;
  };

  // document.querySelector("#seeWhoBringsWhat").addEventListener("click", () => {
  //   document.querySelector("who-brings-what").style.display = "block";
  //   document.querySelector("selection-form").style.display = "none";
  // });
  //
  // document.querySelector("#setSelectionForm").addEventListener("click", () => {
  //   document.querySelector("who-brings-what").style.display = "none";
  //   document.querySelector("selection-form").style.display = "block";
  // });
  getWhoBringsWhat();
  setInterval(getWhoBringsWhat, 100000);
});
