// This application saves all progress in the browser web storage
// so even if you will re-open or reload webpage your task list wouldn't be lost

/* ////////////////////////////////////////// */
//          PUBLIC VARIABLES
/* ////////////////////////////////////////// */

const browStor = window.localStorage;

// this is a kick-start application state
const tasks = [
  { id: 1, title: "Go to the cinema", done: false },
  { id: 2, title: "Go to the theatre", done: true },
  { id: 3, title: "Learn Java Script", done: false },
  { id: 4, title: "Finish HTML project", done: false },
];

// this is an application statistics
let appSummary = {
  total: 0,
  done: 0,
  remain: 0
};

// this is de-facto application state
let appState = [];
const freeIdxPool = [];
const tasksBox = document.getElementById('tasks-box');
const tasksInfo = document.getElementById('tasks-info');
const searchBox = document.getElementById('search-box');
const filterList = document.getElementById('filter-tasks');

// keep calm :)  we'll display these elements once at least one task will appear
tasksInfo.style.display = 'none';
searchBox.style.display = 'none';
filterList.style.display = 'none';

/* ////////////////////////////////////////// */
//          APPLICATION LOGIC
/* ////////////////////////////////////////// */

// The goal of this function is to avoid task <id>-property duplicating
// when one task was deleted and another was added instead
const obtainTaskId = () => {
  if (freeIdxPool.length) {
    return (freeIdxPool.pop());
  } else {
    return (appState.length);
  };
};

// The goal of this function is to manage the process of adding
// of new task to the tas list and render it on the webpage
const AppendTask = (taskContents, isDone = false, tId = -1) => {
  let taskId = tId;
  if (taskId === -1) taskId = obtainTaskId(); 

  // first: filling out application state
  appState = [
    ...appState,
    {
      id: taskId, 
      title: taskContents, 
      done: isDone
    }
  ];

  // second: rendering task object on webpage
  const taskNode = document.createElement("li");
  const taskTitle = document.createElement("span");
  const taskControls = document.createElement("div");
    
  taskNode.classList.add('list-group-item', 'd-flex');
  if (isDone) taskTitle.classList.add('done');
  taskControls.classList.add('icons-box', 'ml-auto');

  taskTitle.innerHTML = taskContents;
  taskControls.innerHTML = `
    <i class="fa fa-check mr-3" style="cursor:pointer;"></i>
    <i  class="fa fa-trash" style="cursor:pointer;"></i>
  `;

  taskNode.appendChild(taskTitle);
  taskNode.appendChild(taskControls);

  tasksBox.appendChild(taskNode);
  
};

// This function responsible for recalculating the application statistics
// and for rendering that data on the webpage
const SummState = () => {

  // First: recalculating application statistics
  appSummary.total = appState.length;
  appSummary.done = appState.filter((item) => (item.done)).length;
  appSummary.remain = appSummary.total - appSummary.done;

  // Second: rendering app summary on the webpage
  document.getElementById("tasks-total").innerHTML = appSummary.total;
  document.getElementById("tasks-done").innerHTML = appSummary.done;
  document.getElementById("tasks-remain").innerHTML = appSummary.remain;

  if (appSummary.total) {
    tasksInfo.style.display = 'block';
    searchBox.style.display = 'block';
    filterList.style.display = 'block';
  } else {
    tasksInfo.style.display = 'none';
    searchBox.style.display = 'none';
    filterList.style.display = 'none';
  };

};

// This event listener responsible for app state initialization when page being loaded
document.addEventListener("DOMContentLoaded", () => {
  if (!browStor.getItem('My-To-Do-List')) {
    
    // if we're starting from scratch then grab kick-start application state
    tasks.forEach((task) => AppendTask(task.title, task.done));

  } else {

    // in the opposite case take a look to the task list in local web storage
    const rawStoredArr = JSON.parse(browStor.getItem('My-To-Do-List'));
    rawStoredArr.forEach((item) => {
      const parsedTask = JSON.parse(item);
      AppendTask(parsedTask.title, parsedTask.done, parsedTask.id);
    });
    // ...... Debug ......
    // console.log('Retrieving state from web storage...');
    // console.log(browStor);
    // console.log(rawStoredArr);
    // console.log(appState);
  };
  SummState();
  filterTasks(searchBox.value);
});


