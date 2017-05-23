var shelves;
//Draw warehouse according to the database entry test_map
refMap.on("value", function(snapshot) {
    var data = snapshot.val();
    var map = "test_map"
    var rows = data[map].rows;
    shelves = data[map].shelves;
	draw_warehouse(rows, shelves);
});

//Dimensions for the map
var mapWidth = 800;
var mapHeight = 500;
var lineWidth = 12

//Used for click events on the red intersections
var rects = [];

//Initialize canvas to draw the map on
var map_canvas = document.getElementById("mapCanvas");
map_canvas.width = mapWidth;
map_canvas.height = mapHeight;


//Draws the warehouse
function draw_warehouse(rows, shelves) {
	//Create empty arrays for storing rects in. The first of each row is initialized to empty since it should not be used
	for (var i = 0; i <= rows; i++) {
		rects.push([]);
			for (var j = 1; j <= shelves+1; j++) {		
				rects[i].push([]);
			}
	}
	
	var noOfVerticalLines = rows;
	var	noOfHorizontalLines = shelves + 1;
	//Draw the two vertical roads
	draw_vertical_road(noOfVerticalLines, lineWidth/2);
	draw_vertical_road(noOfVerticalLines, mapWidth - (lineWidth/2));

	//Draw the horizontal roads with shelves
	for (var i = 1; i < noOfVerticalLines+1; i++) {
		draw_horizontal_road(noOfHorizontalLines, ((mapHeight/noOfVerticalLines)*i) - (lineWidth/2), i);
	}
	//Draw the top horizontal road
 	draw_horizontal_road(2, (lineWidth/2), 0);
 	
 	//Move rect (0,3) to (0,1) and (0,2) to (0,0)
 	rects[0][1] = rects[0][3];
 	rects[0][3] = [];
 	rects[0][0] = rects[0][2];
  	rects[0][2] = [];


}

//Draws a horizontal road made up of lines with intersections at each end
function draw_horizontal_road(noOfLines, yPos, lineNo) {
	draw_line(0, yPos, (mapWidth/noOfLines), yPos, false, lineNo, false, 0);	
	for (i = 1; i <= noOfLines; i++) {
		lastLine = false;
		if (i == noOfLines - 1) {
			lastLine = true;
		}
		draw_line((mapWidth/noOfLines)*i - lineWidth,
		yPos,
		(mapWidth/noOfLines) * (i+1),
		yPos,
		false,
		lineNo,
		lastLine,
		i);	
	}
}

refRobots.on("value", function(snapshot) {
    var data = snapshot.val();
    var list = [];
    for (var key in data) {
        if (data.hasOwnProperty(key)) {
			shelf = data[key].shelf;
			row = data[key].row;
        }
    }
    // display robot 
    displayRobot(row, shelf);
    
    console.log("Robot drawn row: " + row + " shelf: " + shelf);
});

//Draws a vertical road made up of lines with intersections at each end
function draw_vertical_road(noOfLines, xPos) {
	draw_line(xPos, 0, xPos, (mapHeight/noOfLines), true);		
	for (var i = 1; i <= noOfLines; i++) {
		draw_line(xPos,
		(mapHeight/noOfLines)*i - lineWidth,
		xPos,
		(mapHeight/noOfLines) * (i+1),
		true);	
	}
}


var previousRow, previousShelf;

function displayRobot(row, shelf) {
	var x = rects[row][shelf][0];
	var y = rects[row][shelf][1];
	var ctx=map_canvas.getContext("2d");
    var img = document.getElementById("robotImg");
    ctx.drawImage(img, x,y);
	if(typeof previousRow !== "undefined") {
		console.log("defined");
		ctx.fillStyle = "#FF0000"
		previousX = rects[previousRow][previousShelf][0];
		previousY = rects[previousRow][previousShelf][1];
		console.log("previous x: " + previousX + " previous y: " + previousY);
		ctx.fillRect(previousX, previousY, 12, 12);	
	}
    previousRow = row;
    previousShelf = shelf;  
}



//Draws a rect and also registers it to the list of clickable rects
function fillRegisterRect(ctx, x, y, width, height, lineNo, shelfNo) {
	ctx.fillRect(x, y, width, height);
	console.log(shelfNo);
	if (lineNo > -1) {
		var rectRow = rects[lineNo];
		rectRow[shelves - shelfNo] = [x,y,width,height];
		

	}
}

