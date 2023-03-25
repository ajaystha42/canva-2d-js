// Create a new stage
var stage = new Konva.Stage({
  container: "stage-container",
  width: 500,
  height: 500,
});

// Create a new layer for the stage
var layer = new Konva.Layer();
stage.add(layer);

// Create a new group to hold the draggable text and label
var draggableGroup = new Konva.Group({
  x: 50,
  y: 50,
});
layer.add(draggableGroup);

// Create a draggable text element and add it to the group
var draggableText = new Konva.Text({
  x: 0,
  y: 0,
  text: "Draggable Text",
  draggable: true,
  name: "draggableText",
});
draggableGroup.add(draggableText);

// Create a draggable label element and add it to the group
var draggableLabel = new Konva.Label({
  x: 0,
  y: 50,
  draggable: true,
  name: "draggableLabel",
});
draggableGroup.add(draggableLabel);

var draggableLabelText = new Konva.Text({
  text: "Draggable Label",
  fill: "black",
});
draggableLabel.add(draggableLabelText);

// Add event listeners to the draggable elements
var draggables = document.querySelectorAll(".draggable");
draggables.forEach(function (draggable) {
  draggable.addEventListener("dragstart", function (event) {
    // Set the data type of the dragged element
    event.dataTransfer.setData("text/plain", draggable.dataset.type);
  });
});

// Add a dragover event listener to the stage container to allow dropping elements onto the stage
var stageContainer = document.getElementById("stage-container");
stageContainer.addEventListener("dragover", function (event) {
  event.preventDefault();
});

// Add a drop event listener to the stage container to handle dropping elements onto the stage
stageContainer.addEventListener("drop", function (event) {
  event.preventDefault();

  // Get the data type of the dropped element
  var dataType = event.dataTransfer.getData("text/plain");

  // Create a new element on the stage based on the data type
  if (dataType === "text") {
    var text = new Konva.Text({
      x: event.offsetX,
      y: event.offsetY,
      text: "New Text",
    });
    layer.add(text);
  } else if (dataType === "label") {
    var label = new Konva.Label({
      x: event.offsetX,
      y: event.offsetY,
    });
    layer.add(label);

    var labelText = new Konva.Text({
      text: "New Label",
      fill: "black",
    });
    label.add(labelText);
  }

  // Remove the dragged element from the draggable container
  // Remove the dragged element from the draggable container
  var draggedElement = event.target;
  draggableContainer.removeChild(draggedElement);

  // Get the position of the drop event relative to the stage
  var dropPosition = stage.getPointerPosition();

  // Create a new Konva shape based on the dragged element
  var newShape;
  if (draggedElement.className === "textbox") {
    newShape = new Konva.Rect({
      x: dropPosition.x,
      y: dropPosition.y,
      width: 100,
      height: 50,
      fill: "white",
      stroke: "black",
      strokeWidth: 1,
    });
  } else if (draggedElement.className === "label") {
    newShape = new Konva.Text({
      x: dropPosition.x,
      y: dropPosition.y,
      text: "New Label",
      fontSize: 14,
      fontFamily: "Arial",
      fill: "black",
    });
  }

  // Add the new shape to the draggable layer and draw the layer
  draggableLayer.add(newShape);
  draggableLayer.draw();
});
