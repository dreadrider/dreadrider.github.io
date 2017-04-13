  var canvas = document.getElementById('canvassample');
  var datcont = document.getElementById('datcont');
  var ctx = canvas.getContext('2d');
  var nb = 1;
  var cnt = 10;
  var degree = 0;
  var oldgr = 0;
  var w = 400;
  var hw = Math.floor(w/2);
  canvas.width=w;
  canvas.height=w;
  //datcont.style.left = w+50;
  function cw(dg) {
    ctx.translate(hw,hw);
    ctx.rotate(dg*Math.PI/180);
    ctx.translate(-hw,-hw);
  }
  function ccw(dg) {
    ctx.translate(hw,hw);
    ctx.rotate(-dg*Math.PI/180);
    ctx.translate(-hw,-hw);
  }
  function draw() {
      if(oldgr==0) {
	ctx.clearRect(0, 0, w, w);
	cw(degree);
        oldgr = degree;
      } else {
	ccw(oldgr);
	ctx.clearRect(0, 0, w, w);
	cw(degree);
        oldgr = degree;
      }
      

      ctx.beginPath();
      ctx.moveTo(0,hw);
      ctx.lineTo(w,hw);
      ctx.moveTo(hw,0);
      ctx.lineTo(hw,w);
      ctx.closePath();
      ctx.stroke();  
      ctx.font = "12px 'ＭＳ Ｐゴシック'";
      ctx.fillStyle = "gray";
      for(var i = 0; i <= w; i+=(w/cnt)) {
	for(var j = 0; j <= w; j+=(w/cnt)) {
          ctx.beginPath();
	  ctx.arc(i, j, 1, 0, Math.PI * 2, false);
          ctx.closePath();
          ctx.stroke();
	}
	col = Math.floor((i - hw)/(w/cnt));
	col = Math.round(col*nb*10)/10;
	temp = col.toString();
        ctx.fillText(temp, i, hw+20*(hw/400));
      }
  }	
  draw();

  vctr = function() {};
  vctr.pt = vctr.prototype;
  vctr.pt.init = function(u,v,r,c) {
  	  this.x = u;
  	  this.y = v;
  	  this.vx = u;
	  this.vy = v;
	  this.row = r;
	  this.col = c;
  }
  vctr.pt.setv = function(u,v) {
	  this.vx = this.x + u;
	  this.vy = this.y - v;
  }
  vctr.pt.draw = function() {
	  th = Math.atan((this.vy-this.y)/(this.vx-this.x));
	  if(this.vx-this.x<0) th += Math.PI;
	  ar1x = Math.cos(th+Math.PI*3/4)*5-Math.sin(th+Math.PI*3/4)*0;
	  ar1y = Math.sin(th+Math.PI*3/4)*5+Math.cos(th+Math.PI*3/4)*0;
	  ar2x = Math.cos(th-Math.PI*3/4)*5-Math.sin(th-Math.PI*3/4)*0;
	  ar2y = Math.sin(th-Math.PI*3/4)*5+Math.cos(th-Math.PI*3/4)*0;
	  ctx.beginPath();
	  ctx.moveTo(this.x,this.y);
	  ctx.lineTo(this.vx,this.vy);
	  ctx.lineTo(this.vx+ar1x,this.vy+ar1y);
	  ctx.moveTo(this.vx,this.vy);
	  ctx.lineTo(this.vx+ar2x,this.vy+ar2y);
	  //ctx.closePath();
	  ctx.stroke();
  }
  vctrs = [];
  var fx = 'x';
  var fy = 'y';
  var fvx = Parser.parse(fx);
  var fvy = Parser.parse(fy);
  var sz = 5;
  var bnorm = false;
  var bang = false;
  var bmob = true;

  function addVctrs() {
	for(var i = 0; i<((cnt+1)*(cnt+1)); i++) {
	  row = Math.floor(i / (cnt+1));
	  col = i % (cnt+1);
	  px = (col - cnt/2)*nb;
	  py = (cnt/2 - row)*nb;
	  var v = new vctr();
	  v.init((w/cnt)*col, (w/cnt)*row, px, py);

	  vx=fvx.toJSFunction(['x','y'])(px,py);
	  vy=fvy.toJSFunction(['x','y'])(px,py);
	  norm=(bnorm?Math.sqrt(vx*vx+vy*vy):1);
	  v.setv(vx/norm*sz,vy/norm*sz);
	  vctrs.push(v);
	}
  }
  function clearVctrs() {
	var n = vctrs.length;
	for(var i = 0; i < n; i++) vctrs.pop();
  }
  function drawv() {
	var n = vctrs.length;
	for(var i = 0; i < n; i++) vctrs[i].draw();
  }
  function updateVctrs() {
	var n = vctrs.length;
	for(var i = 0; i < n; i++) {
	  px = vctrs[i].row;
	  py = vctrs[i].col;
	  vx=fvx.toJSFunction(['x','y'])(px,py);
	  vy=fvy.toJSFunction(['x','y'])(px,py);
	  norm=(bnorm?Math.sqrt(vx*vx+vy*vy):1)
	  vctrs[i].setv(vx/norm*sz,vy/norm*sz);
	}
  }

  function updateParser() {
	fvx = Parser.parse(fx);
	fvy = Parser.parse(fy);
	draw();
	updateVctrs();
	drawv();
  }

  addVctrs();
  drawv();
  
  gui = new DAT.GUI({autoPlace:false});
  gui_fx = gui.add(this, 'fx').onFinishChange(function(newValue) {
	fvx = Parser.parse(fx);
	draw();
	updateVctrs();
	drawv();
  });
  gui_fx.name("Function of Vx");
  gui_fy = gui.add(this, 'fy').onFinishChange(function(newValue) {
	fvy = Parser.parse(fy);
	draw();
	updateVctrs();
	drawv();    
  });
  gui_fy.name("Function of Vy");
  gui_sz = gui.add(this, 'sz', 0, 10, 0.1).onChange(function(newValue) {
	draw();
	updateVctrs();
	drawv();    
  });
  gui_sz.name("Vector size");
  gui_nb = gui.add(this, 'nb', 0, 20, 0.1).onChange(function(newValue) {
	draw();
	clearVctrs();
	addVctrs();
	drawv();    
  });
  gui_nb.name("Step size");
  gui_cnt = gui.add(this, 'cnt', 4, 20, 2).onChange(function(newValue) {
	draw();
	clearVctrs();
	addVctrs();
	drawv();    
  });
  gui_cnt.name("Number of point");
  gui_dgr = gui.add(this, 'degree', 0, 180, 15).onChange(function(newValue) {
	draw();
	clearVctrs();
	addVctrs();
	drawv();    
  });
  gui_dgr.name("Rotate of Z axis");
  gui_ba = gui.add(this, 'bang').onChange(function(newValue) {
	if(bang) {
	  degree = 90;
	} else {
	  degree = 0;
	}
	gui_dgr.listen();
	draw();
	updateVctrs();
	drawv();    
  });
  gui_ba.name("90 degree CCW");
  gui_bn = gui.add(this, 'bnorm').onChange(function(newValue) {
	if(bnorm) {
	  gui_sz.max(40).step(1);
	  sz = 20;
	} else {
	  gui_sz.max(10).step(0.1);
	  sz = 5
	}
	gui_sz.listen();
	draw();
	updateVctrs();
	drawv();    
  });
  gui_bn.name("Norm constant");
  gui_bmob = gui.add(this, 'bmob').onChange(function(newValue) {
	if(bmob) {
	  gui_cnt.min(4).max(20).step(2);
	  cnt = 10;
	  w=400;
	  hw = Math.floor(w/2);
	} else {
	  gui_cnt.min(10).max(40).step(2);
	  cnt = 20;
	  w=800;
	  hw = Math.floor(w/2);
	}
	gui_cnt.listen();
	canvas.width=w;
	canvas.height=w;
//	datcont.style.left = w+50;
	draw();
	clearVctrs();
	addVctrs();
	drawv(); 
  });
  gui_bmob.name("Mobile screen");


  gui_up = gui.add(this, 'updateParser');
  gui_up.name("Redraw");
  gui.listenAll();
  datcont.appendChild(gui.domElement);