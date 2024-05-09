    // 첫 번째 캔버스에 대한 코드
    document.body.style.margin = 0;
    document.body.style.overflow = 'hidden';

    const firstCanvas = document.getElementById("firstCanvas");
    const renderer = new c2.Renderer(firstCanvas);

    resize();

    renderer.background('#000000');
    let random = new c2.Random();

    const maxWidth = 400; // 최대 너비
    const maxHeight = 200; // 최대 높이    

    class Agent extends c2.Cell {
        constructor(x, y) {
            let r = random.next(renderer.width / 40, renderer.width / 15);
            super(x, y, r);
    
            this.vx = random.next(-2, 2);
            this.vy = random.next(-2, 2);
            // 형광색이나 네온색으로 무작위로 색상 선택
            this.color = randomNeonColor();
            // 랜덤한 너비와 높이 생성
            this.randomWidth = Math.random() * maxWidth; // maxWidth는 원하는 최대 너비입니다.
            this.randomHeight = Math.random() * maxHeight; // maxHeight는 원하는 최대 높이입니다.
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
                renderer.rect(this.p.x, this.p.y, this.randomWidth, this.randomHeight); // 랜덤한 너비와 높이로 직사각형 그리기

                renderer.stroke(c2.Color.rgb(255, 0, 255));
                renderer.lineWidth(5);
                renderer.text("CLICK!", this.p.x, this.p.y, Math.PI / 4); // 포인트 대신에 글씨 표시

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

    // 두 번째 캔버스에 대한 코드
    // get rid of default margin
    // document.body.style.margin = 0;

    // get rid of scrollbars
    // document.body.style.overflow = 'hidden';

    // TAU is nicer than PI for trig
    const TAU = Math.PI * 2;

    // get canvas element & assign to 'cnv'
    const secondCanvas = document.getElementById("secondCanvas");

    // define function for resizing canvas
    function resize_canvas() {
        // resize canvas to = viewport
        secondCanvas.width = innerWidth;
        secondCanvas.height = innerHeight;
    }

    // assign to .onresize property of window
    window.onresize = resize_canvas;

    // initialise canvas size
    resize_canvas();

    // get canvas context & assign to 'ctx'
    const ctx2 = secondCanvas.getContext('2d');

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
            ctx2.fillStyle = 'black';
            ctx2.font = '6px monospace'; // Adjust font size here
            ctx2.textAlign = 'left';
            ctx2.textBaseline = 'top';
            // draw each line of ASCII art
            lines.forEach((line, index) => {
                ctx2.fillText(line, 0, index * 6); // Adjust font size here
            });
            // kick off the recursive animation sequence
            requestAnimationFrame(draw_frame);
        })
        .catch(error => console.error('Error loading ASCII art:', error));

    // whenever the pointer moves
    secondCanvas.onpointermove = pointer_event => {
        // update the x & y properties of 'mouse_pos' to
        // reflect the x & y properties of the pointer
        mouse_pos.x = pointer_event.x;
        mouse_pos.y = pointer_event.y;
    };

    // whenever there is a touch or mouse click
    secondCanvas.onpointerdown = pointer_event => {
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
        ctx2.clearRect(0, 0, secondCanvas.width, secondCanvas.height);

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
            ctx2.fillStyle = 'white';
            ctx2.font = '6px monospace'; // Adjust font size here
            // draw each line of ASCII art
            const lines = ascii_art.split('\n');
            lines.forEach((line, index) => {
                ctx2.fillText(line, s.p.x, s.p.y + (index * 6)); // Adjust font size here
            });
        });

        // call the next frame
        requestAnimationFrame(draw_frame);
    }