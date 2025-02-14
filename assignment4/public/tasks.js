
// Listen for changes on the dropdown
document.getElementById('tasks').addEventListener('change', function () {
    const selectedTask = this.value;

    // Call different functions based on the selected task
    switch (selectedTask) {
        case 'task1':
            handleTask1();
            break;
        case 'task2':
            handleTask2();
            break;
        case 'task3':
            handleTask3();
            break;
        case 'task4':
            handleTask4();
            break;
        case 'task5':
            handleTask5();
            break;
        case 'task6':
            handleTask6();
            break;
        case 'task7':
            handleTask7();
            break;
        case 'task8':
            handleTask8();
            break;
        default:
            console.log('No task selected');
    }
});

// Sample functions for each task
function handleTask1() {
    alert('Task 1: Graphical Method and Absolute Error selected!');
}

function handleTask2() {
    alert('Task 2: Comparison of Root-Finding Methods selected!');
}

function handleTask3() {
    alert('Task 3: Jacobi Method selected!');
}

function handleTask4() {
    alert('Task 4: Iterative Method for Matrix Inversion selected!');
}

function handleTask5() {
    alert('Task 5: Linear Curve Fitting selected!');
}

function handleTask6() {
    alert('Task 6: Newton’s Forward Interpolation Formula selected!');
}

function handleTask7() {
    alert('Task 7: First Derivative Using Newton’s Forward Difference Formula selected!');
}

function handleTask8() {
    alert('Task 8: Trapezoidal Rule selected!');
}

