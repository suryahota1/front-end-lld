const addTaskButton = document.getElementById("add-task-btn");
const taskStatusContainer = document.getElementById("task-status");
const queueCountEle = document.getElementById("queue-task-count");
const MAX_TASK_COUNT = 5;
let currentTaskCount = 0;
const queue = [];
const removeQueue = [];
let taskId = 0;

let taskRAF = null;
let taskRemoveRAF = null;

function doTask () {
    return new Promise(( resolve ) => {
        const randTime = Math.floor(Math.random() * 10) * 1000;
        setTimeout(() => {
            const randAmount = 10 + Math.floor(Math.random() * 10);
            resolve(randAmount);
        }, randTime);
    });
}

function updateProgressBar ( progressItem, currValue ) {
    progressItem.value = currValue;
}

function removeTask () {
    const taskId = removeQueue.shift();
    document.getElementById(taskId).remove();
    queue.filter(item => item !== taskId);
    currentTaskCount--;
    if ( removeQueue.length > 0 ) {
        taskRemoveRAF = requestAnimationFrame(removeTask);
    } else {
        taskRemoveRAF = null;
    }
    if ( currentTaskCount < MAX_TASK_COUNT && queue.length > 0 ) {
        scheduleTaskRefresh();
    }
}

function scheduleTaskRemove () {
    if ( taskRemoveRAF === null ) {
        taskRemoveRAF = requestAnimationFrame(removeTask);
    }
}

function updateTaskStatus ( taskId, progressItem, currValue = 0 ) {
    doTask().then(( resp ) => {
        currValue = Math.min(currValue + resp, 100);
        console.log("taskId", taskId, "currValue", currValue);
        updateProgressBar(progressItem, currValue);
        if ( currValue === 100 ) {
            removeQueue.push(taskId);
            scheduleTaskRemove();
        } else {
            updateTaskStatus(taskId, progressItem, currValue);
        }
    })
}

function appendTaskRow ( taskId ) {
    const templateEle = document.getElementById("task-progress");
    const clone = templateEle.content.cloneNode(true);
    clone.querySelector(".progress-container").setAttribute("id", taskId);
    const idContainer = clone.querySelector(".task-id");
    const progressItem = clone.querySelector(".progress-item");

    idContainer.innerHTML = taskId;
    progressItem.value = 0;

    taskStatusContainer.append(clone);
    updateTaskStatus(taskId, progressItem);
}

function refreshTasks ( timer ) {
    currentTaskCount++;
    appendTaskRow(queue.shift());
    updateQueueCount();
    taskRAF = null;
    if ( queue.length > 0 && currentTaskCount < MAX_TASK_COUNT ) {
        scheduleTaskRefresh();
    }
}

function scheduleTaskRefresh () {
    if ( taskRAF === null ) {
        taskRAF = requestAnimationFrame(refreshTasks);
    }
}

function updateQueueCount () {
    queueCountEle.innerHTML = queue.length;
}

addTaskButton.addEventListener("click", () => {
    queue.push(++taskId);
    updateQueueCount();
    if ( currentTaskCount < MAX_TASK_COUNT ) {
        scheduleTaskRefresh();
    }
});