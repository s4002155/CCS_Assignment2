document.body.style.margin = 0;
document.body.style.overflow = 'hidden';

const cnv = document.getElementById('c2');
const renderer = new c2.Renderer(cnv);

resize();

renderer.background('#000000');
let random = new c2.Random();

class Agent extends c2.Cell {
    constructor(x, y) {
        let r = random.next(renderer.width / 40, renderer.width / 15);
        super(x, y, r);

        this.vx = random.next(-2, 2);
        this.vy = random.next(-2, 2);
        // 형광색이나 네온색으로 무작위로 색상 선택
        this.color = randomNeonColor();
    }

    update() {
        this.p.x += this.vx;
        this.p.y += this.vy;

        if (this.p.x < 0) {
            this.p.x = 0;
            this.vx *= -1;
        } else if (this.p.x > renderer.width) {
            this.p.x = renderer.width;
            this.vx *= -1;
        }
        if (this.p.y < 0) {
            this.p.y = 0;
            this.vy *= -1;
        } else if (this.p.y > renderer.height) {
            this.p.y = renderer.height;
            this.vy *= -1;
        }
    }

    display() {
        if (this.state != 2) {
            renderer.stroke(c2.Color.rgb(0, .2));
            renderer.lineWidth(1);
            renderer.fill(this.color);
            renderer.polygon(this.polygon(4));

            renderer.stroke('#333333');
            renderer.lineWidth(5);
            renderer.point(this.p.x, this.p.y);
        }
    }
}

// 형광색이나 네온색을 생성하는 함수
function randomNeonColor() {
    // 무작위로 형광색이나 네온색을 선택
    // let neonColors = ['#ff00ff', '#00ffff', '#ffaa00', '#00ff00', '#ff00aa', '#ffff00', '#67ede7', '#3f4a48'];
    // let neonColors = ['#8f8b85', '#eac031', '#efe3a5', '#f6eb3c', '#e8e8e4', '#b3eb3a', '#a1eb6f', '#b5b964', '#85e6be', '#67ecb7', '#67ede7', '#429de5', '#acd0e8','#2360e9', '#1740ae', '#7c00e6', '#de1edf', '#99177f', '#ebabdb', '#e4299b', '#db2c47'];
    let neonColors = ['#ff00ff', '#00ffff', '#ffaa00', '#00ff00', '#ff00aa', '#ffff00', '#00ffaa', '#ffaa00', '#00aaff', '#aa00ff'];
    return neonColors[Math.floor(Math.random() * neonColors.length)];
}

let agents = [];

for (let i = 0; i < 15; i++) {
    let x = random.next(renderer.width);
    let y = random.next(renderer.height);
    agents.push(new Agent(x, y));
}

let lastMouseMoveTime = 0;
const minMouseMoveInterval = 100; // milliseconds

renderer.draw(() => {
    let voronoi = new c2.LimitedVoronoi();
    voronoi.compute(agents);

    for (let i = 0; i < agents.length; i++) {
        agents[i].display();
        agents[i].update();
    }
});

window.addEventListener('resize', resize);
window.addEventListener('mousemove', onMouseMove);

function resize() {
    let parent = renderer.canvas.parentElement;
    renderer.size(parent.clientWidth, parent.clientWidth / 16 * 9);
}

function onMouseMove(event) {
    let currentTime = Date.now();
    if (currentTime - lastMouseMoveTime > minMouseMoveInterval) {
        let x = event.clientX;
        let y = event.clientY;
        agents.push(new Agent(x, y));
        lastMouseMoveTime = currentTime;
    }
}
