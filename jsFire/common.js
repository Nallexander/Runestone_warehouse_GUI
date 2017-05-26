// Initialize Firebase
var config = {
	apiKey: "AIzaSyAvXOYkdJC5z0ua6ZD1OvOLVrpaMznCOqE",
	authDomain: "runestone-d1faf.firebaseapp.com",
	databaseURL: "https://runestone-d1faf.firebaseio.com",
	projectId: "runestone-d1faf",
	storageBucket: "runestone-d1faf.appspot.com",
	messagingSenderId: "1068465857374"
};
firebase.initializeApp(config);

//Add variables to access the database
var database = firebase.database();
var refWarehouse = firebase.database().ref('warehouse');
var refMap = firebase.database().ref('maps');
var refRobots = firebase.database().ref('robots');

//Generate a table entry from the database entry
function generateTableEntry(databaseEntry) {
	return '<tr data-key="' + databaseEntry.key + '"><td>' + databaseEntry.key + '</td><td>' + databaseEntry.packageName + '</td><td>' + databaseEntry.temperature + '</td><td>' + databaseEntry.stored + '</td><td id="rowTd' + databaseEntry.key + '">' + databaseEntry.row + '</td><td id="shelfTd' + databaseEntry.key + '">' + databaseEntry.shelf + '</td><td id="actions' + databaseEntry.key + '"><button onclick="deleteFromFB(' + "'" + databaseEntry.key + "'" + ')">Remove</button><button onclick="movePackage(' + "'" + databaseEntry.key + "'" + ')">Move</button></tr>';
}

//Table header
var tableHeader = '<tr><th onclick="sortTable(0)">Package ID</th><th onclick="sortTable(1)">Package Name</th><th onclick="sortTable(2)">Temperature</th><th onclick="sortTable(3)">Stored</th><th onclick="sortTable(4)">Row</th><th onclick="sortTable(5)">Shelf</th><th>Actions</th></tr>';

//Adds the number of rows and shelves in DB maps to the drop down menus
function setShelvesRows(rowDropDown, shelfDropDown) {
	database.ref('/maps/' + 'test_map').once('value').then(function(snapshot) {
		var rows = snapshot.val().rows;
		var shelves = snapshot.val().shelves;

		for (var i = 1; i<=rows; i++){
		    var opt = document.createElement('option');
		    opt.value = i;
		    opt.innerHTML = i;
		    rowDropDown.appendChild(opt);
		}
		for (var i = 1; i<=shelves; i++){
		    var opt = document.createElement('option');
		    opt.value = i;
		    opt.innerHTML = i;
		    shelfDropDown.appendChild(opt);
		}
	});	
}

function movePackage(key) {
	//Create dropdown for rows
	var rowTd = document.getElementById('rowTd' + key);
	var currentRow = rowTd.innerHTML;
	currentRow = parseInt(currentRow, 10);
	rowTd.innerHTML = '<select id="selectRow' + key + '" name="Select row"></select>'
	rowDropDown = document.getElementById('selectRow' + key);

	//Create dropdown for shelves
	var shelfTd = document.getElementById('shelfTd' + key);
	var currentShelf = shelfTd.innerHTML;
	currentShelf = parseInt(currentShelf, 10);
	shelfTd.innerHTML = '<select id="selectShelf' + key + '" name="Select shelf"></select>'
	shelfDropDown = document.getElementById('selectShelf' + key);

	//Load number of rows and shelves from the DB
	setShelvesRows(rowDropDown, shelfDropDown);
	
	//TODO set selected value to the current value



	//Remove buttons and add Confirm button
	var buttonsTd = document.getElementById('actions' + key);
	buttonsTd.innerHTML = '<button onClick="updatePosition(' + "'" + key +  "'" + ')">Confirm</button><button onClick="showPackage(' + currentRow + ',' + currentShelf +')">Cancel</button>';
	
	
}
function cancelPosition(row, shelf) {
	showPackage(row, shelf);
}

function updatePosition(key) {
	row = document.getElementById('selectRow' + key).value;
	shelf = document.getElementById('selectShelf' + key).value;
    row = parseInt(row, 10);
    shelf = parseInt(shelf, 10);
	database.ref('warehouse/' + key).update( {
		row: row,
		shelf: shelf,
		stored: false
	});
	showPackage(row, shelf);
}

function findPackage(row, shelf) {
	refWarehouse.orderByChild("row").equalTo(row).on("child_added", function(snapshot) {	
		if (snapshot.val().shelf == shelf) {
			return true;
		}
	});
}

