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

Qt = []



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
	temp_py = this.y
        this.y += 1
	return temp_py
}

Bar.pt.init = function() {
	this.x = Math.floor(Math.random() * 26 - 3);
	this.y = 200;
}

Bar.pt.draw = function() {
	ctx.fillStyle = "rgb(0,0,0)";
	ctx.beginPath();
	ctx.rect(this.x*10-20, this.y, 50, 10);
	ctx.closePath();
	ctx.fill();
}

Bar.pt.move = function(tpy) {
	temp_bx = this.x
	dir01 = Qt[p.x][tpy][this.x+3][0] > Qt[p.x][tpy][this.x+3][1]
	dir02 = Qt[p.x][tpy][this.x+3][0] > Qt[p.x][tpy][this.x+3][2]
	dir12 = Qt[p.x][tpy][this.x+3][1] > Qt[p.x][tpy][this.x+3][2]
	if (dir01) {
	    if (dir02) { dir = 0; this.x -= 1 } // max is 0
	    else { dir = 2; this.x += 0 } // max is 2
	}
	else if (dir12) { dir = 1; this.x += 1 } // max is 1
	else { dir = 2; this.x += 0} // max is 2
	this.bound()
	ret = []
	ret.push(temp_bx)
	ret.push(dir)
	return ret
}

Bar.pt.bound = function() {
	if(this.x < -3) { this.x = -3 }
	if(this.x > 22) { this.x = 22 }
}

ptcls = []
pause = true

succ = 0
fail = 0
done = 0
step = 0

result = []

var read = function(){
    data = jQuery.get("datato3000.csv", null, function(){
	reader = data.responseText;
	temp = reader.split("\n")
	for (i=0;i<temp.length;i++) {
	    result[i] = temp[i].split(",")
	}
	console.log(result);
	document.getElementById("output2").innerText = reslut;
    })
}

var datawrite = document.getElementById("wdata")
datawrite.addEventListener("change",function(evt) {
    file = evt.target.files
    writer = new FileReader();
    reader.readAsText(file[0]);
    reader.onload = function(ev) {
	console.log(reader.result);
    }
},false)

function gameinit() {
    p = new Ptcl()
    p.init()
    p.draw()

    b = new Bar()
    b.init()
    b.draw()

    for (i=0;i<20;i++) {
        Qt_sub = []
        for (j=0;j<20;j++) {
	    Qt_ssub = []
	    for (k=0;k<26;k++) {
		Qt_sssub = []
		for (dir=0;dir<3;dir++) {
		    Qt_dir = 0
//		    dir.push(0)
		    Qt_sssub.push(Qt_dir)
		}
		Qt_ssub.push(Qt_sssub)
	    }
	    Qt_sub.push(Qt_ssub)
	}
	Qt.push(Qt_sub)
    }

    if(result.length != 0){
    for (i=0;i<20;i++) {
        for (j=0;j<20;j++) {
	    for (k=0;k<26;k++) {
		for (dir=0;dir<3;dir++) {
		    Qt[i][j][k][dir]=result[i*20*26+j*26+k][dir]
		}
	    }
	}
    }
    console.log(Qt)
    }


    target = document.getElementById("output");
}

function pausebut() {
    pause = !pause
}

function loopDelegate() { episode(); }; 
var timer = setInterval(loopDelegate,100)

function episode() {
    if(pause) return;
    step++
    movement()
    if(succ>999) {
	target.innerHTML += "<br>Finish";	
	//console.log("10th success")
	clearInterval(timer)
	printout()
    }
}

function movement() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    tpy = p.move()
    tmp = b.move(tpy)
    tbx = tmp[0]
    dir = tmp[1]
    chk(tpy,tbx,dir)
    p.draw()
    b.draw()
}

function chk(tpy,tbx,dir) {
    reward = 0
    if (p.y > 19) {
        done = 1
        if (p.x >= b.x -2 && p.x <= b.x + 2) {
	    reward = 100
	    succ += 1
	    target.innerHTML = "Success : " + succ + " Fail : " + fail;
//            console.log("success")
	}
        else {
	    reward = -100
	    fail += 1
	    target.innerHTML = "Success : " + succ + " Fail : " + fail;
//	    console.log("fail")
	}
//	clearInterval(timer)
	Qt[p.x][tpy][tbx+3][dir] = reward
//	console.log(p.x,tpy,tbx+3,dir,reward,Qt[p.x][tpy][tbx+3][dir])
	p.init()
//	b.init()
        step = 0
    }
    else {
	Qt[p.x][tpy][tbx+3][dir] = reward + 0.9 * Math.max(Qt[p.x][p.y][b.x+3][0],Qt[p.x][p.y][b.x+3][1],Qt[p.x][p.y][b.x+3][2])
    }
}

function printout() {
    textout = ""
    for (i=0;i<20;i++) {
        Qt_sub = []
        for (j=0;j<20;j++) {
	    Qt_ssub = []
	    for (k=0;k<26;k++) {
		Qt_sssub = []
		for (dir=0;dir<3;dir++) {
		    textout += Qt[i][j][k][dir] + ", "
		}
		Qt_ssub.push(Qt_sssub)
		textout += "<br>"
	    }
	    Qt_sub.push(Qt_ssub)
	}
	Qt.push(Qt_sub)
    }
    target = document.getElementById("output2");
    target.innerHTML = textout
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