  var canvas = document.getElementById('canvassample');
  var ctx = canvas.getContext('2d');
  function draw() {
      ctx.beginPath();
      ctx.moveTo(0,hw);
      ctx.lineTo(w,hw);
      ctx.moveTo(hw,0);
      ctx.lineTo(hw,w);
      ctx.closePath();
      ctx.stroke();  
  }	
  draw();

  vctr = function() {};
  vctr.pt = vctr.prototype;
  vctr.pt.init = function(u,v,r,c) {
  	  this.x = u;
  	  this.y = v;
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
  function addVctrs() {
	for(var i = 0; i<((cnt+1)*(cnt+1)); i++) {
	  var v = new vctr();
	  v.init((w/cnt)*col, (w/cnt)*row, px, py);
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
	  vctrs[i].setv(vx/norm*sz,vy/norm*sz);
	}
  }

  addVctrs();
  drawv();