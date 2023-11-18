const http = new coreHTTP();

// Block Variables
let theList = [];

// Selectors
const result = document.querySelector(".result");
const input =  document.querySelector("#listitem");
const myForm = document.getElementById("new-task-form");
const creButton = document.querySelector("#cre-btn");

// Event Listeners
creButton.addEventListener("click", httpPost);

myForm.addEventListener("submit", function(event) {
  event.preventDefault();
});

/* Helper Functions */
function ShowList() {
  console.log(theList)
  let output = "<ul>";
  for (let i = 0; i < theList.length; i++) {
    const completedClass = theList[i].completed ? 'completed' : '';
    output += `<li>
              <div id= "button_div_1">
                <input type="checkbox" class="checkbox" data-index="${i}" ${theList[i].completed ? "checked" : ''}>
              </div>
              <div id= "button_div_2">
                <span class="${completedClass} item_name"> ${theList[i].name}</span>
              </div>
              <div id= "button_div_3">
                <button class="del-btn" data-index = "${i}">${getDeleteIcon()}</button>
                <button class="upd-btn" data-index = "${i}">${getUpdateIcon()}</button>
              </div>
              </li>`; // Assuming tasks have a 'name' property
  }
  output += "</ul>";
  result.innerHTML = output;


  const deleteButtons = document.querySelectorAll(".del-btn");
  const updateButtons = document.querySelectorAll(".upd-btn");
  const checkboxes = document.querySelectorAll(".checkbox");

  deleteButtons.forEach(button => {
    button.addEventListener('click', function (){
      const index = parseInt(button.dataset.index);
      httpDelete(index);
    });
  });

  updateButtons.forEach(button => {
    button.addEventListener('click', function(){
      const index = parseInt(button.dataset.index);
      httpPut(index);
    });
  });

  checkboxes.forEach(box => {
    box.addEventListener('change', function(){
      const index = parseInt(box.dataset.index);
      httpComplete(index);
    });
  });
}


function getDeleteIcon() {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
      <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z"/>
      <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z"/>
    </svg>
  `;
}

function getUpdateIcon() {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16">
      <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/>
    </svg>
  `;
}

// Get and display the list
async function httpGet() {
  try {
    const response = await http.get(`http://localhost:5500/api/tasks`);
    console.log(response);
    theList = response.task;
    console.log(theList);
    ShowList();
  } catch (error) {
    console.log(error);
  }
}

// Listener Functions
async function httpPost() {
  console.log(input.value);
  if(input.value !== ""){
    try {
      theList.push({name: input.value, completed: false});
      const response = await http.post("http://localhost:5500/api/tasks", {name: input.value, completed: false});
      console.log(response);
      if(response.ok){
        httpGet();
        ShowList();
      }
    } catch (error) {
      console.log(error);
    }
  }
  location.reload();
}

async function httpDelete(index) {
  if (index >= 0 && index < theList.length) {
    let taskId = theList[index]._id;
    theList.splice(index, 1);
    try{
        //call the http.delete
        const response = await http.delete(`http://localhost:5500/api/tasks/${taskId}`);
        httpGet();
    }catch(error){
        console.log("Error deleting task:" + error);
    }
  } else {
    console.log("Item not found");
  }
}

async function httpPut(index) {
  // let listIndex = theList.findIndex(task => task.name === input.value);
  let changeItem = null;
  console.log(index);

  if(index >= 0 && index < theList.length){
    changeItem = prompt("What would you like to change the task to: ");
  }

  if (index >= 0 && index < theList.length && changeItem !== null) {
    //Update the list for post.
    theList[index].name = changeItem;
    theList[index].completed = false;

    try{
        //create id to pass to the url;
        const taskId = theList[index]._id;
        //call the http.put using id and passing a object with the updates.
        const response = await http.put(`http://localhost:5500/api/tasks/${taskId}`, { name : changeItem, completed : false });
        httpGet();
    }catch(error){
        console.log("Error updating task: ", error);
    }
  } else if (changeItem === null) {
    console.log("Canceled");
  } else {
    console.log("Item not found");
  }
}

async function httpComplete(index) {
  if (index >= 0 && index < theList.length) {
    // Toggle the completion status
    theList[index].completed = !theList[index].completed;

    try {
      const taskId = theList[index]._id;
      const response = await http.put(`http://localhost:5500/api/tasks/${taskId}`, {
        completed: theList[index].completed
      });
      ShowList();
      console.log(response);
    } catch (error) {
      console.log("Error toggling task completion: ", error);
    }
  } else {
    console.log("Item not found");
  }
}



// Loading functions
function showLoading() {
  result.innerHTML = "Loading...";
}

async function main() {
  showLoading();
  await httpGet();
}

main();

