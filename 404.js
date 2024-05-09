// get rid of default margin
document.body.style.margin = 0;

// get rid of scrollbars
document.body.style.overflow = 'hidden';

// TAU is nicer than PI for trig
const TAU = Math.PI * 2;

// get canvas element & assign to 'cnv'
const cnv = document.getElementById("cnv_id");

// define function for resizing canvas
function resize_canvas() {
    // resize canvas to = viewport
    cnv.width = innerWidth;
    cnv.height = innerHeight;
}

// assign to .onresize property of window
window.onresize = resize_canvas;

// initialise canvas size
resize_canvas();

// get canvas context & assign to 'ctx'
const ctx = cnv.getContext('2d');

// empty array for square objects to go in
const squuares = [];

// assign to 'mouse_pos' a newly instantiated vector
const mouse_pos = new Vector(0, 0);

// Load ASCII art from file
let ascii_art;
fetch('ascii_art.txt')
    .then(response => response.text())
    .then(data => {
        ascii_art = data;
        // split ASCII art into lines
        const lines = ascii_art.split('\n');
        // draw ASCII art on canvas
        ctx.fillStyle = 'black';
        ctx.font = '4px monospace'; // Adjust font size here
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        // draw each line of ASCII art
        lines.forEach((line, index) => {
            ctx.fillText(line, 0, index * 4); // Adjust font size here
        });
        // kick off the recursive animation sequence
        requestAnimationFrame(draw_frame);
    })
    .catch(error => console.error('Error loading ASCII art:', error));

// whenever the pointer moves
cnv.onpointermove = pointer_event => {
    // update the x & y properties of 'mouse_pos' to
    // reflect the x & y properties of the pointer
    mouse_pos.x = pointer_event.x;
    mouse_pos.y = pointer_event.y;
};

// whenever there is a touch or mouse click
cnv.onpointerdown = pointer_event => {
    // add an object to the squuares array, in which
    squuares.push({
        // the position = the x & y coordinates of the pointer
        p: new Vector(pointer_event.x, pointer_event.y),
        // the velocity = random direction w magnitude of 18
        v: vector_from_angle(Math.random() * TAU, 18)
    });
};

// define the recursive animation sequence
function draw_frame() {
    // clear canvas
    ctx.clearRect(0, 0, cnv.width, cnv.height);

    // for each square in the 'squuares' array
    squuares.forEach(s => {
        // random angle for nudge
        const nudge_angle = Math.random() * TAU;

        // random magnitude for nudge
        const nudge_mag = Math.random() * 8;

        // create nudge vector
        const nudge = vector_from_angle(nudge_angle, nudge_mag);

        // nudge the square's position
        s.p.add(nudge);

        // acceleration: start with a clone of 'mouse_pos'
        const acc = mouse_pos.clone();

        // subtract the position of the square
        acc.subtract(s.p);

        // set magnitude to 1
        acc.set_mag(1);

        // add acceleration to the square's velocity
        s.v.add(acc);

        // square's velocity is > 18, reduce to 18
        if (s.v.mag() > 18) s.v.set_mag(18);

        // add velocity to the square's position
        s.p.add(s.v);

        // draw the ASCII art at the position
        ctx.fillStyle = 'black';
        ctx.font = '4px monospace'; // Adjust font size here
        // draw each line of ASCII art
        const lines = ascii_art.split('\n');
        lines.forEach((line, index) => {
            ctx.fillText(line, s.p.x, s.p.y + (index * 4)); // Adjust font size here
        });
    });

    // call the next frame
    requestAnimationFrame(draw_frame);
}
