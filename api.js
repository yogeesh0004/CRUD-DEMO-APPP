document.addEventListener("DOMContentLoaded", function () {
    const apiBaseUrl = "https://65a8ca78219bfa3718679644.mockapi.io/demo";
    
    
    const apiService = (function () {
    async function fetchData(url) {
    const response = await fetch(url);
    return await response.json();
    }
    
    async function postData(url, data) {
    const response = await fetch(url, {
    method: 'POST',
    headers: {
    'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
    });
    return await response.json();
    }
    
    async function putData(url, data) {
    const response = await fetch(url, {
    method: 'PUT',
    headers: {
    'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
    });
    return await response.json();
    }
    
    async function deleteData(url) {
    const response = await fetch(url, {
    method: 'DELETE'
    });
    return await response.json();
    }
    
    async function patchData(url, data) {
    const response = await fetch(url, {
    method: 'PUT',
    headers: {
    'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
    });
    return await response.json();
    }
    
    return {
    fetchData,
    postData,
    putData,
    deleteData,
    patchData
    };
    })();
    
    // Singleton for managing UI
    const uiService = (function () {
    function createRecordRow(record) {
    const row = document.createElement("tr");
    const createdAt = new Date(record.createdAt).toLocaleString(undefined, {timeZone: 'Asia/Kolkata'}); // Format createdAt
    row.innerHTML = `
    <td>${record.id}</td>
    <td id="${record.id}">${record.name}</td>
    <td>${createdAt}</td>
    <td><img src="${record.avatar}" alt="Avatar" class="avatar-image"></td>
    <td>
    <button class="btn btn-warning btn-sm" data-toggle="modal" data-target="#editModal" data-record-id="${record.id}">Edit</button>
    <button class="btn btn-danger btn-sm" data-toggle="modal" data-target="#deleteModal" data-record-id="${record.id}">Delete</button>
    </td>
    `;
    return row;
    }
    
    function populateRecords(records) {
    const recordsGrid = document.getElementById("recordsGrid");
    recordsGrid.innerHTML = "";
    records.forEach(record => {
    recordsGrid.appendChild(createRecordRow(record));
    });
    }
    
    return {
    createRecordRow,
    populateRecords
    };
    })();
    
    // Fetch and populate records on page load
    async function loadRecords() {
    const records = await apiService.fetchData(apiBaseUrl);
    uiService.populateRecords(records);
    }
    
    loadRecords();
    
    // Add record functionality
    const addForm = document.getElementById("addForm");
    addForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    // const formData = new FormData(addForm);
    // console.log(formData)
    const data = {};
    data["name"] = addForm.elements["name"].value;
    data["avatar"] = addForm.elements["image"].value;
    
    
    // Call API to add record
    const newRecord = await apiService.postData(apiBaseUrl, data);
    // Update UI
    const recordsGrid = document.getElementById("recordsGrid");
    recordsGrid.appendChild(uiService.createRecordRow(newRecord));
    // Close modal
    $('#addModal').modal('hide');
    });
    
    // Edit record functionality with a dedicated modal
    $('#editModal').on('show.bs.modal', function (event) {
    const button = event.relatedTarget;
    const recordId = button.getAttribute('data-record-id');
    // Display a modal to get the new name
    const editButton = document.getElementById("editName");
    editButton.addEventListener("click", async function () {
    // Call API to delete record
    const newName=document.getElementById("newName").value
    if (newName !== null) {
    // Call API to update the name
    apiService.patchData(`${apiBaseUrl}/${recordId}`, { name: newName })
    .then(updatedRecord => {
    // Update UI
    // const recordsGrid = document.getElementById("recordsGrid");
    // const existingRow = recordsGrid.querySelector(`[data-record-id="${recordId}"]`);
    document.getElementById(recordId).innerHTML=newName
    console.log(newName)
    // const newRow = uiService.createRecordRow(updatedRecord);
    // recordsGrid.replaceChild(newRow, existingRow);
    // Close modal
    $('#editModal').modal('hide');
    })
    .catch(error => {
    console.error("Error updating name:", error);
    });
    }
    $('#deleteModal').modal('hide');
    });
    // const newName = prompt("Enter the new name:");
    
    });
    
    // Delete record functionality
    $('#deleteModal').on('show.bs.modal', function (event) {
    const button = event.relatedTarget;
    const recordId = button.getAttribute('data-record-id');
    // Confirm deletion
    const deleteButton = document.getElementById("deleteButton");
    deleteButton.addEventListener("click", async function () {
    // Call API to delete record
    await apiService.deleteData(`${apiBaseUrl}/${recordId}`);
    // Update UI
    const recordsGrid = document.getElementById("recordsGrid");
    const rowToDelete = recordsGrid.querySelector(`[data-record-id="${recordId}"]`).parentNode.parentNode;
    rowToDelete.remove();
    // Close modal
    $('#deleteModal').modal('hide');
    });
    });
    });
    