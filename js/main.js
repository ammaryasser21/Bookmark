// --------- Select Element ---------//
var bookNameInput = document.querySelector("#bookNameInput");
var bookUrlInput = document.querySelector("#bookUrlInput");
var bookSearchInput = document.getElementById("bookSearchInput");
var inputs = document.querySelectorAll("input");
var bookListContainer = document.querySelector("#bookList");
var btnAddItem = document.getElementById("btnAddItem");
var btnUpdateItem = document.getElementById("btnUpdateItem");
var feedName = document.querySelector("#feedName");
var feedUrl = document.querySelector("#feedUrl");
var alertCheck = document.querySelector('p[class~="alert"]');
// --------- Global Variable ---------//
var bookMarksList = new Array();
// --------- When Start ---------//
(function () {
   if (getStorage() != null) {
      bookMarksList = getStorage();
      displayData();
   }
})();
// --------- Events ---------//
// validation
bookNameInput.oninput = function () {
   //validation Name
   var regexName = /^\w[\w ]*$/;
   validCheck(regexName, bookNameInput);
};
bookUrlInput.oninput = function () {
   //validation url
   var regexName =
      /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:\/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
   validCheck(regexName, bookUrlInput);
};
// Add btn
btnAddItem.onclick = function () {
   getData();
   displayData();
};
// Update btn
btnUpdateItem.onclick = function () {
   updateBookMark();
   displayData();
};
// Search
bookSearchInput.oninput = function () {
   searchData();
};
// --------- Function ---------//
// Get Data
function getData() {
   var bookMark = {
      name: bookNameInput.value,
      url: bookUrlInput.value,
   };
   if (checkBook(bookMark)) {
      bookMarksList.push(bookMark);
      setStorage();
      resetData();
      alertCheck.classList.replace("d-block", "d-none");
   } else {
      alertCheck.classList.replace("d-none", "d-block");
   }
}
// Display Data
function displayData() {
   var boxData = "";
   for (var i = 0; i < bookMarksList.length; i++) {
      boxData += `
               <div class="item hstack gap-1 p-4">
                  <h5 class="w-50">${bookMarksList[i].name}</h5>
                  <a href="${bookMarksList[i].url}" target="_blank" type="button" class="btn btn-success" id="btnVisit">Visit</a>
                  <button onclick="updateInfo(${i})" type="button" class="btn btn-warning" id="btnUpdate">Update</button>
                  <button onclick="deleteRow(${i})" type="button" class="btn btn-danger" id="btnDelete">Delete</button>
               </div>
               `;
   }
   bookListContainer.innerHTML = boxData;
}
// Reset Form
function resetData() {
   for (var i = 0; i < inputs.length; i++) {
      inputs[i].value = "";
      inputs[i].classList.remove("is-valid");
   }
   btnAddItem.disabled = true;
}
// Set Storage
function setStorage() {
   localStorage.setItem("bookList", JSON.stringify(bookMarksList));
}
// Get Storage
function getStorage() {
   return JSON.parse(localStorage.getItem("bookList"));
}
// Delet Row
function deleteRow(index) {
   bookMarksList.splice(index, 1);
   setStorage();
   displayData();
}
// Get Update Info
var curentIndexItem = 0;
function updateInfo(index) {
   curentIndexItem = index;
   var valueLength = Object.values(bookMarksList[index]).length;
   for (var i = 0; i < valueLength; i++) {
      inputs[i].value = Object.values(bookMarksList[index])[i];
   }
   btnUpdateItem.classList.replace("d-none", "d-inline-block");
   btnAddItem.classList.add("d-none");
}
// Update BookList
function updateBookMark() {
   var bookMark = {
      name: bookNameInput.value,
      url: bookUrlInput.value,
   };
   if (checkBook(bookMark)) {
      bookMarksList[curentIndexItem] = bookMark;
      setStorage();
      resetData();
      btnUpdateItem.classList.replace("d-inline-block", "d-none");
      btnAddItem.classList.replace("d-none", "d-inline-block");
      alertCheck.classList.replace("d-block", "d-none");
   } else {
      alertCheck.classList.replace("d-none", "d-block");
   }
}
// function
// Search Data
function searchData() {
   var boxData = "";
   for (var i = 0; i < bookMarksList.length; i++) {
      if (
         bookMarksList[i].name
            .toUpperCase()
            .includes(bookSearchInput.value.toUpperCase())
      ) {
         boxData += `
               <div class="item hstack gap-1 p-4">
                  <h5 class="w-50">${bookMarksList[i].name}</h5>
                  <a href="${bookMarksList[i].url}" target="_blank" type="button" class="btn btn-success" id="btnVisit">Visit</a>
                  <button onclick="updateInfo(${i})" type="button" class="btn btn-warning" id="btnUpdate">Update</button>
                  <button onclick="deleteRow(${i})" type="button" class="btn btn-danger" id="btnDelete">Delete</button>
               </div>
               `;
      }
   }
   bookListContainer.innerHTML = boxData;
}
// validation
function validCheck(regexData, inputCheck) {
   if (regexData.test(inputCheck.value)) {
      // is valid
      inputCheck.classList.add("is-valid");
      inputCheck.classList.remove("is-invalid");
      if (
         bookUrlInput.classList.contains("is-valid") &&
         bookNameInput.classList.contains("is-valid")
      ) {
         feedName.classList.remove("d-block");
         feedUrl.classList.remove("d-block");
      } else if (bookNameInput.classList.contains("is-valid")) {
         feedName.classList.remove("d-block");
      } else if (bookUrlInput.classList.contains("is-valid")) {
         feedUrl.classList.remove("d-block");
      }
   } else {
      // not valid
      inputCheck.classList.add("is-invalid");
      inputCheck.classList.remove("is-valid");
      if (
         bookUrlInput.classList.contains("is-invalid") &&
         bookNameInput.classList.contains("is-invalid")
      ) {
         feedName.classList.add("d-block");
         feedUrl.classList.add("d-block");
      } else if (bookNameInput.classList.contains("is-invalid")) {
         feedName.classList.add("d-block");
      } else if (bookUrlInput.classList.contains("is-invalid")) {
         feedUrl.classList.add("d-block");
      }
   }
   if (
      // Check Two Value is Valid To Enable Button
      bookNameInput.classList.contains("is-valid") &&
      bookUrlInput.classList.contains("is-valid")
   ) {
      btnAddItem.removeAttribute("disabled");
   } else {
      btnAddItem.disabled = true;
   }
}
// to check if name in array
function checkBook(bookMark) {
   var check = true;
   for (var i = 0; i < bookMarksList.length; i++) {
      if (btnUpdateItem.classList.contains("d-inline-block")) {
         if (bookMarksList[i].name == bookMark.name) {
            check = false;
            alertCheck.innerHTML = "this name already exist";
            break;
         } else {
            check = true;
         }
      } else {
         if (bookMarksList[i].name == bookMark.name) {
            check = false;
            alertCheck.innerHTML = "this name already exist";
            break;
         } else if (bookMarksList[i].url == bookMark.url) {
            check = false;
            alertCheck.innerHTML = "this url already exist";
            break;
         } else {
            check = true;
         }
      }
   }
   return check;
}
