$(document).ready(function () {      // Wait for the page to load

    // Get the number of undone and done tasks
    var todayTasksNum = 0;
    var doneTasksNum = 0;
    for (var i in localStorage) {
        if (/^task([0-9]+)$/.test(i)) {
            todayTasksNum++;
        }
        else if (/^done([0-9]+)$/.test(i)) {
            doneTasksNum++;
        }
    }

    my_lib.augmentArray();  // Add some functionalities to array prototype -from my_lib.js- (I want the ability to delete an element from an array)

    // a function that returns html for a task
    function renderTodayTask(text, index, type) {
        if (type) {
            return '<div class="" id="task-' + index + '">' +
                '<form>' +
                '<h4>' + text + ' <input type="checkbox" class="" id="check-' + index + '" />' +
                '</form>' +
                '</div>';
        }
        return '<div class="" id="done-' + index + '">' +
            '<form>' +
            '<h4>' + text + ' <input type="checkbox" class="" id="done-' + index + '" checked />' +
            '</form>' +
            '</div>';

    }

    function renderTasks() {
        $('#today-tasks').html('');
        $('#done-tasks').html('');

        for (var i in localStorage) {
            if (/^([\w]+)([0-9]+)$/.test(i)) {
                var result = /^([\w]+)([0-9]+)$/.exec(i);
                if (result[1] === 'task') {
                    $('#today-tasks').html(renderTodayTask(localStorage[i], result[2], true) + $('#today-tasks').html());
                }
                else if (result[1] === 'done') {
                    $('#done-tasks').html(renderTodayTask(localStorage[i], result[2]) + $('#done-tasks').html());
                }
            }

        }
    }

    setInterval(renderTasks, 50);


    /* Add event listeners */

    // Show done tasks when the user clicks on the done button
    $('#view-done-btn').click(function () {
        $('#my-tasks').hide(1000);
        $('#done-tasks').show(1500);
    });

    // Show today's tasks when the user clicks on the today's todos button
    $('#view-today-btn').click(function () {
        $('#done-tasks').hide(1000);
        $('#my-tasks').show(1500);
    });

    // Add a task
    $('#add-todo-btn').click(function () {
        if ($('#new-task').val()) {      // If the text input is not empty
            console.log('here')
            todayTasksNum++;
            localStorage['task' + todayTasksNum] = $('#new-task').val();
        }
    });
});
