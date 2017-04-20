canvas = document.createElement('canvas')
ctx = canvas.getContext('2d')
document.body.appendChild(canvas)
canvas.width = 500
canvas.height = 500
Ptcl = function() {};
Ptcl.pt = Ptcl.prototype
Ptcl.pt.x = 0
Ptcl.pt.y = 0
Ptcl.pt.vx = 0
Ptcl.pt.vy = 0
Ptcl.pt.r = 0
Ptcl.pt.t = 0
Ptcl.pt.vt = 1
Ptcl.pt.dt = 0.03

pause=0;

Math.srandom = function() { return Math.random() * 2 -1; };

Ptcl.pt.init = function(n) {
	//this.x = Math.random() * canvas.width;
	//this.y = Math.random() * canvas.height;
	//this.vx = Math.srandom() * 30;
	//this.vy = Math.srandom() * 30;
	//this.t = - Math.random() * 20;
	this.t = -n+Math.srandom()*0.4;
	this.vt = Math.random() * 1.8 + 0.2;
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
	this.x *= 3;
	this.y = Math.pow((t-4),3)-25*(t-4)+90;
	this.y *= 3;
	//this.bound();
}

ptcls = []

function addPtcls(n) {
	for(var i = 0; i < n; i++) {
		var p = new Ptcl();
		p.init(i);
		ptcls.push(p);
	}
};

function clearPtcls() {
	var n = ptcls.length;
	for(var i = 0; i < n; i++) ptcls.pop();
};

count=0;

function loop() {
	if(pause) return;
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	ctx.strokeStyle='hsl(0,100%,90%)';
	ctx.beginPath();
	for(var t = 0; t<10; t+=0.1) {
		x = Math.pow((t-4),3)-9*(t-4)+28;
		y = Math.pow((t-4),3)-25*(t-4)+90;
		x *= 3;
		y *= 3;
		if(t==0) { ctx.moveTo(x,y); } else { ctx.lineTo(x,y);}
	}
	ctx.stroke();

	ctx.strokeStyle='black';
	for(var i=0; i<2; i++) {
		ctx.beginPath();
		for(var t = 0.1; t<10; t+=0.1) {
			x = Math.pow((t-4),3)-9*(t-4)+28;
			y = Math.pow((t-4),3)-25*(t-4)+90;

			dx = 3*Math.pow((t-4),2)-9;
			dy = 3*Math.pow((t-4),2)-25;
			d = Math.sqrt(dx*dx+dy*dy);
			tx = dx/d;
			ty = dy/d;
			tx90 = -ty;
			ty90 = tx;

			//if(count==0) console.log(x,y,dx,dy,tx,ty);

			if(i==0) {
				x += tx90*5;
				y += ty90*5;
			} else {
				x -= tx90*5;
				y -= ty90*5;
			}
			x *= 3;
			y *= 3;
		if(t==0) { ctx.moveTo(x,y); } else { ctx.lineTo(x,y);}
		}
		ctx.stroke();
	}

	for(var i = 0; i < ptcls.length; i++) ptcls[i].update();
	for(var i = 0; i < ptcls.length; i++) ptcls[i].draw();
	count++;
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

function pclick() {
	pause = 1 - pause;
}

function aclick() {
	addPtcls(10);
}