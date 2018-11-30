var addTaskBtn = document.querySelector('.add-task-btn');
var addTaskBox = document.querySelector('.add-task-box');
// Add Task Box
var addBtn = document.querySelector('.add-task-box .complete-btn');
var cancelBtn = document.querySelector('.add-task-box .delete-btn');
var textAreaTaskContent = document.querySelector('.add-task-box textarea');
var radioBtnsBox = document.querySelector('.add-task-box .radio-btns');
var radioBtns = document.querySelectorAll('.add-task-box .radio-btns input');
var defaultPriorityBtn = document.querySelector('.add-task-box .radio-btns .normal');
var currentPriority = defaultPriorityBtn.dataset.priority;
var msgField = document.querySelector('.add-task-box .msg-field');
var charCounterField = msgField.querySelector('.char-counter');
var msgMaxLength = 100;
var warningField = document.querySelector('.add-task-box .warning-field');
// Task List Box
var taskList = document.querySelector('.task-list');
var taskToFinishMsg = document.querySelector('.to-finish-msg');
var taskCounterField = taskToFinishMsg.querySelector('.number-of-tasks');
var noTasksMsg = document.querySelector('.no-task-msg');
var hrUnderMsgs = document.querySelector('.task-to-finish hr');
var removeCompleteTasksBox = document.querySelector('.remove-complete-box');
var elementToClone = document.querySelector('.to-clone').firstElementChild;



// -------------------

function addClass(element, className){
    if(!element.classList.contains(className)){
        element.classList.add(className);
    }
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
        radioBtn.checked === false;
        removeClass(radioBtn.nextElementSibling, 'show-checkmark');
    });
    toEnable.checked === true;
    addClass(toEnable.nextElementSibling, 'show-checkmark');
}

function setDefaultTaskBox(){
    textAreaTaskContent.value = '';
    toggleRadioButton(defaultPriorityBtn.querySelector('input'));
    currentPriority = setPriority(defaultPriorityBtn);
}

function setPriority(element){
    return element.dataset.priority;
}

function setRadioBtn(currentRadioBtn){
    if(!currentRadioBtn.lastElementChild.classList.contains('show-checkmark')){
        currentPriority = setPriority(currentRadioBtn);
        toggleRadioButton(currentRadioBtn.querySelector('input'));
    }
}

function getTask (){
    var taskContent = textAreaTaskContent.value;
    return {
        task: taskContent,
        priority: currentPriority
    }
}

