import { getItems, setItem, whoBringsWhat } from "./food-service.js";
import { notify } from "./notiifcations.js";
import "./selectbox-component.js";
import "./who-brings-what.js";
import "./selection-form.js";
document.addEventListener("DOMContentLoaded", async () => {
  const getWhoBringsWhat = async () => {
    const selectedItems = await whoBringsWhat();
    document.querySelector("who-brings-what").items = selectedItems;
  };

  document.querySelector("#seeWhoBringsWhat").addEventListener("click", () => {
    document.querySelector("who-brings-what").style.display = "block";
    document.querySelector("selection-form").style.display = "none";
  });

  document.querySelector("#setSelectionForm").addEventListener("click", () => {
    document.querySelector("who-brings-what").style.display = "none";
    document.querySelector("selection-form").style.display = "block";
  });
  getWhoBringsWhat();
  setInterval(getWhoBringsWhat, 100000);
});
