//Check for an Enter press and try to save data if it happens
function pressEnter(event) {
    if (event.which == 13 || event.keyCode == 13) {
		saveToList();    
	}
}
 
 //Checks if values are valid (Package ID is not empty and a row and shelf is chosen). If they are, it saves the values to the DB, if they're not, it displays an error message
function saveToList() {
	//Get input values
    var packageID = document.getElementById('packageID').value.trim();
    var packageName = document.getElementById('packageName').value.trim();
    var temperature = document.getElementById('temperature').value.trim();
    var light = document.getElementById('light').value.trim();
    var selectShelf = document.getElementById('selectShelf');
    var selectRow = document.getElementById('selectRow');
    var shelf = selectShelf.options[selectShelf.selectedIndex].value;
    var row = selectRow.options[selectRow.selectedIndex].value;
    
    document.getElementById('errorMessage').innerHTML = "";
    
    //IF package ID is not entered
    if (packageID.length <= 0) {
	    document.getElementById('errorMessage').innerHTML += "Please enter package ID <br \>";
	}
	//If row and shelf are not chosen
	if (row == 'default' || shelf == 'default') {
		document.getElementById('errorMessage').innerHTML += "Please choose a row and a shelf. <br \>";
	}	    
	else if (packageID.length > 0) {
		//Save values 
        saveToFB(packageID, packageName, temperature, light, row, shelf);
        //Empty input fields
        var inputWareFields = document.getElementsByClassName('inputWare');
		var i;
		for (i = 0; i < inputWareFields.length; i++) {
	    	inputWareFields[i].value = '';
	    }
	    //Set drop-downs to default
	    selectShelf.selectedIndex=0;
	    selectRow.selectedIndex=0;	    
    }
    return false;
};

 //Saves arguments to DB warehouse
function saveToFB(packageID, packageName, temperature, light, row, shelf) {
    // this will save data to Firebase
    row = parseInt(row, 10);
    shelf = parseInt(shelf, 10);
    database.ref('warehouse/' + packageID).set( {
        packageName: packageName,
        temperature: temperature,
        light: light,
        stored: false,
        row: row,
        shelf: shelf
    });
};

//Deletes key from DB
function deleteFromFB(key) {
	refWarehouse.child(key).remove();
}
	

setShelvesRows(document.getElementById('selectRow'), document.getElementById('selectShelf'));

//Load elements in list to ID warehouseTable
function refreshUI(list) {
	newTableHeader = tableHeader;
    for (var i = 0; i < list.length; i++) {
        newTableHeader += generateTableEntry(list[i]);
    };
    document.getElementById('warehouseTable').innerHTML = newTableHeader;
};
 
 //add the entries from data index key in list
function addToList(data, key, list) {
    packageName = data[key].packageName ? data[key].packageName : '';
    packageID = data[key].packageID ? data[key].packageID : '';
    temperature = data[key].temperature ? data[key].temperature : '';
    light = data[key].light ? data[key].light : '';                       
    shelf = data[key].shelf;
    row = data[key].row;
    list.push({
        packageName: packageName,
        key: key,
        packageID: packageID,
        temperature: temperature,
        light: light,
        shelf: shelf,
        row: row
    })	
}

//From http://thejackalofjavascript.com/getting-started-with-firebase/
// this will get fired on inital load as well as when ever there is a change in the data
refWarehouse.on("value", function(snapshot) {
    var data = snapshot.val();
    var list = [];
    for (var key in data) {
        if (data.hasOwnProperty(key)) {
			addToList(data, key, list);
        }
    }
    // refresh the UI
    refreshUI(list);
    
});

/**
	From https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_sort_table_desc
**/
function sortTable(n) {
  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  table = document.getElementById("warehouseTable");
  switching = true;
  //Set the sorting direction to ascending:
  dir = "asc"; 
  /*Make a loop that will continue until
  no switching has been done:*/
  while (switching) {
    //start by saying: no switching is done:
    switching = false;
    rows = table.getElementsByTagName("TR");
    /*Loop through all table rows (except the
    first, which contains table headers):*/
    for (i = 1; i < (rows.length - 1); i++) {
      //start by saying there should be no switching:
      shouldSwitch = false;
      /*Get the two elements you want to compare,
      one from current row and one from the next:*/
      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];
      /*check if the two rows should switch place,
      based on the direction, asc or desc:*/
      if (dir == "asc") {
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          //if so, mark as a switch and break the loop:
          shouldSwitch= true;
          break;
        }
      } else if (dir == "desc") {
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          //if so, mark as a switch and break the loop:
          shouldSwitch= true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      /*If a switch has been marked, make the switch
      and mark that a switch has been done:*/
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      //Each time a switch is done, increase this count by 1:
      switchcount ++;      
    } else {
      /*If no switching has been done AND the direction is "asc",
      set the direction to "desc" and run the while loop again.*/
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}