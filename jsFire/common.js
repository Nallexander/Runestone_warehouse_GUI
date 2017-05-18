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

//Generate a table entry from the database entry
function generateTableEntry(databaseEntry) {
	return '<tr data-key="' + databaseEntry.key + '"><td>' + databaseEntry.key + '</td><td>' + databaseEntry.packageName + '</td><td>' + databaseEntry.temperature + '</td><td>' + databaseEntry.light + '</td><td>' + databaseEntry.row + '</td><td>' + databaseEntry.shelf + '</td><td><button onclick="deleteFromFB(' + "'" + databaseEntry.key + "'" + ')">Remove</button><button onclick="editFB(' + "'" + databaseEntry.key + "'" + ')">Edit</button></tr>';
}

//Table header
var tableHeader = '<tr><th onclick="sortTable(0)">Package ID</th><th onclick="sortTable(1)">Package Name</th><th onclick="sortTable(2)">Temperature</th><th onclick="sortTable(3)">Light</th><th>Row</th><th>Shelf</th><th>Actions</th></tr>';