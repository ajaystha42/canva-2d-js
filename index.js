var width = window.innerWidth;
var height = 400;
var input = document.getElementById("myInput");
var button = document.getElementById("myButton");
var text = document.getElementById("myText");
var MAX_WIDTH = window.innerWidth;

input.addEventListener("dragstart", function (event) {
  event.dataTransfer.setData("text/plain", "input");
});

button.addEventListener("dragstart", function (event) {
  event.dataTransfer.setData("text/plain", "button");
});

text.addEventListener("dragstart", function (event) {
  event.dataTransfer.setData("text/plain", "text");
});

// create stage
var stage = new Konva.Stage({
  container: "container",
  width: width,
  height: height,
});
var layer = new Konva.Layer();

var complexText = new Konva.Text({
  x: 20,
  y: 60,
  text: "Fusemachines\n\nNew York, USA",
  fontSize: 18,
  fontFamily: "Calibri",
  fill: "#555",
  width: 300,
  padding: 20,
  align: "center",
});

var rect1 = new Konva.Rect({
  x: 20,
  y: 60,
  stroke: "#555",
  strokeWidth: 5,
  fill: "#ddd",
  width: 300,
  height: complexText.height(),
  shadowColor: "black",
  shadowBlur: 10,
  shadowOffsetX: 10,
  shadowOffsetY: 10,
  shadowOpacity: 0.2,
  cornerRadius: 10,
});
layer.add(rect1);
layer.add(complexText);
stage.add(layer);

var con = document.getElementById("container");

con.addEventListener("dragover", function (e) {
  e.preventDefault();
});

