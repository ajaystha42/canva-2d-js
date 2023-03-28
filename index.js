var width = window.innerWidth;
var height = 222;
var input = document.getElementById("myInput");
var button = document.getElementById("myButton");
var text = document.getElementById("myText");
var MAX_WIDTH = window.innerWidth;
const dynamicContainer = document.getElementById("dynamic-container");

// input.style.border = "1px solid black";
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

// var complexText = new Konva.Text({
//   x: 20,
//   y: 60,
//   text: "Konvajs Demo\n\nDynamic Render",
//   fontSize: 18,
//   fontFamily: "Calibri",
//   fill: "#555",
//   width: 300,
//   padding: 20,
//   align: "center",
// });

// var rect1 = new Konva.Rect({
//   x: 20,
//   y: 60,
//   stroke: "#555",
//   strokeWidth: 5,
//   fill: "#ddd",
//   width: 300,
//   height: complexText.height(),
//   shadowColor: "black",
//   shadowBlur: 10,
//   shadowOffsetX: 10,
//   shadowOffsetY: 10,
//   shadowOpacity: 0.2,
//   cornerRadius: 10,
// });
// layer.add(rect1);
// layer.add(complexText);
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
    var inputGroup = new Konva.Group({
      x: stage.getPointerPosition().x,
      y: stage.getPointerPosition().y,
      draggable: true,
    });

    var inputBox = new Konva.Rect({
      width: 150,
      height: 20,
      fill: "#fff",
    });

    var border = new Konva.Rect({
      width: inputBox.width(),
      height: inputBox.height(),
      stroke: "black",
      strokeWidth: 2,
      perfectDrawEnabled: false,
    });
    inputGroup.add(border);
    inputGroup.add(inputBox);
    // border.moveToTop();

    var inputTr = new Konva.Transformer({
      node: inputBox,
      anchorSize: 8,
      rotateEnabled: false,
      boundBoxFunc: function (oldBoundBox, newBoundBox) {
        if (Math.abs(newBoundBox.width) > MAX_WIDTH) {
          return oldBoundBox;
        }
        border.setAttrs({
          x: inputBox.x(),
          y: inputBox.y(),
          width: newBoundBox.width,
          height: newBoundBox.height,
        });

        return newBoundBox;
      },
    });

    inputGroup.add(inputTr);
    layer.add(inputGroup);

    var textNode = new Konva.Text({
      x: 40,
      y: 5,
      text: "Placeholder",
      fontSize: 14,
      fill: "grey",
      draggable: true,
    });
    inputGroup.add(textNode);

    var textNodeTr = new Konva.Transformer({
      node: textNode,
      // enabledAnchors: [],
      // set minimum width of text
      boundBoxFunc: function (oldBox, newBox) {
        newBox.width = Math.max(30, newBox.width);
        return newBox;
      },
    });
    inputGroup.add(textNodeTr);

    const { attrs } = textNode;
    const inputEl = document.createElement("input");
    inputEl.placeholder = attrs.text;
    inputEl.style.fontSize = attrs.fontSize;
    inputEl.style.width = "200px";
    inputEl.style.height = "50px";
    inputEl.style.left = attrs.x + "px";
    inputEl.style.position = "absolute";
    inputEl.style.top = attrs.y + "px";
    inputEl.style.display = "block";
    // inputEl.style.marginBottom = "10px"
    // inputEl.style.color =
    inputEl.style.marginTop = inputGroup.y() + "px";
    inputEl.style.marginLeft = inputGroup.x() + "px";
    // inputEl.style.marginBottom =
    //   stage.height() - inputGroup.y() - inputBox.height() + "px";
    inputEl.style.marginRight =
      stage.width() - inputGroup.x() - inputBox.width() + "px";
    inputEl.style.paddingTop = textNode.y() + "px";
    inputEl.style.paddingLeft = textNode.x() + "px";
    inputEl.style.paddingBottom =
      inputBox.height() - textNode.y() - textNode.height() + "px";
    inputEl.style.paddingRight =
      inputBox.width() - textNode.x() - textNode.width() + "px";
    inputEl.style.width = inputBox.width() + "px";
    inputEl.style.height = inputBox.height() + "px";
    inputEl.style.backgroundColor = inputBox.fill();
    inputEl.placeholder = attrs.text;
    inputEl.style.fontSize = attrs.fontSize;
    inputEl.style.border = "2px solid black";
    inputEl.style.display = "block";
    dynamicContainer.appendChild(inputEl);

    inputBox.on("click", function () {
      var scaleX = inputBox.scaleX();
      var scaleY = inputBox.scaleY();
      cssCode = `
      .${inputBox.name()} {
        width: ${inputBox.width() * scaleX}px;
        height: ${inputBox.height() * scaleY}px;
        margin-top: ${inputGroup.y()}px;
        margin-left: ${inputGroup.x()}px;
        margin-bottom: ${stage.height() - inputGroup.y() - inputBox.height()}px;
        margin-right: ${stage.width() - inputGroup.x() - inputBox.width()}px;
        padding-top: ${textNode.y() * scaleY}px;
        padding-left: ${textNode.x() * scaleX}px;
        padding-bottom: ${
          (inputBox.height() - textNode.y() - textNode.height()) * scaleY
        }px;
        padding-right: ${
          (inputBox.width() - textNode.x() - textNode.width()) * scaleX
        }px;
        background-color: ${inputBox.fill()};
      }
      `;
      // inputEl.style = cssCode
      cssCodeEl.style.display = "block";
      // inputEl.style.display = "block";
      cssCodeEl.textContent = cssCode;
      cssCodeEl.style.whiteSpace = "pre-line";
      // for dynamic html render
    });

    inputTr.on("transform", function () {
      var scaleX = inputBox.scaleX();
      var scaleY = inputBox.scaleY();
      cssCode = `
      .${inputBox.name()} {
        width: ${inputBox.width() * scaleX}px;
        height: ${inputBox.height() * scaleY}px;
        margin-top: ${inputGroup.y()}px;
        margin-left: ${inputGroup.x()}px;
        margin-bottom: ${stage.height() - inputGroup.y() - inputBox.height()}px;
        margin-right: ${stage.width() - inputGroup.x() - inputBox.width()}px;
        padding-top: ${textNode.y() * scaleY}px;
        padding-left: ${textNode.x() * scaleX}px;
        padding-bottom: ${
          (inputBox.height() - textNode.y() - textNode.height()) * scaleY
        }px;
        padding-right: ${
          (inputBox.width() - textNode.x() - textNode.width()) * scaleX
        }px;
        background-color: ${inputBox.fill()};
      }
      `;
      cssCodeEl.style.display = "block";

      cssCodeEl.textContent = cssCode;
      // inputEl.style = cssCode
      // inputEl.style.display = "block";
      cssCodeEl.style.whiteSpace = "pre-line";
      // for dynamic html render
    });

    inputGroup.on("dragmove", function () {
      var scaleX = inputBox.scaleX();
      var scaleY = inputBox.scaleY();
      cssCode = `
      .${inputBox.name()} {
        width: ${inputBox.width() * scaleX}px;
        height: ${inputBox.height() * scaleY}px;
        margin-top: ${inputGroup.y()}px;
        margin-left: ${inputGroup.x()}px;
        margin-bottom: ${stage.height() - inputGroup.y() - inputBox.height()}px;
        margin-right: ${stage.width() - inputGroup.x() - inputBox.width()}px;
        padding-top: ${textNode.y() * scaleY}px;
        padding-left: ${textNode.x() * scaleX}px;
        padding-bottom: ${
          (inputBox.height() - textNode.y() - textNode.height()) * scaleY
        }px;
        padding-right: ${
          (inputBox.width() - textNode.x() - textNode.width()) * scaleX
        }px;
        background-color: ${inputBox.fill()};
      }
      `;
      cssCodeEl.style.display = "block";
      // inputEl.style = cssCoded
      // inputEl.style.display = "block";
      cssCodeEl.textContent = cssCode;
      cssCodeEl.style.whiteSpace = "pre-line";
      // for dynamic html render
    });

    stage.on("click", function (e) {
      if (e.target === stage) {
        inputTr.hide();
        inputTr.nodes([]);
        textNodeTr.nodes([]);
        textNodeTr.hide();
        layer.draw();
        cssCodeEl.style.display = "none";
        cssCode = "";
        cssCodeEl.textContent = cssCode;
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
        font-size: ${textNode.height() * scaleY}px;
        margin-top: ${textNode.y()}px;
        margin-left: ${textNode.x()}px;
        margin-bottom: ${stage.height() - textNode.y() - textNode.height()}px;
        margin-right: ${stage.width() - textNode.x() - textNode.width()}px;
        text-color: ${textNode.fill()};
      }
      `;
      cssCodeEl.style.display = "block";

      cssCodeEl.textContent = cssCode;
      cssCodeEl.style.whiteSpace = "pre-line";
    });

    textNode.on("click", function () {
      var scaleX = textNode.scaleX();
      var scaleY = textNode.scaleY();
      cssCode = `
      .${textNode.name()} {
        width: ${textNode.width() * scaleX}px;
        font-size: ${textNode.height() * scaleY}px;
        margin-top: ${textNode.y()}px;
        margin-left: ${textNode.x()}px;
        margin-bottom: ${stage.height() - textNode.y() - textNode.height()}px;
        margin-right: ${stage.width() - textNode.x() - textNode.width()}px;
        text-color: ${textNode.fill()};
      }
      `;
      cssCodeEl.style.display = "block";

      cssCodeEl.textContent = cssCode;
      cssCodeEl.style.whiteSpace = "pre-line";
    });

    textNode.on("dragmove", function () {
      var scaleX = textNode.scaleX();
      var scaleY = textNode.scaleY();
      cssCode = `
      .${textNode.name()} {
        width: ${textNode.width() * scaleX}px;
        font-size: ${textNode.height() * scaleY}px;
        margin-top: ${textNode.y()}px;
        margin-left: ${textNode.x()}px;
        margin-bottom: ${stage.height() - textNode.y() - textNode.height()}px;
        margin-right: ${stage.width() - textNode.x() - textNode.width()}px;
        text-color: ${textNode.fill()};
      }
      `;
      cssCodeEl.style.display = "block";

      cssCodeEl.textContent = cssCode;
      cssCodeEl.style.whiteSpace = "pre-line";
    });
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

    inputBox.on("click", function () {
      inputTr.nodes([inputBox]);
      layer.add(inputTr);
      inputTr.show();
    });
    textNode.on("click", function () {
      textNodeTr.nodes([textNode]);
      layer.add(textNodeTr);
      textNodeTr.show();
    });
    // const { attrs } = textNode;
    // console.log({ attrs });
    // const input = document.createElement("input");
    // input.style.position = "absolute";

    // input.placeholder = attrs.text;
    // input.style.fontSize = attrs.fontSize;
    // input.style.width = "200px";
    // input.style.height = "50px";
    // input.style.left = attrs.x + "px";
    // input.style.top = attrs.y + "px";
    // dynamicContainer.appendChild(input);
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
          inputEl.style.display = "none";
          textNode.hide();
          textNodeTr.hide();
          border.hide();
          cssCodeEl.style.display = "none";
          cssCode = "";
          cssCodeEl.textContent = cssCode;
        }
      }
    });

    layer.add(inputGroup);
  } else if (type == "button") {
    var inputGroup = new Konva.Group({
      x: stage.getPointerPosition().x,
      y: stage.getPointerPosition().y,
      draggable: true,
    });

    var inputBox = new Konva.Rect({
      width: 120,
      height: 20,
      fill: "#90EE90",
    });

    var border = new Konva.Rect({
      width: inputBox.width(),
      height: inputBox.height(),
      stroke: "black",
      strokeWidth: 2,
      perfectDrawEnabled: false,
    });
    inputGroup.add(border);
    inputGroup.add(inputBox);
    // border.moveToTop();

    var inputTr = new Konva.Transformer({
      node: inputBox,
      anchorSize: 8,
      rotateEnabled: false,
      boundBoxFunc: function (oldBoundBox, newBoundBox) {
        if (Math.abs(newBoundBox.width) > MAX_WIDTH) {
          return oldBoundBox;
        }
        border.setAttrs({
          x: inputBox.x(),
          y: inputBox.y(),
          width: newBoundBox.width,
          height: newBoundBox.height,
        });

        return newBoundBox;
      },
    });

    inputGroup.add(inputTr);
    layer.add(inputGroup);

    var textNode = new Konva.Text({
      x: 32,
      y: 5,
      text: "Placeholder",
      fontSize: 12,
      fill: "grey",
      draggable: true,
    });
    inputGroup.add(textNode);

    var textNodeTr = new Konva.Transformer({
      node: textNode,
      // enabledAnchors: [],
      // set minimum width of text
      boundBoxFunc: function (oldBox, newBox) {
        newBox.width = Math.max(30, newBox.width);
        return newBox;
      },
    });
    inputGroup.add(textNodeTr);
    inputBox.on("click", function () {
      var scaleX = inputBox.scaleX();
      var scaleY = inputBox.scaleY();
      cssCode = `
      .${inputBox.name()} {
        width: ${inputBox.width() * scaleX}px;
        height: ${inputBox.height() * scaleY}px;
        margin-top: ${inputGroup.y()}px;
        margin-left: ${inputGroup.x()}px;
        margin-bottom: ${stage.height() - inputGroup.y() - inputBox.height()}px;
        margin-right: ${stage.width() - inputGroup.x() - inputBox.width()}px;
        padding-top: ${textNode.y() * scaleY}px;
        padding-left: ${textNode.x() * scaleX}px;
        padding-bottom: ${
          (inputBox.height() - textNode.y() - textNode.height()) * scaleY
        }px;
        padding-right: ${
          (inputBox.width() - textNode.x() - textNode.width()) * scaleX
        }px;
        background-color: ${inputBox.fill()};
      }
      `;
      cssCodeEl.style.display = "block";

      cssCodeEl.textContent = cssCode;
      cssCodeEl.style.whiteSpace = "pre-line";
    });
    inputTr.on("transform", function () {
      var scaleX = inputBox.scaleX();
      var scaleY = inputBox.scaleY();
      cssCode = `
      .${inputBox.name()} {
        width: ${inputBox.width() * scaleX}px;
        height: ${inputBox.height() * scaleY}px;
        margin-top: ${inputGroup.y()}px;
        margin-left: ${inputGroup.x()}px;
        margin-bottom: ${stage.height() - inputGroup.y() - inputBox.height()}px;
        margin-right: ${stage.width() - inputGroup.x() - inputBox.width()}px;
        padding-top: ${textNode.y() * scaleY}px;
        padding-left: ${textNode.x() * scaleX}px;
        padding-bottom: ${
          (inputBox.height() - textNode.y() - textNode.height()) * scaleY
        }px;
        padding-right: ${
          (inputBox.width() - textNode.x() - textNode.width()) * scaleX
        }px;
        background-color: ${inputBox.fill()};
      }
      `;
      cssCodeEl.style.display = "block";

      cssCodeEl.textContent = cssCode;
      cssCodeEl.style.whiteSpace = "pre-line";
    });

    inputGroup.on("dragmove", function () {
      var scaleX = inputBox.scaleX();
      var scaleY = inputBox.scaleY();
      cssCode = `
      .${inputBox.name()} {
        width: ${inputBox.width() * scaleX}px;
        height: ${inputBox.height() * scaleY}px;
        margin-top: ${inputGroup.y()}px;
        margin-left: ${inputGroup.x()}px;
        margin-bottom: ${stage.height() - inputGroup.y() - inputBox.height()}px;
        margin-right: ${stage.width() - inputGroup.x() - inputBox.width()}px;
        padding-top: ${textNode.y() * scaleY}px;
        padding-left: ${textNode.x() * scaleX}px;
        padding-bottom: ${
          (inputBox.height() - textNode.y() - textNode.height()) * scaleY
        }px;
        padding-right: ${
          (inputBox.width() - textNode.x() - textNode.width()) * scaleX
        }px;
        background-color: ${inputBox.fill()};
      }
      `;
      cssCodeEl.style.display = "block";

      cssCodeEl.textContent = cssCode;
      cssCodeEl.style.whiteSpace = "pre-line";
    });

    stage.on("click", function (e) {
      if (e.target === stage) {
        inputTr.hide();
        inputTr.nodes([]);
        textNodeTr.nodes([]);
        textNodeTr.hide();
        layer.draw();
        cssCodeEl.style.display = "none";
        cssCode = "";
        cssCodeEl.textContent = cssCode;
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
        font-size: ${textNode.height() * scaleY}px;
        margin-top: ${textNode.y()}px;
        margin-left: ${textNode.x()}px;
        margin-bottom: ${stage.height() - textNode.y() - textNode.height()}px;
        margin-right: ${stage.width() - textNode.x() - textNode.width()}px;
        text-color: ${textNode.fill()};
      }
      `;
      cssCodeEl.style.display = "block";

      cssCodeEl.textContent = cssCode;
      cssCodeEl.style.whiteSpace = "pre-line";
    });

    textNode.on("click", function () {
      var scaleX = textNode.scaleX();
      var scaleY = textNode.scaleY();
      cssCode = `
      .${textNode.name()} {
        width: ${textNode.width() * scaleX}px;
        font-size: ${textNode.height() * scaleY}px;
        margin-top: ${textNode.y()}px;
        margin-left: ${textNode.x()}px;
        margin-bottom: ${stage.height() - textNode.y() - textNode.height()}px;
        margin-right: ${stage.width() - textNode.x() - textNode.width()}px;
        text-color: ${textNode.fill()};
      }
      `;
      cssCodeEl.style.display = "block";

      cssCodeEl.textContent = cssCode;
      cssCodeEl.style.whiteSpace = "pre-line";
    });

    textNode.on("dragmove", function () {
      var scaleX = textNode.scaleX();
      var scaleY = textNode.scaleY();
      cssCode = `
      .${textNode.name()} {
        width: ${textNode.width() * scaleX}px;
        font-size: ${textNode.height() * scaleY}px;
        margin-top: ${textNode.y()}px;
        margin-left: ${textNode.x()}px;
        margin-bottom: ${stage.height() - textNode.y() - textNode.height()}px;
        margin-right: ${stage.width() - textNode.x() - textNode.width()}px;
        text-color: ${textNode.fill()};
      }
      `;
      cssCodeEl.style.display = "block";

      cssCodeEl.textContent = cssCode;
      cssCodeEl.style.whiteSpace = "pre-line";
    });
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

    inputBox.on("click", function () {
      inputTr.nodes([inputBox]);
      layer.add(inputTr);
      inputTr.show();
    });
    textNode.on("click", function () {
      textNodeTr.nodes([textNode]);
      layer.add(textNodeTr);
      textNodeTr.show();
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
          textNode.hide();
          textNodeTr.hide();
          border.hide();
          cssCodeEl.style.display = "none";
          cssCode = "";
          cssCodeEl.textContent = cssCode;
        }
      }
    });

    layer.add(inputGroup);
    const { attrs } = textNode;
    const buttonEl = document.createElement("button");
    buttonEl.placeholder = attrs.text;
    buttonEl.style.fontSize = attrs.fontSize;
    buttonEl.style.position = "absolute";

    // buttonEl.style.width = "200px";
    // buttonEl.style.height = "50px";
    buttonEl.style.left = attrs.x + "px";
    buttonEl.style.top = attrs.y + "px";
    buttonEl.style.display = "block";
    buttonEl.style.marginBottom = "10px";

    // buttonEl.style.color =
    buttonEl.style.marginTop = inputGroup.y() + "px";
    buttonEl.style.marginLeft = inputGroup.x() + "px";
    // buttonEl.style.marginBottom =
    //   stage.height() - inputGroup.y() - inputBox.height() + "px";
    buttonEl.style.marginRight =
      stage.width() - inputGroup.x() - inputBox.width() + "px";
    buttonEl.style.paddingTop = textNode.y() + "px";
    buttonEl.style.paddingLeft = textNode.x() + "px";
    buttonEl.style.paddingBottom =
      inputBox.height() - textNode.y() - textNode.height() + "px";
    buttonEl.style.paddingRight =
      inputBox.width() - textNode.x() - textNode.width() + "px";
    buttonEl.style.width = inputBox.width() + "px";
    buttonEl.style.height = inputBox.height() + "px";
    buttonEl.style.backgroundColor = inputBox.fill();
    buttonEl.textContent = attrs.text;
    buttonEl.style.fontSize = attrs.fontSize;
    buttonEl.style.border = "2px solid blue";
    dynamicContainer.appendChild(buttonEl);
    // layer.add(border);
  } else {
    textNode = new Konva.Text({
      x: stage.getPointerPosition().x,
      y: stage.getPointerPosition().y,
      text: "Type Here...",
      fontSize: 14,
      fill: "black",
      draggable: true,
    });
    layer.add(textNode);
    textNode.moveToTop();
    const { attrs } = textNode;
    console.log({ textNode, attrs });
    const labelEl = document.createElement("p");
    labelEl.innerText = textNode.text();
    labelEl.style.fontSize = attrs.fontSize + "px";
    labelEl.style.fontFamily = textNode.fontFamily();
    labelEl.style.fontStyle = textNode.fontStyle();
    // labelEl.style.fontWeight = textNode.fontWeight();
    labelEl.style.color = textNode.fill();
    labelEl.style.position = "absolute";
    labelEl.style.left = textNode.x() + "px";
    labelEl.style.top = textNode.y() + "px";
    labelEl.style.display = "block";
    labelEl.style.marginTop = textNode.y() + "px";
    labelEl.style.marginLeft = textNode.x() + "px";
    // labelEl.style.marginBottom =
    //   stage.height() - textNode.y() - inputBox.height() + "px";
    labelEl.style.marginRight =
      stage.width() - textNode.x() - textNode.width() + "px";
    // labelEl.style.paddingTop = textNode.y() + "px";
    // labelEl.style.paddingLeft = textNode.x() + "px";
    // labelEl.style.paddingBottom =
    //   inputBox.height() - textNode.y() - textNode.height() + "px";
    // labelEl.style.paddingRight =
    //   inputBox.width() - textNode.x() - textNode.width() + "px";
    // labelEl.style.width = inputBox.width() + "px";
    dynamicContainer.appendChild(labelEl);
    // inputGroup.add(inputTr);
    var textNodeTr = new Konva.Transformer({
      node: textNode,
      // enabledAnchors: [],
      // set minimum width of text
      boundBoxFunc: function (oldBox, newBox) {
        newBox.width = Math.max(30, newBox.width);
        return newBox;
      },
    });
    layer.add(textNodeTr);

    stage.on("click", function (e) {
      if (e.target === stage) {
        textNodeTr.nodes([]);
        textNodeTr.hide();
        layer.draw();
        cssCodeEl.style.display = "none";
        cssCode = "";
        cssCodeEl.textContent = cssCode;
      }
    });
    // inputGroup.add(textNodeTr);
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
        font-size: ${textNode.height() * scaleY}px;
        margin-top: ${textNode.y()}px;
        margin-left: ${textNode.x()}px;
        margin-bottom: ${stage.height() - textNode.y() - textNode.height()}px;
        margin-right: ${stage.width() - textNode.x() - textNode.width()}px;
        text-color: ${textNode.fill()};
      }
      `;
      cssCodeEl.style.display = "block";

      cssCodeEl.textContent = cssCode;
      cssCodeEl.style.whiteSpace = "pre-line";
    });

    textNode.on("click", function () {
      var scaleX = textNode.scaleX();
      var scaleY = textNode.scaleY();
      cssCode = `
      .${textNode.name()} {
        width: ${textNode.width() * scaleX}px;
        font-size: ${textNode.height() * scaleY}px;
        margin-top: ${textNode.y()}px;
        margin-left: ${textNode.x()}px;
        margin-bottom: ${stage.height() - textNode.y() - textNode.height()}px;
        margin-right: ${stage.width() - textNode.x() - textNode.width()}px;
        text-color: ${textNode.fill()};
      }
      `;
      cssCodeEl.style.display = "block";

      cssCodeEl.textContent = cssCode;
      cssCodeEl.style.whiteSpace = "pre-line";
    });
    textNode.on("click", function () {
      textNodeTr.nodes([textNode]);
      layer.add(textNodeTr);
      textNodeTr.show();
    });

    textNode.on("dragmove", function () {
      var scaleX = textNode.scaleX();
      var scaleY = textNode.scaleY();
      cssCode = `
      .${textNode.name()} {
        width: ${textNode.width() * scaleX}px;
        font-size: ${textNode.height() * scaleY}px;
        margin-top: ${textNode.y()}px;
        margin-left: ${textNode.x()}px;
        margin-bottom: ${stage.height() - textNode.y() - textNode.height()}px;
        margin-right: ${stage.width() - textNode.x() - textNode.width()}px;
        text-color: ${textNode.fill()};
      }
      `;
      cssCodeEl.style.display = "block";

      cssCodeEl.textContent = cssCode;
      cssCodeEl.style.whiteSpace = "pre-line";
    });
    textNodeTr.on("dragmove", function () {
      var scaleX = textNode.scaleX();
      var scaleY = textNode.scaleY();
      cssCode = `
      .${textNode.name()} {
        width: ${textNode.width() * scaleX}px;
        font-size: ${textNode.height() * scaleY}px;
        margin-top: ${textNode.y()}px;
        margin-left: ${textNode.x()}px;
        margin-bottom: ${stage.height() - textNode.y() - textNode.height()}px;
        margin-right: ${stage.width() - textNode.x() - textNode.width()}px;
        text-color: ${textNode.fill()};
      }
      `;
      cssCodeEl.style.display = "block";

      cssCodeEl.textContent = cssCode;
      cssCodeEl.style.whiteSpace = "pre-line";
    });
    textNodeTr.on("dblclick dbltap", () => {
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

if (dynamicContainer.firstChild) {
  dynamicContainer.classList.remove("hidden");
}

function getLineGuideStops(skipShape) {
  // we can snap to stage borders and the center of the stage
  var vertical = [0, stage.width() / 2, stage.width()];
  var horizontal = [0, stage.height() / 2, stage.height()];

  // and we snap over edges and center of each object on the canvas
  stage.find(".object").forEach((guideItem) => {
    if (guideItem === skipShape) {
      return;
    }
    var box = guideItem.getClientRect();
    // and we can snap to all edges of shapes
    vertical.push([box.x, box.x + box.width, box.x + box.width / 2]);
    horizontal.push([box.y, box.y + box.height, box.y + box.height / 2]);
  });
  return {
    vertical: vertical.flat(),
    horizontal: horizontal.flat(),
  };
}

// what points of the object will trigger to snapping?
// it can be just center of the object
// but we will enable all edges and center
function getObjectSnappingEdges(node) {
  var box = node.getClientRect();
  var absPos = node.absolutePosition();

  return {
    vertical: [
      {
        guide: Math.round(box.x),
        offset: Math.round(absPos.x - box.x),
        snap: "start",
      },
      {
        guide: Math.round(box.x + box.width / 2),
        offset: Math.round(absPos.x - box.x - box.width / 2),
        snap: "center",
      },
      {
        guide: Math.round(box.x + box.width),
        offset: Math.round(absPos.x - box.x - box.width),
        snap: "end",
      },
    ],
    horizontal: [
      {
        guide: Math.round(box.y),
        offset: Math.round(absPos.y - box.y),
        snap: "start",
      },
      {
        guide: Math.round(box.y + box.height / 2),
        offset: Math.round(absPos.y - box.y - box.height / 2),
        snap: "center",
      },
      {
        guide: Math.round(box.y + box.height),
        offset: Math.round(absPos.y - box.y - box.height),
        snap: "end",
      },
    ],
  };
}

// find all snapping possibilities
function getGuides(lineGuideStops, itemBounds) {
  var resultV = [];
  var resultH = [];

  lineGuideStops.vertical.forEach((lineGuide) => {
    itemBounds.vertical.forEach((itemBound) => {
      var diff = Math.abs(lineGuide - itemBound.guide);
      // if the distance between guild line and object snap point is close we can consider this for snapping
      if (diff < GUIDELINE_OFFSET) {
        resultV.push({
          lineGuide: lineGuide,
          diff: diff,
          snap: itemBound.snap,
          offset: itemBound.offset,
        });
      }
    });
  });

  lineGuideStops.horizontal.forEach((lineGuide) => {
    itemBounds.horizontal.forEach((itemBound) => {
      var diff = Math.abs(lineGuide - itemBound.guide);
      if (diff < GUIDELINE_OFFSET) {
        resultH.push({
          lineGuide: lineGuide,
          diff: diff,
          snap: itemBound.snap,
          offset: itemBound.offset,
        });
      }
    });
  });

  var guides = [];

  // find closest snap
  var minV = resultV.sort((a, b) => a.diff - b.diff)[0];
  var minH = resultH.sort((a, b) => a.diff - b.diff)[0];
  if (minV) {
    guides.push({
      lineGuide: minV.lineGuide,
      offset: minV.offset,
      orientation: "V",
      snap: minV.snap,
    });
  }
  if (minH) {
    guides.push({
      lineGuide: minH.lineGuide,
      offset: minH.offset,
      orientation: "H",
      snap: minH.snap,
    });
  }
  return guides;
}

function drawGuides(guides) {
  guides.forEach((lg) => {
    if (lg.orientation === "H") {
      var line = new Konva.Line({
        points: [-6000, 0, 6000, 0],
        stroke: "rgb(0, 161, 255)",
        strokeWidth: 1,
        name: "guid-line",
        dash: [4, 6],
      });
      layer.add(line);
      line.absolutePosition({
        x: 0,
        y: lg.lineGuide,
      });
    } else if (lg.orientation === "V") {
      var line = new Konva.Line({
        points: [0, -6000, 0, 6000],
        stroke: "rgb(0, 161, 255)",
        strokeWidth: 1,
        name: "guid-line",
        dash: [4, 6],
      });
      layer.add(line);
      line.absolutePosition({
        x: lg.lineGuide,
        y: 0,
      });
    }
  });
}
