
//Draw warehouse according to the database entry test_map
refMap.on("value", function(snapshot) {
    var data = snapshot.val();
    var map = "test_map"
    var rows = data[map].rows;
    var shelves = data[map].shelves;
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
	for (var i = 1; i <= rows+1; i++) {
		rects.push([[]])
	}
	
	var noOfVerticalLines = rows + 1;
	var	noOfHorizontalLines = shelves + 1;
	//Draw the two vertical roads
	draw_vertical_road(noOfVerticalLines, lineWidth/2);
	draw_vertical_road(noOfVerticalLines, mapWidth - (lineWidth/2));

	//Draw the horizontal roads with shelves
	for (var i = 1; i < noOfVerticalLines; i++) {
		draw_horizontal_road(noOfHorizontalLines, ((mapHeight/noOfVerticalLines)*i) - (lineWidth/2), i);
	}
	//Draw the bottom horizontal road
	draw_line(0, mapHeight-(lineWidth/2), mapWidth, mapHeight-(lineWidth/2), false, -1);		
	//Draw the top horizontal road
	draw_line(0, 0+(lineWidth/2), mapWidth, 0+(lineWidth/2), false, -1);		
}

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

//Draws a horizontal road made up of lines with intersections at each end
function draw_horizontal_road(noOfLines, yPos, lineNo) {
	draw_line(0, yPos, (mapWidth/noOfLines), yPos, false, lineNo);	
	for (i = 1; i <= noOfLines; i++) {
		draw_line((mapWidth/noOfLines)*i - lineWidth,
		yPos,
		(mapWidth/noOfLines) * (i+1),
		yPos,
		false,
		lineNo);	
	}
}

//Draws a rect and also registers it to the list of clickable rects
function fillRegisterRect(ctx, x, y, width, height, lineNo) {
	ctx.fillRect(x, y, width, height);
	if (lineNo > -1) {
		rects[lineNo].push([x,y,width,height]);
	}
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
		console.log(snapshot.val().row);
		console.log(snapshot.val().shelf);		
		if (snapshot.val().shelf == shelf) {
			packageName = snapshot.val().packageName;
			key = snapshot.key;
			console.log(key);
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
			newTableHeader = tableHeader + "\n Sorry, no package here.";
		    document.getElementById('warehouseTableMap').innerHTML = newTableHeader;
		}
    });	
}



//Draws a line with three colors (blue, black and green) with squares in the beginning and end
function draw_line(xStart, yStart, xEnd, yEnd, vertical, lineNo) {
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
		ctx.fillRect(xStart, yStart-6, 12, 12);
		fillRegisterRect(ctx, xEnd-12, yEnd-6, 12, 12, lineNo);
	}
	ctx.stroke();
}