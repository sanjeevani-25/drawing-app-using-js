const canvas = document.querySelector("canvas"),
  ctx = canvas.getContext("2d"),
  toolBtns = document.querySelectorAll(".tool"),
  fillColor = document.querySelector("#fill-color"),
  clearCanvasBtn = document.querySelector(".clear-canvas"),
  saveImage = document.querySelector(".save-img"),
  colorPicker = document.querySelector("#color-picker"),
  sizeSlider = document.querySelector("#size-slider");

let prevMouseX,
  prevMouseY,
  snapshot,
  strokeColor,
  isDrawing = false,
  brushWidth = 5,
  selectedTool = "brush";

window.addEventListener("load", () => {
  // viewable width and height
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
});

const drawRect = (e) => {
  if (!fillColor.checked) {
    return ctx.strokeRect(
      e.offsetX,
      e.offsetY,
      prevMouseX - e.offsetX,
      prevMouseY - e.offsetY
    );
  }
  ctx.fillRect(
    e.offsetX,
    e.offsetY,
    prevMouseX - e.offsetX,
    prevMouseY - e.offsetY
  );
};

drawCircle = (e) => {
  ctx.beginPath(); //create new path to draw circle
  let radius = Math.sqrt(
    Math.pow(prevMouseX - e.offsetX, 2) + Math.pow(prevMouseY - e.offsetY, 2)
  );
  ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);

  fillColor.checked ? ctx.fill() : ctx.stroke();
};

drawTriangle = (e) => {
  ctx.beginPath(); //create new path to draw triangle
  ctx.moveTo(prevMouseX, prevMouseY);
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.lineTo(2 * prevMouseX - e.offsetX, e.offsetY);
  ctx.closePath();
  fillColor.checked ? ctx.fill() : ctx.stroke();
};

const startDraw = (e) => {
  isDrawing = true;
  prevMouseX = e.offsetX;
  prevMouseY = e.offsetY;
  ctx.beginPath();
  ctx.lineWidth = brushWidth;
  // copy canvas data & passing as snapshot , avoids dragging the image
  snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
};

const drawing = (e) => {
  if (!isDrawing) return;
  ctx.putImageData(snapshot, 0, 0);
  fillColor.checked
    ? (ctx.fillStyle = strokeColor)
    : (ctx.strokeStyle = strokeColor);
  if (selectedTool == "brush" || selectedTool == "eraser") {
    ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : colorPicker.value;
    ctx.lineTo(e.offsetX, e.offsetY); // creating line acc to mouse pointer
    ctx.stroke(); //draws filling line
  } else if (selectedTool == "rectangle") {
    drawRect(e);
  } else if (selectedTool == "circle") {
    drawCircle(e);
  } else if (selectedTool == "triangle") {
    drawTriangle(e);
  }
};

toolBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector(".options .active").classList.remove("active");
    btn.classList.add("active");
    selectedTool = btn.id;
  });
});

sizeSlider.addEventListener("change", () => {
  brushWidth = sizeSlider.value;
});
colorPicker.addEventListener("change", () => {
  strokeColor = colorPicker.value;
});
clearCanvasBtn.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});
saveImage.addEventListener("click", () => {
  const link = document.createElement("a"); //create <a> element
  link.download = `${Date.now()}.jpg`;
  link.href = canvas.toDataURL();
  link.click();
});
canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", () => {
  isDrawing = false;
});
