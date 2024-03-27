import * as datGui from "dat.gui";

const state = {
    fps: 60,
    color: "#0f0",
    shape: "circle",
    size: 10
};

const gui = new datGui.GUI();
const fpsCtrl = gui.add(state, "fps").min(1).max(120).step(1);
gui.addColor(state, "color");
gui.add(state, "shape", ["circle", "square", "triangle"]);
const sizeCtrl = gui.add(state, "size").min(1).max(120).step(1);

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let w, h, shapes;
const resize = () => {
    w = canvas.width = innerWidth;
    h = canvas.height = innerHeight;

    shapes = [];
    for (let i = 0; i < 100; i++) {
        shapes.push({
            x: Math.random() * w,
            y: Math.random() * h,
            radius: Math.random() * state.size,
            speedX: (Math.random() - 0.5) * 2,
            speedY: (Math.random() - 0.5) * 2,
            rotationSpeed: Math.random() * 0.02,
            rotation: 0,
            color: state.color
        });
    }
};
window.addEventListener("resize", resize);
sizeCtrl.onFinishChange(() => resize());
resize();

const draw = () => {
    ctx.clearRect(0, 0, w, h);

    shapes.forEach(shape => {
        ctx.save();
        ctx.translate(shape.x, shape.y);
        ctx.rotate(shape.rotation);
        ctx.fillStyle = shape.color;

        if (state.shape === "circle") {
            ctx.beginPath();
            ctx.arc(0, 0, shape.radius, 0, Math.PI * 2);
            ctx.fill();
        } else if (state.shape === "square") {
            ctx.fillRect(-shape.radius, -shape.radius, shape.radius * 2, shape.radius * 2);
        } else if (state.shape === "triangle") {
            ctx.beginPath();
            ctx.moveTo(0, -shape.radius);
            ctx.lineTo(shape.radius, shape.radius);
            ctx.lineTo(-shape.radius, shape.radius);
            ctx.closePath();
            ctx.fill();
        }

        ctx.restore();

        shape.x += shape.speedX;
        shape.y += shape.speedY;

        if (shape.x < -shape.radius || shape.x > w + shape.radius) {
            shape.speedX *= -1;
        }

        if (shape.y < -shape.radius || shape.y > h + shape.radius) {
            shape.speedY *= -1;
        }

        shape.rotation += shape.rotationSpeed;
    });
};

let interval = setInterval(draw, 1000 / state.fps);
fpsCtrl.onFinishChange((fps) => {
    if (interval) {
        clearInterval(interval);
    }
    interval = setInterval(draw, 1000 / fps);
});
