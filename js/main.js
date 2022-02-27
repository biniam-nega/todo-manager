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

    // a function that returns html for a task
    function renderTodayTask(text, index, type) {
        if (type) {
            return '<div class="" id="task-' + index + '">' +
                '<form>' +
                '<h4>' + text + ' <input type="checkbox" class="" id="today-check-' + index + '" />' +
                '</form>' +
                '</div>';
        }
        return '<div class="" id="done-' + index + '">' +
            '<form>' +
            '<h4>' + text + ' <input type="checkbox" class="" id="done-check-' + index + '" checked />' +
            '</form>' +
            '</div>';

    }

    // a function to render all the done and undone tasks
    function renderTasks() {
        $('#today-tasks').html('');
        $('#done-tasks').html('');

        for (var i in localStorage) {
            if (/^([\w]+)([0-9]+)$/.test(i)) {
                var result = /^([\w]+)([0-9]+)$/.exec(i);
                if (result[1] === 'task') {
                    $('#today-tasks').html(renderTodayTask(localStorage[i], result[2], true) + $('#today-tasks').html());
                    // add event handler to the checkbox
                    (function () {
                        var c = i;
                        var index = result[2];
                        $('#today-check-' + index).click(function () {

                            // add the task to the done tasks list
                            localStorage['done' + doneTasksNum] = localStorage[c];
                            doneTasksNum++;

                            // then delete it from undone tasks list
                            delete localStorage['task' + index];
                            todayTasksNum--;
                        });
                    }());

                }
                else if (result[1] === 'done') {
                    $('#done-tasks').html(renderTodayTask(localStorage[i], result[2]) + $('#done-tasks').html());
                    // add event handler to the checkbox
                    (function () {
                        var c = i;
                        var index = result[2];
                        $('#done-check-' + index).click(function () {

                            // add the task to the done tasks list
                            localStorage['task' + doneTasksNum] = localStorage[c];
                            todayTasksNum++;

                            // then delete it from undone tasks list
                            delete localStorage['done' + index];
                            doneTasksNum--;
                        });
                    }());
                }
            }

        }
    }

    // render the tasks every 50ms
    setInterval(renderTasks, 500);


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
            todayTasksNum++;
            localStorage['task' + todayTasksNum] = $('#new-task').val();
            $('#new-task').val('');
        }
    });
});
