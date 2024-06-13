const canvas = document.querySelector("#canvas")
const ctx = canvas.getContext("2d");
canvas.width = 700
canvas.height = 300

const center = { x: canvas.width / 2, y: canvas.height / 2 };
const radius = 70;
ctx.beginPath()
ctx.arc(center.x - 200, center.y, radius, 0, 2 * Math.PI, false)
ctx.fillStyle = "#ff9900"
ctx.fill()

ctx.beginPath()
ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI, false)
ctx.fillStyle = "#ff9900"
ctx.fill()
