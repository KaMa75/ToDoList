// Header elements
var addTaskBtn = document.querySelector('.add-task-btn');
var addTaskBox = document.querySelector('.add-task-box');
// Add Task Box Elements
var addBtn = document.querySelector('.add-task-box .complete-btn');
var cancelBtn = document.querySelector('.add-task-box .delete-btn');
var textAreaTaskContent = document.querySelector('.add-task-box textarea');
var radioBtnsBox = document.querySelector('.add-task-box .radio-btns');
var radioBtns = document.querySelectorAll('.radio-btns .radio-btn');
var defaultPriorityBtn = document.querySelector('.radio-btns .normal');
var currentPriority = defaultPriorityBtn.dataset.priority;
var msgField = document.querySelector('.add-task-box .msg-field');
var charCounterField = msgField.querySelector('.char-counter');
var msgMaxLength = 100;
var warningField = document.querySelector('.add-task-box .warning-field');
// Task List Box Elements
var taskListBox = document.querySelector('.task-list-box');
var taskToFinishMsg = document.querySelector('.to-finish-msg');
var taskCounterField = taskToFinishMsg.querySelector('.number-of-tasks');
var noTasksMsg = document.querySelector('.no-task-msg');
var hrUnderMsgs = document.querySelector('.task-to-finish hr');
var removeCompleteTasksBox = document.querySelector('.remove-complete-box');
var elementToClone = document.querySelector('.to-clone').firstElementChild;

var tasks = [];
var lastId = 0;
var editedTaskIndex = null;
var mode = 'add';

// -------------------

function saveItems(){
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('id', JSON.stringify(lastId));
}

function readItems(){
    var readId = localStorage.getItem('id');
    var readTasks = localStorage.getItem('tasks');
    if(readId){
        lastId = JSON.parse(readId);
    }
    if(readTasks){
        tasks = JSON.parse(readTasks);
    }
}

function addClass(element, className){
    if(!element.classList.contains(className)){
        element.classList.add(className);
    }
}

function sortTasks(){
    tasks.sort(function(task1, task2){
        if(task1.priority > task2.priority) {
            return -1;
        }
    });
}

function removeClass(element, className){
    if(element.classList.contains(className)){
        element.classList.remove(className);
    }
}

function toggleClass(element, className){
    element.classList.toggle(className);
}

function toggleRadioButton(toEnable){
    radioBtns.forEach(function(radioBtn){
        removeClass(radioBtn.firstElementChild, 'show-indicator');
    });
    addClass(toEnable, 'show-indicator');
}

function setDefaultTaskBox(){
    textAreaTaskContent.value = '';
    toggleRadioButton(defaultPriorityBtn.firstElementChild);
    currentPriority = setPriority(defaultPriorityBtn);
    if(!msgField.classList.contains('hidden')){
        addClass(msgField, 'hidden');
    }
    if(!warningField.classList.contains('hidden')){
        addClass(warningField, 'hidden');
    }
}

function setPriority(element){
    return element.dataset.priority;
}

function setRadioBtn(currentRadioBtn){
    if(!currentRadioBtn.firstElementChild.classList.contains('show-indicator')){
        currentPriority = setPriority(currentRadioBtn);
        toggleRadioButton(currentRadioBtn.firstElementChild);
    }
}

function getTask (){
    var taskContent = textAreaTaskContent.value;
    var taskId;
    if(mode === 'add') {
        lastId++;
        taskId = lastId;
    } else if(mode === 'edit') {
        taskId = tasks[editedTaskIndex].id;
    }
    return {
        id: taskId,
        content: taskContent,
        priority: currentPriority,
        status: 'active'
    }
}

function setIfNoTasks(){
    removeClass(noTasksMsg, 'hidden');
    addClass(taskToFinishMsg, 'hidden');
    addClass(removeCompleteTasksBox, 'hidden');
    addClass(hrUnderMsgs, 'hidden');
}

function setIfTasks(){
    removeClass(hrUnderMsgs, 'hidden');
    addClass(noTasksMsg, 'hidden');
    removeClass(taskToFinishMsg, 'hidden');
    removeClass(removeCompleteTasksBox, 'hidden');
}

function setIfNoIncompleteTasks(){
    removeClass(hrUnderMsgs, 'hidden');
    removeClass(noTasksMsg, 'hidden');
    addClass(taskToFinishMsg, 'hidden');
    removeClass(removeCompleteTasksBox, 'hidden');
}

function setCounterField(counter){
    taskCounterField.innerText = counter;
}

function setFieldWithTasksCount() {
    var numberOfActiveTasks = 0;
    var numberOfDoneTasks = 0;
    tasks.forEach(function(task){
        if(task.status === 'active'){
            numberOfActiveTasks++;
        } else if(task.status === 'done'){
            numberOfDoneTasks++;
        }
    });
    setCounterField(numberOfActiveTasks);
    if(numberOfActiveTasks > 0) {
        setIfTasks();
    } else if(numberOfDoneTasks > 0){
        setIfNoIncompleteTasks();
    } else {
        setIfNoTasks();
    }
}

function createTaskToAdd(task){
    var newTaskElement = elementToClone.cloneNode(true);
    var priorityElement = newTaskElement.querySelector('.task-priority');
    var taskContentElement = newTaskElement.querySelector('.task-content');
    var priorityNumbersArray = ['1', '2', '3', '4', '5'];
    var priorityClassNamesArray = ['very-low-priority', 'low-priority', 'normal-priority', 'high-priority', 'very-high-priority'];
    var priority = task.priority;
    var priorityIndex = priorityNumbersArray.indexOf(priority);
    newTaskElement.dataset.priority = priority;
    newTaskElement.dataset.id = task.id;
    newTaskElement.classList.add(task.status);
    addClass(priorityElement, priorityClassNamesArray[priorityIndex]);
    taskContentElement.innerText = task.content;
    return newTaskElement;
}

