var warehouse = new Firebase('https://runestone-d1faf.firebaseio.com/warehouse');

function pressEnter(event) {
    if (event.which == 13 || event.keyCode == 13) {
		saveToList(event);    
	}
}
 
function saveToList(event) {
    var packageID = document.getElementById('packageID').value.trim();
    var packageName = document.getElementById('packageName').value.trim();
    var shelfCode = document.getElementById('shelfCode').value.trim();
    var temperature = document.getElementById('temperature').value.trim();
    var light = document.getElementById('light').value.trim();
    
    if (packageID.length <= 0) {
	    document.getElementById('packageID').placeholder = "Please enter package ID";	    
    }
	if (shelfCode.length <= 0) {
	    document.getElementById('shelfCode').placeholder = "Please enter shelf code";	    
	}
	else if (packageID.length > 0) {
        saveToFB(packageID, packageName, shelfCode, temperature, light);
        var inputWareFields = document.getElementsByClassName('inputWare');
		var i;
		for (i = 0; i < inputWareFields.length; i++) {
	    	inputWareFields[i].value = '';
	    }
    }
    return false;
};
 
function saveToFB(packageID, packageName, shelfCode, temperature, light) {
    // this will save data to Firebase
    warehouse.push({
        packageName: packageName,
        packageID: packageID,
        shelfCode: shelfCode,
        temperature: temperature,
        light: light,
        stored: false
    });
};
 
 
function editFB(key) {
	
}
 
function deleteFromFB(key) {
	warehouse.child(key).remove();
	}

function refreshUI(list) {
    var lis = '<tr><th onclick="sortTable(0)">Package ID</th><th onclick="sortTable(1)">Package Name</th><th onclick="sortTable(2)">Shelf Code</th><th onclick="sortTable(3)">Temperature</th><th onclick="sortTable()">Light</th><th>Actions</th></tr>';
    for (var i = 0; i < list.length; i++) {
        lis += '<tr data-key="' + list[i].key + '"><td>' + list[i].packageID + '</td><td>' + list[i].packageName + '</td><td>' + list[i].shelfCode + '</td><td>' + list[i].temperature + '</td><td>' + list[i].light + '</td><td><button onclick="deleteFromFB(' + "'" + list[i].key + "'" + ')">Remove</button><button onclick="editFB(' + "'" + list[i].key + "'" + ')">Edit</button></tr>';
    };
    document.getElementById('warehouseTable').innerHTML = lis;
};
 
// this will get fired on inital load as well as when ever there is a change in the data
warehouse.on("value", function(snapshot) {
    var data = snapshot.val();
    var list = [];
    for (var key in data) {
        if (data.hasOwnProperty(key)) {
            packageName = data[key].packageName ? data[key].packageName : '';
            packageID = data[key].packageID ? data[key].packageID : '';
            shelfCode = data[key].shelfCode ? data[key].shelfCode : '';
            temperature = data[key].temperature ? data[key].temperature : '';
            light = data[key].light ? data[key].light : '';                        
            list.push({
                packageName: packageName,
                key: key,
                packageID: packageID,
                shelfCode: shelfCode,
                temperature: temperature,
                light: light
            })
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