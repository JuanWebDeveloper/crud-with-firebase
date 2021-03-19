const db = firebase.firestore()
const query = db.collection('tasks');

const taskForm = document.getElementById('taskForm');
const taskContainer = document.getElementById('taskContainer');
let editStatus = false;
let id = "";

const saveTask = (title, description) => query.doc().set({title, description});
const getTasks = () => query.get();
const onGetTasks = callback => query.onSnapshot(callback);
const deleteTask = id => query.doc(id).delete();
const getTaskEdit = id => query.doc(id).get();
const updateTask = (id, updatedTask) => query.doc(id).update(updatedTask)

window.addEventListener("DOMContentLoaded", async (e) => {
    onGetTasks((querySnapshot) => {
        taskContainer.innerHTML = "";

        querySnapshot.forEach(doc => {
            const task = doc.data();
            task.id = doc.id;
            
            taskContainer.innerHTML += `
            <div class="card card-body mt-2 cardsSingle">
                <h3>${task.title}</h3>
                <p>${task.description}</p>
                <div>
                    <button class="btn btn-danger btnDelete" data-id="${task.id}">Delete <i class="fas fa-trash-alt"></i></button>
                    <button class="btn btn-primary btnEdit" data-id="${task.id}">Edit <i class="fas fa-edit"></i></button>
                </div>
            </div>`;

            const btnDelete = document.querySelectorAll('.btnDelete');
            btnDelete.forEach(btn => {
                btn.addEventListener('click', async e => {
                    await deleteTask(e.target.dataset.id)
                });
            });

            const btnEdit = document.querySelectorAll('.btnEdit');
            btnEdit.forEach(btn => {
                btn.addEventListener('click', async e => {
                    const docEdit = await getTaskEdit(e.target.dataset.id);
                    editStatus = true;
                    id = e.target.dataset.id;
                    taskForm['taskTitle'].value = docEdit.data().title;
                    taskForm['taskDescription'].value = docEdit.data().description;
                    taskForm['btnTask'].innerHTML = "Update";
                    console.log(id);
                });
            })
        });
    });
});

taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const taskTitle = taskForm['taskTitle'].value;
    const taskDescription = taskForm['taskDescription'].value;
    
    if (!editStatus) {
        await saveTask(taskTitle, taskDescription);
    } else {
        await updateTask(id, {title: taskTitle, description: taskDescription});
        editStatus = false;
        id = "";
        taskForm['btnTask'].innerHTML = "Save";
    }

    taskForm.reset();
    taskForm['taskTitle'].focus();
});


