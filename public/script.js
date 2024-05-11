    // First canvas code
document.body.style.margin = 0;
document.body.style.overflow = 'hidden';

const firstCanvas = document.getElementById("firstCanvas");
const renderer = new c2.Renderer(firstCanvas);

resize();

renderer.background('#000000');
let random = new c2.Random();

const maxWidth = 400; // Maximum width
const maxHeight = 200; // Maximum height    

class Agent extends c2.Cell {
    constructor(x, y) {
        let r = random.next(renderer.width / 40, renderer.width / 15);
        super(x, y, r);

        this.vx = random.next(-2, 2);
        this.vy = random.next(-2, 2);
        // Select random color in neon or fluorescent
        this.color = randomNeonColor();
        // Generate random width and height
        this.randomWidth = Math.random() * maxWidth; // maxWidth is desired maximum width
        this.randomHeight = Math.random() * maxHeight; // maxHeight is desired maximum height
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
            renderer.stroke(c2.Color.rgb(50, .2));
            renderer.lineWidth(2);
            renderer.fill(this.color);
            renderer.rect(this.p.x, this.p.y, this.randomWidth, this.randomHeight); // Draw rectangle with random width and height
        }
    }
}

// Function to generate neon or fluorescent colors
function randomNeonColor() {
    let neonColors = ['#ff00ff', '#00ffff', '#ffaa00', '#00ff00', '#ff00aa', '#ffff00', '#00ffaa', '#ffaa00', '#00aaff', '#aa00ff'];
    return neonColors[Math.floor(Math.random() * neonColors.length)];
}

let agents = [];

// Generate agents
for (let i = 0; i < 15; i++) {
    let x = random.next(renderer.width);
    let y = random.next(renderer.height);
    agents.push(new Agent(x, y));
}

let lastMouseMoveTime = 0;
const minMouseMoveInterval = 100; // milliseconds

// Define the draw function of the renderer
renderer.draw(() => {
    let voronoi = new c2.LimitedVoronoi();
    voronoi.compute(agents);

    // Display and update agents
    for (let i = 0; i < agents.length; i++) {
        agents[i].display();
        agents[i].update();
    }
});

// Register window resize event handler
window.addEventListener('resize', resize);
// Register mouse move event handler
window.addEventListener('mousemove', onMouseMove);

// Window resize function
function resize() {
    let parent = renderer.canvas.parentElement;
    renderer.size(parent.clientWidth, parent.clientWidth / 16 * 9);
}

// Mouse move event function
function onMouseMove(event) {
    let currentTime = Date.now();
    if (currentTime - lastMouseMoveTime > minMouseMoveInterval) {
        let x = event.clientX;
        let y = event.clientY;
        agents.push(new Agent(x, y));
        lastMouseMoveTime = currentTime;
    }
}


// Second canvas code
// TAU is nicer than PI for trig
const TAU = Math.PI * 2;

// get canvas element & assign to 'cnv'
const secondCanvas = document.getElementById("secondCanvas");

// Define function for resizing canvas
function resize_canvas() {
    // Resize canvas to = viewport
    secondCanvas.width = innerWidth;
    secondCanvas.height = innerHeight;
}

// Assign to .onresize property of window
window.onresize = resize_canvas;

// Initialise canvas size
resize_canvas();

// Get canvas context & assign to 'ctx'
const ctx2 = secondCanvas.getContext('2d');

// Empty array for square objects to go in
const squuares = [];

// Assign to 'mouse_pos' a newly instantiated vector
const mouse_pos = new Vector(0, 0);

// Load ASCII art from file
let ascii_art;
fetch('ascii_art.txt')
    .then(response => response.text())
    .then(data => {
        ascii_art = data;
        // Split ASCII art into lines
        const lines = ascii_art.split('\n');
        // Draw ASCII art on canvas
        ctx2.fillStyle = 'black';
        ctx2.font = '6px monospace'; // Adjust font size here
        ctx2.textAlign = 'left';
        ctx2.textBaseline = 'top';
        // Draw each line of ASCII art
        lines.forEach((line, index) => {
            ctx2.fillText(line, 0, index * 6); // Adjust font size here
        });
        // Kick off the recursive animation sequence
        requestAnimationFrame(draw_frame);
    })
    .catch(error => console.error('Error loading ASCII art:', error));

// Whenever the pointer moves
secondCanvas.onpointermove = pointer_event => {
    // Update the x & y properties of 'mouse_pos' to
    // reflect the x & y properties of the pointer
    mouse_pos.x = pointer_event.x;
    mouse_pos.y = pointer_event.y;
};

// Whenever there is a touch or mouse click
secondCanvas.onpointerdown = pointer_event => {
    // Add an object to the squuares array, in which
    squuares.push({
        // The position = the x & y coordinates of the pointer
        p: new Vector(pointer_event.x, pointer_event.y),
        // The velocity = random direction w magnitude of 18
        v: vector_from_angle(Math.random() * TAU, 18)
    });
};

// Define the recursive animation sequence
function draw_frame() {
    // Clear canvas
    ctx2.clearRect(0, 0, secondCanvas.width, secondCanvas.height);

    // For each square in the 'squuares' array
    squuares.forEach(s => {
        // Random angle for nudge
        const nudge_angle = Math.random() * TAU;

        // Random magnitude for nudge
        const nudge_mag = Math.random() * 8;

        // Create nudge vector
        const nudge = vector_from_angle(nudge_angle, nudge_mag);

        // Nudge the square's position
        s.p.add(nudge);

        // Acceleration: start with a clone of 'mouse_pos'
        const acc = mouse_pos.clone();

        // Subtract the position of the square
        acc.subtract(s.p);

        // Set magnitude to 1
        acc.set_mag(1);

        // Add acceleration to the square's velocity
        s.v.add(acc);

        // If square's velocity is > 18, reduce to 18
        if (s.v.mag() > 18) s.v.set_mag(18);

        // Add velocity to the square's position
        s.p.add(s.v);

        // Draw the ASCII art at the position
        ctx2.fillStyle = 'white';
        ctx2.font = '6px monospace'; // Adjust font size here
        // Draw each line of ASCII art
        const lines = ascii_art.split('\n');
        lines.forEach((line, index) => {
            ctx2.fillText(line, s.p.x, s.p.y + (index * 6)); // Adjust font size here
        });
    });

    // Call the next frame
    requestAnimationFrame(draw_frame);
}
