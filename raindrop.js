canvas = document.createElement('canvas')
ctx = canvas.getContext('2d')
document.body.appendChild(canvas)
canvas.width = 200
canvas.height = 210
canvas.style.backgroundColor = "rgb(255,200,200)"

Ptcl = function() {};
Ptcl.pt = Ptcl.prototype
Ptcl.pt.x = 0
Ptcl.pt.y = 0
Ptcl.pt.vx = 0
Ptcl.pt.vy = 10
Ptcl.pt.dt = 1

Bar = function() {};
Bar.pt = Bar.prototype
Bar.pt.x = 0
Bar.pt.y = 0
Bar.pt.vx = 10
Bar.pt.dt = 1

Ptcl.pt.init = function() {
	this.x = Math.floor(Math.random() * 20);
	this.y = 0;
}

Ptcl.pt.draw = function() {
	ctx.fillStyle = "rgb(0,0,0)";
	ctx.beginPath();
	ctx.rect(this.x*10, this.y*10, 10, 10);
	ctx.closePath();
	ctx.fill();
};

Ptcl.pt.move = function() {
        this.y += 1
}

Ptcl.pt.bound = function() {
	if(this.y < 0) { this.y = 0; this.vy *= -1; }
	if(this.y > canvas.height -10) { this.y = canvas.height -10; this.vy *= -1; }
}

Bar.pt.init = function() {
	this.x = Math.floor(Math.random() * 16 + 2);
	this.y = 200;
}

Bar.pt.draw = function() {
	ctx.fillStyle = "rgb(0,0,0)";
	ctx.beginPath();
	ctx.rect(this.x*10-20, this.y, 50, 10);
	ctx.closePath();
	ctx.fill();
}

Bar.pt.move = function() {
	dir = Math.floor(Math.random()*3)
	if (dir) {this.x += 1}
	else if (dir < 1) { this.x -= 1 }
}

ptcls = []
pause = true

succ = 0
fail = 0
done = 0
step = 0

function gameinit() {
    p = new Ptcl()
    p.init()
    p.draw()

    b = new Bar()
    b.init()
    b.draw()

    target = document.getElementById("output");
}

function pausebut() {
    pause = !pause
}

function loopDelegate() { episode(); }; 
var timer = setInterval(loopDelegate,1)

function episode() {
    if(pause) return;
    step++
    movement()
    if(succ>9) {
	target.innerHTML += "<br>Finish";	
	//console.log("10th success")
	clearInterval(timer)
    }
}

function movement() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    p.move()
    b.move()
    chk()
    p.draw()
    b.draw()
}

function chk() {
    if (p.y > 20) {
        done = 1
        if (p.x > b.x -2 && p.x < b.x + 2) {
	    succ += 1
	    target.innerHTML = "Success : " + succ + " Fail : " + fail;
            console.log("success")
	}
        else {
	    fail += 1
	    target.innerHTML = "Success : " + succ + " Fail : " + fail;
	    console.log("fail")
	}
//	clearInterval(timer)
	p.init()
	b.init()
        step = 0
    }
}

function auto() {
    var i = 0;
    timer = setInterval(function (){
        p_test.update()
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        p_test.draw()
        b_test.draw()
        i++;
	if(i>50) { clearInterval(timer); }
    },50)
}

/*function loop() {
	if(pause) return;
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	for(var i = 0; i < ptcls.length; i++) ptcls[i].update();
	for(var i = 0; i < ptcls.length; i++) ptcls[i].draw();
};
function loopDelegate() { loop(); };

var timer = setInterval(loopDelegate, 1000 / 60);*/