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
}

cancelBtn.addEventListener('click', hideAddTaskBox);


