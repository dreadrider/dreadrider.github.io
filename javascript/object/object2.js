canvas = document.createElement('canvas')
ctx = canvas.getContext('2d')
document.body.appendChild(canvas)
canvas.width = 400
canvas.height = 400
Ptcl = function() {};
Ptcl.pt = Ptcl.prototype
Ptcl.pt.x = 0
Ptcl.pt.y = 0
Ptcl.pt.vx = 0
Ptcl.pt.vy = 0
Ptcl.pt.r = 0
Ptcl.pt.t = 0
Ptcl.pt.vt = 1
Ptcl.pt.dt = 0.01

pause=true;

Math.srandom = function() { return Math.random() * 2 -1; };

Ptcl.pt.init = function() {
	//this.x = Math.random() * canvas.width;
	//this.y = Math.random() * canvas.height;
	//this.vx = Math.srandom() * 30;
	//this.vy = Math.srandom() * 30;
	this.t = - Math.random() * 20;
	this.vt = 1;
	this.r = 10;
	this.color = randomColor();
}

Ptcl.pt.draw = function() {
	if(this.t>0) {
		ctx.fillStyle = this.color;
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
		ctx.closePath();
		ctx.fill();
	}
};

Ptcl.pt.update = function() {
	//this.interact();
	this.t += this.vt * this.dt;
	var t = this.t;
	this.x = Math.pow((t-4),3)-9*(t-4)+28;
	this.x *= 6;
	this.y = Math.pow((t-4),3)-25*(t-4)+90;
	this.y *= 2;
	//this.bound();
}

ptcls = []

function addPtcls(n) {
	for(var i = 0; i < n; i++) {
		var p = new Ptcl();
		p.init();
		ptcls.push(p);
	}
};

function clearPtcls() {
	var n = ptcls.length;
	for(var i = 0; i < n; i++) ptcls.pop();
};

function loop() {
	if(pause) return;
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	for(var i = 0; i < ptcls.length; i++) ptcls[i].update();
	for(var i = 0; i < ptcls.length; i++) ptcls[i].draw();
};
function loopDelegate() { loop(); };

var timer = setInterval(loopDelegate, 1000 / 60);

Ptcl.pt.bound = function() {
	if(this.x < 0) { this.x = 0; this.vx *= -1; }
	if(this.y < 0) { this.y = 0; this.vy *= -1; }
	if(this.x > canvas.width - 1) { this.x = canvas.width - 1; this.vx *= -1; }
	if(this.y > canvas.height -1) { this.y = canvas.height -1; this.vy *= -1; }
}

Ptcl.pt.interact = function() {
	for(var i = 0; i < ptcls.length; i++) {
		var other = ptcls[i];
		if(this != other) {
			var dx = this.x - other.x;
			var dy = this.y - other.y;
			var d = Math.sqrt(dx*dx + dy*dy);
			if(d > 0) {
				var R = this.r + other.r;
				if(d < R) {
					var dR = R -d;
					var ux = dx / d;
					var uy = dy / d;
					this.vx += ux * dR * 0.1;
					this.vy += uy * dR * 0.1;
					other.vx += -ux * dR * 0.1;
					other.vy += -uy * dR * 0.1;
				}
			}
		}
	}
};

function randomColor() {
	return 'hsla(' + Math.floor(Math.random() * 360) + ',100%,50%,0.7)';
}