function countTasks(){
    var toDoTasksNumber = Array.from(taskList.children).filter(function(currentTask){
        return currentTask.className === '';
    }).length;
    var canceledTasksNumber = taskList.querySelectorAll('.hidden').length;
    var allTasksNumber = Array.from(taskList.children).length;
    return {
        toDo: toDoTasksNumber,
        noCancelled: allTasksNumber - canceledTasksNumber
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

function createTaskToAdd(task){
    var newTaskElement = elementToClone.cloneNode(true);
    var priorityElement = newTaskElement.querySelector('.task-priority');
    var taskContentElement = newTaskElement.querySelector('.task-content');
    newTaskElement.dataset.priority = task.priority;
    if(task.priority == 5){
        addClass(priorityElement, 'very-high-priority')
    } else if(task.priority == 4){
        addClass(priorityElement, 'high-priority')
    } else if(task.priority == 3){
        addClass(priorityElement, 'normal-priority')
    } else if(task.priority == 2){
        addClass(priorityElement, 'low-priority')
    } else if(task.priority == 1){
        addClass(priorityElement, 'very-low-priority')
    }
    taskContentElement.innerText = task.task;
    
    return newTaskElement;
}

function addTaskToList(taskToAdd, nextElement){
    if(nextElement){
        taskList.insertBefore(taskToAdd, nextElement);
    } else {
        taskList.appendChild(taskToAdd);
    }
}

function findNextElement(priority){
    var tasks = Array.from(taskList.children);
    var nextElement = tasks.filter(function(task){
        return task.dataset.priority < priority
    })[0];
    return nextElement;
}

function findCompleteTasks(){
    return taskList.querySelectorAll('.done');
}

function readTask(task){
    return {
        priority: task.parentElement.parentElement.dataset.priority,
        task: task.parentElement.parentElement.querySelector('p').innerText
    }
}

function setAddTaskBox(taskToEdit){
    textAreaTaskContent.value = taskToEdit.task;
    var currentRadioBtn;
    if(taskToEdit.priority == 5){
        currentRadioBtn = radioBtnsBox.querySelector('.vhigh');
    } else if(taskToEdit.priority == 4){
        currentRadioBtn = radioBtnsBox.querySelector('.high');
    } else if(taskToEdit.priority == 3){
        currentRadioBtn = radioBtnsBox.querySelector('.normal');
    } else if(taskToEdit.priority == 2){
        currentRadioBtn = radioBtnsBox.querySelector('.low');
    } else if(taskToEdit.priority == 1){
        currentRadioBtn = radioBtnsBox.querySelector('.vlow');
    }
    setRadioBtn(currentRadioBtn);
}



// 'Add Task' button event

function showAddTaskBox(){
    removeClass(addTaskBox, 'hidden');
}

addTaskBtn.addEventListener('click', showAddTaskBox);

// 'Radio' buttons event

radioBtnsBox.addEventListener('click', function(event){
    if(event.target.classList.contains('radio-label')){
        var currentRadioBtn = event.target;
        setRadioBtn(currentRadioBtn);
    } else if(event.target.classList.contains('checkmark')){
        var currentRadioBtn = event.target.parentElement;
        setRadioBtn(currentRadioBtn);
    }
});

// 'Cancel' button event

function hideAddTaskBox(){
    addClass(addTaskBox, 'hidden');
    setDefaultTaskBox();
    if(!msgField.classList.contains('hidden')){
        addClass(msgField, 'hidden');
    }
    if(!warningField.classList.contains('hidden')){
        addClass(warningField, 'hidden');
    }
}

cancelBtn.addEventListener('click', hideAddTaskBox);

// 'Add' button events

function validTask(){    
    if(textAreaTaskContent.value === ''){
        if(!msgField.classList.contains('hidden')){
            addClass(msgField, 'hidden');
        }
        removeClass(warningField, 'hidden');
    }
}

function addTask(){
    var task = getTask();
    if(task.task !== ''){
        addClass(addTaskBox, 'hidden');
        setDefaultTaskBox();
        var taskToAdd = createTaskToAdd(task);
        var numberOfTasks = countTasks().toDo;
        // console.log(numberOfTasks);
        if(numberOfTasks === 0){
            addTaskToList(taskToAdd);
        } else if(numberOfTasks > 0){
            var nextElement = findNextElement(task.priority);
            addTaskToList(taskToAdd, nextElement);
        }
        numberOfTasks++;
        setCounterField(numberOfTasks);
        if(numberOfTasks === 0){
            setIfNoTasks();
        } else if(numberOfTasks > 0){
            setIfTasks();
        }
    } 
}

addBtn.addEventListener('mouseover', validTask);
addBtn.addEventListener('click', addTask);

// 'TextField' event

function countCharacters(){
    var taskContentLength = textAreaTaskContent.value.length;
    var leftTaskContent = msgMaxLength - taskContentLength;
    charCounterField.innerText = leftTaskContent;
    if(!warningField.classList.contains('hidden')){
        addClass(warningField, 'hidden');
    }
    removeClass(msgField, 'hidden');
}

textAreaTaskContent.addEventListener('input', countCharacters);

// tasks buttons event

function setFields(){
    var numberOfTasks = countTasks().toDo;
    var noCancelledTasks = countTasks().noCancelled;
    setCounterField(numberOfTasks);
    console.log(numberOfTasks, noCancelledTasks);
    if(noCancelledTasks === 0){
        setIfNoTasks();
    } else if(numberOfTasks === 0){
        setIfNoIncompleteTasks();
    } else if(numberOfTasks > 0){
        setIfTasks();
    }
}

taskList.addEventListener('click', function(event){
    var currentBtn = event.target;
    console.log(currentBtn);
    if(currentBtn.classList.contains('complete-btn')){
        toggleClass(currentBtn.parentElement.parentElement, 'done');        
        setFields();
        // wypełnić kółko priorytetu jak zadanie oznaczone jako zrobione
    } else if(currentBtn.classList.contains('delete-btn')){
        addClass(currentBtn.parentElement.parentElement, 'hidden');
        setFields();
    } else if(currentBtn.classList.contains('edit-btn')){
        var taskForEdit = readTask(currentBtn);
        setAddTaskBox(taskForEdit);
        console.log(taskForEdit);
        showAddTaskBox();
        
        // otwieranie edycji zadania
    }    
});

// 'remove complete' btn event

function removeCompleteTasks(){
    var completeTasks = findCompleteTasks();
    completeTasks.forEach(function(completeTask){
        addClass(completeTask, 'hidden');
    });
    setFields();
}

removeCompleteTasksBox.addEventListener('click', removeCompleteTasks);


// Dopisać pokazywanie wykonanych zadań