const renderTaskBox = (taskState) => {
  tasksBox.innerHTML = '';
  taskState.forEach((item) => {
    const taskNode = document.createElement("li");
    const taskTitle = document.createElement("span");
    const taskControls = document.createElement("div");
      
    taskNode.classList.add('list-group-item', 'd-flex');
    if (item.done) taskTitle.classList.add('done');
    taskControls.classList.add('icons-box', 'ml-auto');

    taskTitle.innerHTML = item.title;
    taskControls.innerHTML = `
      <i class="fa fa-check mr-3" style="cursor:pointer;"></i>
      <i  class="fa fa-trash" style="cursor:pointer;"></i>
    `;

    taskNode.appendChild(taskTitle);
    taskNode.appendChild(taskControls);

    tasksBox.appendChild(taskNode);
  });
};

const filterTasks = (filterString) => {

  let filterSet = [];
  if (filterString) {
    const filteRegEx = `^${filterString}`;
    const re = new RegExp(filteRegEx,"i");
    appState.forEach((item) => {
      // console.log('-------------------');
      // console.log(`testing ${item.title} versus ${re} regex`);
      // console.log(re.test(item.title));
      if (re.test(item.title)) {
        filterSet = [
          ...filterSet,
          item
        ];
      };
    });
  } else {
    filterSet = appState.slice();
  };

  switch (document.getElementById('filter-tasks').value) {
    case '1':
      renderTaskBox(filterSet);
      break;
    case '2':
      renderTaskBox(filterSet.filter((item) => (item.done)));
      break;
    case '3':
      renderTaskBox(filterSet.filter((item) => (item.done == false)));
  };

}

function handleTasks(e) {
  e.preventDefault();
  const {target} = e;

  // clicking on the "Add Task" button handler
  if (target.classList.contains('btn-primary')) {
    const taskField = document.getElementById('task-form').elements['title'];
    if (taskField.value.length < 5) {
      alert("tasks title must be at least 5 characters" );
    } else {
      AppendTask(taskField.value);
      SummState();
      filterTasks(searchBox.value);
    };
    taskField.value = "";
  };

  // clicking on the "Check" icon
  if (target.classList.contains('fa-check')) {
    const taskHit = target.parentNode.parentNode.firstChild;
    const taskHitIndex = appState.findIndex((el) => el.title === taskHit.innerHTML);
    taskHit.classList.toggle('done');
    appState[taskHitIndex].done = !appState[taskHitIndex].done;
    SummState();
    filterTasks(searchBox.value);
  };

  // clicking on the "Delete" icon
  if (target.classList.contains('fa-trash')) {
    var isConfirm = confirm('Are you sure?');
    if (isConfirm) {
      const taskHit = target.parentNode.parentNode;
      const taskTitle = taskHit.firstChild;
      const taskHitIndex = appState.findIndex((el) => el.title === taskTitle.innerHTML);
      taskHit.parentNode.removeChild(taskHit);
      appState.splice(taskHitIndex, 1);
      SummState();
    }
  }

  // clicking the filter options dropdown
  if (target.id === 'filter-tasks') {
    filterTasks(searchBox.value);
  };
  
};

searchBox.addEventListener('keyup', ({target}) => filterTasks(target.value));


// Every time before close our webpage application's state will be saved to the local browser storage
window.onbeforeunload = function() {
  let storList = JSON.stringify(appState.map((item) => JSON.stringify(item)));
  browStor.setItem('My-To-Do-List', storList);
  // ..... Debug .......
  // console.log('Storing tasklist ...');
  // appState.forEach((o) => console.log(JSON.stringify(o)));
  // console.log(storList);
};

document.addEventListener('click', handleTasks);