function showTasksList(newTasksList) {
    var elementToDel = document.querySelector('.task-list');
    var parElement = elementToDel.parentElement;
    parElement.removeChild(elementToDel);
    parElement.appendChild(newTasksList);
}

function buildTasksList() {
    var newTaskList = taskListBox.firstElementChild.cloneNode();
    tasks.forEach(function(task){
        var taskToAdd = createTaskToAdd(task);
        newTaskList.appendChild(taskToAdd);
    });
    showTasksList(newTaskList);
}

function getCurrentTask(currentBtn){
    return currentBtn.parentElement.parentElement;
}

function findCurrentElementInArray(taskId) {
    var indexInArray = null;
    tasks.forEach(function(task, index){
        if(task.id == taskId) {
            indexInArray = index;
        }
    });
    return indexInArray;
}

function modifyTaskInArray(indexInArray) {
    if(tasks[indexInArray].status === 'active'){
        tasks[indexInArray].status = 'done';
    } else if(tasks[indexInArray].status === 'done'){
        tasks[indexInArray].status = 'active';
    }    
}

function deleteTaskFromArray(indexInArray) {
    tasks.splice(indexInArray, 1);
}

function setTaskToDone(currentTask) {
    var indexInArr = findCurrentElementInArray(currentTask.dataset.id);
    modifyTaskInArray(indexInArr);
    toggleClass(currentTask, 'done');
    saveItems();
}

function deleteTask(currentTask) {
    var indexInArr = findCurrentElementInArray(currentTask.dataset.id);
    deleteTaskFromArray(indexInArr);
    currentTask.parentElement.removeChild(currentTask);
    saveItems();
}

function findPriorityElementInAddTaskBox(priority){
    var priorityElement = null;
    radioBtns.forEach(function(radioBtn){
        if(radioBtn.dataset.priority === priority){
            priorityElement = radioBtn;
        }
    });
    return priorityElement;
}

function editTask(currentTask){
    editedTaskIndex = findCurrentElementInArray(currentTask.dataset.id);
    var editedTaskContent = tasks[editedTaskIndex].content;
    var currentPriority = tasks[editedTaskIndex].priority;
    var priorityElement = findPriorityElementInAddTaskBox(currentPriority);
    setRadioBtn(priorityElement);
    textAreaTaskContent.value = editedTaskContent;
    countCharacters();
    removeClass(addTaskBox, 'hidden');
}

function findDoneTasksInArray(){
    var indexes = [];
    tasks.forEach(function(task, index){
        if(task.status === 'done'){
            indexes.push(index);
        }
    });
    return indexes;
}

// When open

readItems();
buildTasksList();
setFieldWithTasksCount();

// 'Add Task' button event

function showAddTaskBox(){
    removeClass(addTaskBox, 'hidden');
    editedTaskIndex = tasks.length;
    mode = 'add';
}

addTaskBtn.addEventListener('click', showAddTaskBox);

// 'Radio' buttons event

radioBtns.forEach(function(radioBtn){
    radioBtn.addEventListener('click', function(event){
        var currentRadioBtn = event.target.parentElement;
        setRadioBtn(currentRadioBtn);
    });
});

// 'Cancel' button event

function hideAddTaskBox(){
    addClass(addTaskBox, 'hidden');
    setDefaultTaskBox();
}

cancelBtn.addEventListener('click', hideAddTaskBox);

// 'Add' button events

function validTask(){
    if(textAreaTaskContent.value === ''){
        if(!msgField.classList.contains('hidden')){
            addClass(msgField, 'hidden');
        }
        if(warningField.classList.contains('hidden')){
            removeClass(warningField, 'hidden');
        }
    }
}

function addTask(){    
    if(textAreaTaskContent.value !== ''){
        var task = getTask();
        addClass(addTaskBox, 'hidden');
        setDefaultTaskBox();
        tasks[editedTaskIndex] = task;
        sortTasks();
        saveItems();
        buildTasksList();
        setFieldWithTasksCount();
    } 
}

addBtn.addEventListener('mouseover', validTask);
addBtn.addEventListener('touchstart', validTask);
addBtn.addEventListener('click', addTask);

// 'TextField' event

function countCharacters(){
    var taskContentLength = textAreaTaskContent.value.length;
    var leftTaskContent = msgMaxLength - taskContentLength;
    charCounterField.innerText = leftTaskContent;
    if(!warningField.classList.contains('hidden')){
        addClass(warningField, 'hidden');
    }
    if(msgField.classList.contains('hidden')){
        removeClass(msgField, 'hidden');
    }
}

textAreaTaskContent.addEventListener('input', countCharacters);

// tasks buttons events

taskListBox.addEventListener('click', function(event){
    var currentBtn = event.target;
    var currentTask = getCurrentTask(currentBtn);
    if(currentBtn.classList.contains('complete-btn')){
        setTaskToDone(currentTask);
        setFieldWithTasksCount();
    } else if(currentBtn.classList.contains('delete-btn')){
        deleteTask(currentTask);
        setFieldWithTasksCount();
    } else if(currentBtn.classList.contains('edit-btn')){
        mode = 'edit';
        editTask(currentTask);
    }    
});

// 'remove complete' btn event

function removeCompleteTasks(){
    var indexesWithDoneTasks = findDoneTasksInArray();
    indexesWithDoneTasks.sort(function(a, b){
        return b - a;
    });
    indexesWithDoneTasks.forEach(function(taskIndex){
        deleteTaskFromArray(taskIndex);
    });
    saveItems();
    buildTasksList();
    setFieldWithTasksCount();    
}

removeCompleteTasksBox.addEventListener('click', removeCompleteTasks);
