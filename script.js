const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('colorPicker');
const lineWidth = document.getElementById('lineWidth');
const clearBtn = document.getElementById('clearCanvas');
const eraserBtn = document.getElementById('toggleEraser');
const notepad = document.getElementById('notepad');
const addImageBtn = document.getElementById('addImage');
const fileInput = document.getElementById('fileInput');
const saveBtn = document.getElementById('saveCanvas');

let isDrawing = false;
let lastX = 0;
let lastY = 0;
let isEraser = false;
let insertedImage = null;
let isDragging = false;
let currentX;
let currentY;
let initialX;
let initialY;
let initialWidth;
let initialHeight;

// Set initial line color and width
ctx.strokeStyle = colorPicker.value;
ctx.lineWidth = lineWidth.value;

// Event listeners for canvas
canvas.addEventListener('mousedown', (e) => {
  if (!isDragging) {
    isDrawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
  }
});

canvas.addEventListener('mousemove', (e) => {
  if (!isDrawing || isDragging) return;

  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();

  if (isEraser) {
    ctx.strokeStyle = '#ffffff'; // Set stroke color to white for erasing
  } else {
    ctx.strokeStyle = colorPicker.value;
  }

  [lastX, lastY] = [e.offsetX, e.offsetY];
});

canvas.addEventListener('mouseup', () => {
  isDrawing = false;
});

canvas.addEventListener('mouseout', () => {
  isDrawing = false;
});

colorPicker.addEventListener('change', () => {
  ctx.strokeStyle = colorPicker.value;
});

lineWidth.addEventListener('change', () => {
  ctx.lineWidth = lineWidth.value;
});

clearBtn.addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (insertedImage) {
    insertedImage.remove();
    insertedImage = null;
  }
});

eraserBtn.addEventListener('click', () => {
  isEraser = !isEraser; // Toggle eraser mode
  eraserBtn.classList.toggle('active');
});

addImageBtn.addEventListener('click', () => {
  fileInput.click();
});

fileInput.addEventListener('change', () => {
  const file = fileInput.files[0];
  const reader = new FileReader();

  reader.onload = () => {
    const img = new Image();
    img.src = reader.result;
    img.onload = () => {
      if (insertedImage) {
        insertedImage.remove();
      }
      insertedImage = img;
      drawImage();
    };
  };

  reader.readAsDataURL(file);
});

function drawImage() {
  ctx.drawImage(insertedImage, 0, 0);
  canvas.parentNode.appendChild(insertedImage);

  insertedImage.addEventListener('mousedown', startDrag);
  insertedImage.addEventListener('mouseup', stopDrag);
  insertedImage.addEventListener('mousemove', drag);
  insertedImage.addEventListener('mouseleave', stopDrag);
}

function startDrag(e) {
  isDragging = true;
  currentX = e.clientX - insertedImage.offsetLeft;
}