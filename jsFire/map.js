var warehouse_map = new Firebase('https://runestone-d1faf.firebaseio.com/maps');



warehouse_map.on("value", function(snapshot) {
    var data = snapshot.val();
    var map = "test_map"
    var rows = data[map].rows;
    var shelves = data[map].shelves;
	draw_warehouse(rows, shelves);
});

var mapWidth = 800;
var mapHeight = 500;
var lineWidth = 12

var map_canvas = document.getElementById("mapCanvas");
map_canvas.width = mapWidth;
map_canvas.height = mapHeight;

function draw_warehouse(rows, shelves) {
	var noOfVerticalLines = rows + 1;
	var	noOfHorizontalLines = shelves + 1;
	draw_vertical_road(noOfVerticalLines, lineWidth/2);
	draw_vertical_road(noOfVerticalLines, mapWidth - (lineWidth/2));

	for (var i = 1; i < noOfVerticalLines; i++) {
		draw_horizontal_road(noOfHorizontalLines, ((mapHeight/noOfVerticalLines)*i) - (lineWidth/2));
	}
	draw_line(0, mapHeight-(lineWidth/2), mapWidth, mapHeight-(lineWidth/2), false);		
	draw_line(0, 0+(lineWidth/2), mapWidth, 0+(lineWidth/2), false);		


}

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

function draw_horizontal_road(noOfLines, yPos) {
	draw_line(0, yPos, (mapWidth/noOfLines), yPos, false);	
	for (i = 1; i <= noOfLines; i++) {
		draw_line((mapWidth/noOfLines)*i - lineWidth,
		yPos,
		(mapWidth/noOfLines) * (i+1),
		yPos,
		false);	
	}
}
	

function draw_line(xStart, yStart, xEnd, yEnd, vertical) {
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
		ctx.fillRect(xEnd-12, yEnd-6, 12, 12);
	}
	ctx.stroke();
}