//Prints the coordinates of the intersection above the intersection
function printPosition(ctx, x, y, lineNo, shelfNo) {
		//Print text
		ctx.font = "10px Arial";
		ctx.fillStyle = "black";
		ctx.fillText('('+ (shelves - shelfNo) +','+lineNo+')', x-5,y-15);
}

/* From: http://stackoverflow.com/questions/6452791/interacting-with-canvas-rectangle */
$('#mapCanvas').click(function(e) {
    var x = e.offsetX,
        y = e.offsetY;
	for (var j = 0; j < rects.length; j++) {
	    for(var i=0;i<rects[j].length;i++) { // check whether:
	        if(x > rects[j][i][0]            // mouse x between x and x + width
	        && x < rects[j][i][0] + rects[j][i][2]
	        && y > rects[j][i][1]            // mouse y between y and y + height
	        && y < rects[j][i][1] + rects[j][i][3]) {
		        console.log("Clicked x: " + j + " y: " + i);
   				showPackage(j, i);
	        }  
    	}
    }
});



//Displays a package in the table if it is located in row row and shelf shelf. Otherwise, displays an error message 
function showPackage(row, shelf) {
    tableMap = document.getElementById('warehouseTableMap').innerHTML;
    var foundPackage = false;
	refWarehouse.orderByChild("row").equalTo(row).on("child_added", function(snapshot) {
		if (snapshot.val().shelf == shelf) {
			console.log("Found package");
			packageName = snapshot.val().packageName;
			key = snapshot.key;
			shelfCode = snapshot.val().shelfCode;
			temperature = snapshot.val().temperature;
			light = snapshot.val().light;
			row = snapshot.val().row;
			shelf = snapshot.val().shelf;
			package = {
		        packageName: packageName,
		        key: key,
		        shelfCode: shelfCode,
		        temperature: temperature,
		        light: light,
		        shelf: shelf,
		        row: row
		        };
		    newTableHeader = tableHeader;
		    newTableHeader += generateTableEntry(package);
		    document.getElementById('warehouseTableMap').innerHTML = newTableHeader;
		    foundPackage = true;
		}
		else if (!foundPackage) {
			console.log("Did not find package");
			newTableHeader = tableHeader + 
			"<td>Sorry, no package here.</td><td></td><td></td><td></td><td>"+row+"</td><td>"+shelf+"</td><td></td>";
		    document.getElementById('warehouseTableMap').innerHTML = newTableHeader;
		}
    });	
}



//Draws a line with three colors (blue, black and green) with squares in the beginning and end
function draw_line(xStart, yStart, xEnd, yEnd, vertical, lineNo, lastLine, shelfNo) {
	var ctx=map_canvas.getContext("2d");
	ctx.beginPath();
	ctx.lineWidth = lineWidth/3;
	ctx.strokeStyle = "#000000"
	ctx.moveTo(xStart, yStart);
	ctx.lineTo(xEnd, yEnd);
	ctx.stroke();
	ctx.closePath();
	
	ctx.beginPath();
	ctx.strokeStyle = "#0000FF"
	if (vertical) {
		ctx.moveTo(xStart-4, yStart);
		ctx.lineTo(xEnd-4, yEnd);		
	}
	else {
		ctx.moveTo(xStart, yStart-4);
		ctx.lineTo(xEnd, yEnd-4);	
	}

	ctx.stroke();
	ctx.closePath();

	ctx.beginPath();
	ctx.strokeStyle = "#00FF00"
	if (vertical) {
		ctx.moveTo(xStart+4, yStart);
		ctx.lineTo(xEnd+4, yEnd);
	}
	else {
		ctx.moveTo(xStart, yStart+4);
		ctx.lineTo(xEnd, yEnd+4);	
	}
	ctx.stroke();
	ctx.closePath();

	ctx.beginPath();	
	ctx.lineWidth = 1;
	ctx.fillStyle = "#FF0000"
	if (vertical) {
		ctx.fillRect(xStart-6, yStart, 12, 12);
		ctx.fillRect(xEnd-6, yEnd-12, 12, 12);
	}
	else {
		//Register rect for first line
		if (shelfNo != 0) {
			ctx.fillRect(xStart, yStart-6, 12, 12);			
		}
		else {
			// -1 in order for register it as (11, y)
			fillRegisterRect(ctx, xStart, yStart-6, 12, 12, lineNo, shelfNo-1);
		}

		if (!lastLine) {
			printPosition(ctx, xEnd-12, yEnd-6, lineNo, shelfNo);
		}
			fillRegisterRect(ctx, xEnd-12, yEnd-6, 12, 12, lineNo, shelfNo);
	}
	ctx.stroke();
}