con.addEventListener("drop", function (e) {
  e.preventDefault();
  stage.setPointersPositions(e);
  var type = e.dataTransfer.getData("text/plain");
  var textNode = "";
  var inputBox = "";
  var cssCodeEl = document.querySelector("#css-code");
  var cssCode = "";
  if (type == "input") {
    inputBox = new Konva.Rect({
      x: stage.getPointerPosition().x,
      y: stage.getPointerPosition().y,
      width: 200,
      height: 50,
      fill: "#fff",
      stroke: "black",
      strokeWidth: 2,
      draggable: true,
    });
    layer.add(inputBox);
    var inputTr = new Konva.Transformer({
      boundBoxFunc: function (oldBoundBox, newBoundBox) {
        if (Math.abs(newBoundBox.width) > MAX_WIDTH) {
          return oldBoundBox;
        }

        return newBoundBox;
      },
    });
    layer.add(inputTr);
    stage.on("click", function (e) {
      if (e.target === stage) {
        inputTr.hide();
        layer.draw();
        cssCodeEl.style.display = "none";
        cssCode = "";
        cssCodeEl.textContent = cssCode;
      }
    });
    inputBox.on("click", function () {
      inputTr.nodes([inputBox]);
      layer.add(inputTr);
      inputTr.show();
    });
    document.addEventListener("keydown", function (event) {
      if (
        event.keyCode === 46 ||
        event.key === "Delete" ||
        event.key === "Backspace"
      ) {
        var selectedNode = inputTr.nodes()[0];
        if (selectedNode) {
          inputBox.hide();
          inputTr.hide();
          cssCodeEl.style.display = "none";
          cssCode = "";
          cssCodeEl.textContent = cssCode;
        }
      }
    });

    inputTr.on("transform", function () {
      var scaleX = inputBox.scaleX();
      var scaleY = inputBox.scaleY();

      cssCode = `
      .${inputBox.name()} {
        width: ${inputBox.width() * scaleX}px;
        height: ${inputBox.height() * scaleY}px;
        margin-top: ${inputBox.y()}px;
        margin-left: ${inputBox.x()}px;
        margin-bottom: ${stage.height() - inputBox.y() - inputBox.height()}px;
        margin-right: ${stage.width() - inputBox.x() - inputBox.width()}px;
        padding-top: ${stage.height() - inputBox.y() - inputBox.height()}px;
        padding-left: ${stage.width() - inputBox.x() - inputBox.width()}px;
        padding-bottom: ${inputBox.y()}px;
        padding-right: ${inputBox.x()}px;
        border-width: ${inputBox.strokeWidth()}px;
        border-color: ${inputBox.stroke()};
        background-color: ${inputBox.fill()};
      }
      `;

      cssCodeEl.style.display = "block";
      cssCodeEl.textContent = cssCode;
      cssCodeEl.style.whiteSpace = "pre-line";
    });

    inputBox.on("dragmove", function () {
      var scaleX = inputBox.scaleX();
      var scaleY = inputBox.scaleY();
      cssCode = `
      .${inputBox.name()} {
        width: ${inputBox.width() * scaleX}px;
        height: ${inputBox.height() * scaleY}px;
        margin-top: ${inputBox.y()}px;
        margin-left: ${inputBox.x()}px;
        margin-bottom: ${stage.height() - inputBox.y() - inputBox.height()}px;
        margin-right: ${stage.width() - inputBox.x() - inputBox.width()}px;
        padding-top: ${stage.height() - inputBox.y() - inputBox.height()}px;
        padding-left: ${stage.width() - inputBox.x() - inputBox.width()}px;
        padding-bottom: ${inputBox.y()}px;
        padding-right: ${inputBox.x()}px;
        border-width: ${inputBox.strokeWidth()}px;
        border-color: ${inputBox.stroke()};
        background-color: ${inputBox.fill()};
      }
      `;
      cssCodeEl.style.display = "block";

      cssCodeEl.textContent = cssCode;
      cssCodeEl.style.whiteSpace = "pre-line";
    });
    inputBox.on("click", function () {
      var scaleX = inputBox.scaleX();
      var scaleY = inputBox.scaleY();
      cssCode = `
      .${inputBox.name()} {
        width: ${inputBox.width() * scaleX}px;
        height: ${inputBox.height() * scaleY}px;
        margin-top: ${inputBox.y()}px;
        margin-left: ${inputBox.x()}px;
        margin-bottom: ${stage.height() - inputBox.y() - inputBox.height()}px;
        margin-right: ${stage.width() - inputBox.x() - inputBox.width()}px;
        padding-top: ${stage.height() - inputBox.y() - inputBox.height()}px;
        padding-left: ${stage.width() - inputBox.x() - inputBox.width()}px;
        padding-bottom: ${inputBox.y()}px;
        padding-right: ${inputBox.x()}px;
        border-width: ${inputBox.strokeWidth()}px;
        border-color: ${inputBox.stroke()};
        background-color: ${inputBox.fill()};
      }
      `;
      cssCodeEl.style.display = "block";

      cssCodeEl.textContent = cssCode;
      cssCodeEl.style.whiteSpace = "pre-line";
    });
  } else if (type == "button") {
    inputBox = new Konva.Rect({
      x: stage.getPointerPosition().x,
      y: stage.getPointerPosition().y,
      width: 150,
      height: 30,
      fill: "#90EE90",
      stroke: "blue",
      strokeWidth: 2,
      draggable: true,
    });
    layer.add(inputBox);
    var inputTr = new Konva.Transformer({
      boundBoxFunc: function (oldBoundBox, newBoundBox) {
        if (Math.abs(newBoundBox.width) > MAX_WIDTH) {
          return oldBoundBox;
        }

        return newBoundBox;
      },
    });
    layer.add(inputTr);
    stage.on("click", function (e) {
      if (e.target === stage) {
        inputTr.hide();
        layer.draw();
        cssCodeEl.style.display = "none";
        cssCode = "";
        cssCodeEl.textContent = cssCode;
      }
    });
    inputBox.on("click", function () {
      inputTr.nodes([inputBox]);
      layer.add(inputTr);
      inputTr.show();
    });
    document.addEventListener("keydown", function (event) {
      if (
        event.keyCode === 46 ||
        event.key === "Delete" ||
        event.key === "Backspace"
      ) {
        var selectedNode = inputTr.nodes()[0];
        if (selectedNode) {
          inputBox.hide();
          inputTr.hide();
          cssCodeEl.style.display = "none";
          cssCode = "";
          cssCodeEl.textContent = cssCode;
        }
      }
    });

    inputTr.on("transform", function () {
      var scaleX = inputBox.scaleX();
      var scaleY = inputBox.scaleY();

      cssCode = `
      .${inputBox.name()} {
        width: ${inputBox.width() * scaleX}px;
        height: ${inputBox.height() * scaleY}px;
        margin-top: ${inputBox.y()}px;
        margin-left: ${inputBox.x()}px;
        margin-bottom: ${stage.height() - inputBox.y() - inputBox.height()}px;
        margin-right: ${stage.width() - inputBox.x() - inputBox.width()}px;
        padding-top: ${stage.height() - inputBox.y() - inputBox.height()}px;
        padding-left: ${stage.width() - inputBox.x() - inputBox.width()}px;
        padding-bottom: ${inputBox.y()}px;
        padding-right: ${inputBox.x()}px;
        border-width: ${inputBox.strokeWidth()}px;
        border-color: ${inputBox.stroke()};
        background-color: ${inputBox.fill()};
      }
      `;

      cssCodeEl.style.display = "block";
      cssCodeEl.textContent = cssCode;
      cssCodeEl.style.whiteSpace = "pre-line";
    });

    inputBox.on("dragmove", function () {
      var scaleX = inputBox.scaleX();
      var scaleY = inputBox.scaleY();
      cssCode = `
      .${inputBox.name()} {
        width: ${inputBox.width() * scaleX}px;
        height: ${inputBox.height() * scaleY}px;
        margin-top: ${inputBox.y()}px;
        margin-left: ${inputBox.x()}px;
        margin-bottom: ${stage.height() - inputBox.y() - inputBox.height()}px;
        margin-right: ${stage.width() - inputBox.x() - inputBox.width()}px;
        padding-top: ${stage.height() - inputBox.y() - inputBox.height()}px;
        padding-left: ${stage.width() - inputBox.x() - inputBox.width()}px;
        padding-bottom: ${inputBox.y()}px;
        padding-right: ${inputBox.x()}px;
        border-width: ${inputBox.strokeWidth()}px;
        border-color: ${inputBox.stroke()};
        background-color: ${inputBox.fill()};
      }
      `;
      cssCodeEl.style.display = "block";

      cssCodeEl.textContent = cssCode;
      cssCodeEl.style.whiteSpace = "pre-line";
    });
    inputBox.on("click", function () {
      var scaleX = inputBox.scaleX();
      var scaleY = inputBox.scaleY();
      cssCode = `
      .${inputBox.name()} {
        width: ${inputBox.width() * scaleX}px;
        height: ${inputBox.height() * scaleY}px;
        margin-top: ${inputBox.y()}px;
        margin-left: ${inputBox.x()}px;
        margin-bottom: ${stage.height() - inputBox.y() - inputBox.height()}px;
        margin-right: ${stage.width() - inputBox.x() - inputBox.width()}px;
        padding-top: ${stage.height() - inputBox.y() - inputBox.height()}px;
        padding-left: ${stage.width() - inputBox.x() - inputBox.width()}px;
        padding-bottom: ${inputBox.y()}px;
        padding-right: ${inputBox.x()}px;
        border-width: ${inputBox.strokeWidth()}px;
        border-color: ${inputBox.stroke()};
        background-color: ${inputBox.fill()};
      }
      `;
      cssCodeEl.style.display = "block";

      cssCodeEl.textContent = cssCode;
      cssCodeEl.style.whiteSpace = "pre-line";
    });
  } else {
    textNode = new Konva.Text({
      x: stage.getPointerPosition().x,
      y: stage.getPointerPosition().y,
      text: "text",
      fontSize: 18,
      fill: "black",
      draggable: true,
    });
    layer.add(textNode);
    textNode.moveToTop();

    var textNodeTr = new Konva.Transformer({
      node: textNode,
      enabledAnchors: ["middle-left", "middle-right"],
      // set minimum width of text
      boundBoxFunc: function (oldBox, newBox) {
        newBox.width = Math.max(30, newBox.width);
        return newBox;
      },
    });
    stage.on("click", function (e) {
      // check if clicked on empty space
      if (e.target === stage) {
        textNodeTr.hide();
        layer.draw();
      }
    });

    textNodeTr.on("transform", function () {
      // textNode.setAttrs({
      //   width: textNode.width() * textNode.scaleX(),
      //   scaleX: 1,
      // });

      var scaleX = textNode.scaleX();
      var scaleY = textNode.scaleY();

      cssCode = `
      .${textNode.name()} {
        width: ${textNode.width() * scaleX}px;
        height: ${textNode.height() * scaleY}px;
        margin-top: ${textNode.y()}px;
        margin-left: ${textNode.x()}px;
        margin-bottom: ${stage.height() - textNode.y() - textNode.height()}px;
        margin-right: ${stage.width() - textNode.x() - textNode.width()}px;
        padding-top: ${stage.height() - textNode.y() - textNode.height()}px;
        padding-left: ${stage.width() - textNode.x() - textNode.width()}px;
        padding-bottom: ${textNode.y()}px;
        padding-right: ${textNode.x()}px;
        border-width: ${textNode.strokeWidth()}px;
        border-color: ${textNode.stroke()};
        background-color: ${textNode.fill()};
      }
      `;

      cssCodeEl.style.display = "block";
      cssCodeEl.textContent = cssCode;
      cssCodeEl.style.whiteSpace = "pre-line";
    });

    textNode.on("click", function () {
      cssCode = `
      .${textNode.name()} {
        width: ${textNode.width()}px;
        height: ${textNode.height()}px;
        margin-top: ${textNode.y()}px;
        margin-left: ${textNode.x()}px;
        margin-bottom: ${stage.height() - textNode.y() - textNode.height()}px;
        margin-right: ${stage.width() - textNode.x() - textNode.width()}px;
        padding-top: ${stage.height() - textNode.y() - textNode.height()}px;
        padding-left: ${stage.width() - textNode.x() - textNode.width()}px;
        padding-bottom: ${textNode.y()}px;
        padding-right: ${textNode.x()}px;
        border-width: ${textNode.strokeWidth()}px;
        border-color: ${textNode.stroke()};
        background-color: ${textNode.fill()};
      }
      `;

      cssCodeEl.style.display = "block";
      cssCodeEl.textContent = cssCode;
      cssCodeEl.style.whiteSpace = "pre-line";
    });
    layer.add(textNodeTr);
    textNode.on("dblclick dbltap", () => {
      // hide text node and transformer:
      textNode.hide();
      textNodeTr.hide();

      // create textarea over canvas with absolute position
      // first we need to find position for textarea
      // how to find it?

      // at first lets find position of text node relative to the stage:
      var textPosition = textNode.absolutePosition();

      // so position of textarea will be the sum of positions above:
      var areaPosition = {
        x: stage.container().offsetLeft + textPosition.x,
        y: stage.container().offsetTop + textPosition.y,
      };

      // create textarea and style it
      var textarea = document.createElement("textarea");
      document.body.appendChild(textarea);

      // apply many styles to match text on canvas as close as possible
      // remember that text rendering on canvas and on the textarea can be different
      // and sometimes it is hard to make it 100% the same. But we will try...
      textarea.value = textNode.text();
      textarea.style.position = "absolute";
      textarea.style.top = areaPosition.y + "px";
      textarea.style.left = areaPosition.x + "px";
      textarea.style.width = textNode.width() - textNode.padding() * 2 + "px";
      textarea.style.height =
        textNode.height() - textNode.padding() * 2 + 5 + "px";
      textarea.style.fontSize = textNode.fontSize() + "px";
      textarea.style.border = "none";
      textarea.style.padding = "0px";
      textarea.style.margin = "0px";
      textarea.style.overflow = "hidden";
      textarea.style.background = "none";
      textarea.style.outline = "none";
      textarea.style.resize = "none";
      textarea.style.lineHeight = textNode.lineHeight();
      textarea.style.fontFamily = textNode.fontFamily();
      textarea.style.transformOrigin = "left top";
      textarea.style.textAlign = textNode.align();
      textarea.style.color = textNode.fill();
      rotation = textNode.rotation();
      var transform = "";
      if (rotation) {
        transform += "rotateZ(" + rotation + "deg)";
      }

      var px = 0;
      // also we need to slightly move textarea on firefox
      // because it jumps a bit
      var isFirefox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
      if (isFirefox) {
        px += 2 + Math.round(textNode.fontSize() / 20);
      }
      transform += "translateY(-" + px + "px)";

      textarea.style.transform = transform;

      // reset height
      textarea.style.height = "auto";
      // after browsers resized it we can set actual value
      textarea.style.height = textarea.scrollHeight + 3 + "px";

      textarea.focus();

      function removeTextarea() {
        textarea.parentNode.removeChild(textarea);
        window.removeEventListener("click", handleOutsideClick);
        textNode.show();
        textNodeTr.show();
        textNodeTr.forceUpdate();
      }

      function setTextareaWidth(newWidth) {
        if (!newWidth) {
          // set width for placeholder
          newWidth = textNode.placeholder.length * textNode.fontSize();
        }
        // some extra fixes on different browsers
        var isSafari = /^((?!chrome|android).)*safari/i.test(
          navigator.userAgent
        );
        var isFirefox =
          navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
        if (isSafari || isFirefox) {
          newWidth = Math.ceil(newWidth);
        }

        var isEdge = document.documentMode || /Edge/.test(navigator.userAgent);
        if (isEdge) {
          newWidth += 1;
        }
        textarea.style.width = newWidth + "px";
      }

      textarea.addEventListener("keydown", function (e) {
        if (
          (e.keyCode === 13 && !e.shiftKey) ||
          e.key === "Delete" ||
          e.key === "Backspace"
        ) {
          textNode.text(textarea.value);
          removeTextarea();
        }
        // on esc do not set value back to node
        if (e.keyCode === 27 || e.key === "Delete" || e.key === "Backspace") {
          removeTextarea();
        }
      });

      textarea.addEventListener("keydown", function (e) {
        scale = textNode.getAbsoluteScale().x;
        setTextareaWidth(textNode.width() * scale);
        textarea.style.height = "auto";
        textarea.style.height =
          textarea.scrollHeight + textNode.fontSize() + "px";
      });

      function handleOutsideClick(e) {
        if (e.target !== textarea) {
          textNode.text(textarea.value);
          removeTextarea();
        }
      }
      setTimeout(() => {
        window.addEventListener("click", handleOutsideClick);
      });
    });
  }
  layer.draw();
});
