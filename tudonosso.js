var points = []; // pontos normais de controle
var points1d = [];//pontos primeira derivada
var points2d = [];//pontos segunda derivada
var points3d = []; //pontos terceira derivada
var espessuraDefault = 50;
var numeroPontos = 0;
var numeroPontos1d = 0;
var numeroPontos2d =0;
var numeroPontos3d =0;
var numeroTestes = 300; //mudar dps
var pontoAtual = -1;
var debug = 0;
var release = false;


//----------------------------Calculo dos pontos a mais ------------------------------------




function primeiraDerivada(){
  points1d = [];
    for (var i = 0; i < numeroPontos-1; i+=1) {
      
      var xt = (points[i+1].x - points[i].x) + (canvas2.width/2);
      var yt = (points[i+1].y - points[i].y) + (canvas2.height/2);
      var vt =  {x: xt, y: yt, espessuraDefault};
      points1d[i] = vt;
    }
}
 
  function segundaDerivada(){
    points2d =[];
    for (var i = 0; i < numeroPontos1d - 1; i+=1) {
      var xt = (points1d[i+1].x - points1d[i].x) + (canvas3.width/2);
      var yt = (points1d[i+1].y - points1d[i].y) + (canvas3.height/2);
      var vt =  {x: xt, y: yt, espessuraDefault};
      points2d[i] = vt;
    }
  }
 
  function terceiraDerivada(){
    points3d=[];
    for (var i = 0; i < numeroPontos2d - 1; i+=1) {
      var xt = (points2d[i+1].x - points2d[i].x) + (canvas4.width/2);
      var yt = (points2d[i+1].y - points2d[i].y) + (canvas4.height/2);
      var vt =  {x: xt, y: yt, espessuraDefault};
      points3d[i] = vt;
    }
  }


//----------------------Cavnas-------------------------------------

var canvas = document.getElementById('canvs');
var ctx = canvas.getContext('2d');
var move = false;


resizeCanvas();

function resizeCanvas() {
  canvas.width = parseFloat(window.getComputedStyle(canvas).width);
  canvas.height = parseFloat(window.getComputedStyle(canvas).height);
}

$('#num_avaliacoes').on('change',function(event){//Funcao para editar o numero de avaliações
	numeroTestes = (event.target.value); 
	drawPoints();
})

function dist(p1, p2) {
  var v = {x: p1.x - p2.x, y: p1.y - p2.y};
  return Math.sqrt(v.x * v.x + v.y * v.y);
}

function getIndex(click) {
  for (var i in points) {
    if (dist(points[i], click) <= 10) {
      return i;
    }
  }
  return -1;
}

function drawPoints() {
  //desenha todos os pontos
  
  for (var i in points) {
    if(comCurva1 === true){	
	    ctx.beginPath();
	    ctx.arc(points[i].x, points[i].y, 5, 0, 2 * Math.PI);
	    if(i != pontoAtual) {
		    ctx.fillStyle = 'red';
	    } else {
		    ctx.fillStyle = 'white';
		}
	}
    ctx.fill();
    

    //ligando os pontos
    if(comCurva2 === true){
	    if(i > 0){
        ctx.strokeStyle = "gray";
	      var xAtual = points[i-1].x;
	      var yAtual = points[i-1].y;
        ctx.moveTo(xAtual, yAtual);
	      ctx.lineTo(points[i].x, points[i].y);
	      ctx.stroke();
	    }
	} 

  }

  


  if(numeroPontos > 2) {	  
    if(comCurva3 === true){
      calcularPontosCurva();
    }
  }
  
}

setInterval(() => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);//redesenha o canvas
  drawPoints();
}, 100);



function drawCurve(pointsCurve) {
  numeroPontos1d = numeroPontos -1;
  numeroPontos2d = numeroPontos -2;
  numeroPontos3d = numeroPontos -3; 
  if(numeroPontos > 2) {
    for(var i in pointsCurve) {
      ctx.beginPath();
      
      if(i > 0) {
        ctx.strokeStyle = "black";
        var xAtual = pointsCurve[i-1].x;
        var yAtual = pointsCurve[i-1].y;
        ctx.moveTo(xAtual, yAtual);
        ctx.lineTo(pointsCurve[i].x, pointsCurve[i].y);
        ctx.stroke();
      }
    }
  
  
  }
}

//-----------------------------------------------------------------------------------------------
function calcularPontosCurva() {
  var pointsCurve = [];
  //para cada avaliacao:
  //var t = 1/2;
  var t = 0;
  for(var cont = 0; cont < numeroTestes; t = t + 1/numeroTestes, cont++){
  	var pointsDeCasteljau = points.slice(0, numeroPontos + 1);
    //para cada nivel:
    for(var n = 1; n < numeroPontos; n++) {
      //para cada ponto:
      for(var p = 0; p < numeroPontos - n; p++) {
        var cordX = (1 - t) * pointsDeCasteljau[p].x + t * pointsDeCasteljau[p+1].x;
        var cordY = (1 - t) * pointsDeCasteljau[p].y + t * pointsDeCasteljau[p+1].y;
        pointsDeCasteljau[p] = {x: cordX, y: cordY};
      }
    }
    pointsCurve.push(pointsDeCasteljau[0]);
  }
  drawCurve(pointsCurve);

}





canvas.addEventListener('mousemove', e => {
  release = false;
  if(move){
    var antigo = points[index];
    points[index] = {x: e.offsetX, y: e.offsetY, e: antigo.e};
    drawPoints();
    release = true;
  }
  if(release){
    primeiraDerivada();
    segundaDerivada();
    terceiraDerivada();
    
    }        
});

canvas.addEventListener('mouseup', e => {
  move = false;
});


canvas.addEventListener('dblclick', e => {
    if (index !== -1) {
        points.splice(index, 1);
        numeroPontos--;
        numeroPontos1d = numeroPontos -1;
  numeroPontos2d = numeroPontos -2;
  numeroPontos3d = numeroPontos -3; 
        //ajeitar aqui pra remover nas derivadas
        primeiraDerivada();
        segundaDerivada();
        terceiraDerivada();
        
        
    }
});


canvas.addEventListener('mousedown', e => {
  var click = {x: e.offsetX, y: e.offsetY, e:espessuraDefault};
  index = getIndex(click);
  if (index === -1) {
    numeroPontos = numeroPontos + 1;
    points.push(click);
    pontoAtual = numeroPontos - 2;
    drawPoints();
    console.log("numero de pontos 1d: "+numeroPontos1d+" numero de numeroPoints: "+numeroPontos);
    console.log("numero tamanho de points1d: "+points1d.length);
    primeiraDerivada();
    segundaDerivada();
    terceiraDerivada();
    drawPoints1d();
    drawPoints2d();
    drawPoints3d();
  } else {
    move = true;
    pontoAtual = index;
  }
  
});


var comCurva1 = true;
function comCurvachange1(){
    if (comCurva1===true){
        comCurva1 = false;

    }else if ( comCurva1 ===false){
        comCurva1 = true;

    } 
}



var comCurva2 = true;
function comCurvachange2(){
    if (comCurva2===true){
        comCurva2 = false;

    }else if ( comCurva2 ===false){
        comCurva2 = true;

    } 
}

var comCurva3 = true;
function comCurvachange3(){
    if (comCurva3===true){
        comCurva3 = false;

    }else if ( comCurva3 ===false){
        comCurva3 = true;

    } 
}

//----------------------Cavnas2-------------------------------------
var canvas2 = document.getElementById('canvs2');
var ctx2 = canvas2.getContext('2d');


resizeCanvas2();

function resizeCanvas2() {
  canvas2.width = parseFloat(window.getComputedStyle(canvas2).width);
  canvas2.height = parseFloat(window.getComputedStyle(canvas2).height);
}

$('#num_avaliacoes').on('change',function(event){//Funcao para editar o numero de avaliações
	numeroTestes = (event.target.value); 
	drawPoints1d();
})


function drawPoints1d() {
  //desenha todos os pontos
  for (var i in points1d) {
    if(comCurva1 === true){	
	    ctx2.beginPath();
	    ctx2.arc(points1d[i].x, points1d[i].y, 5, 0, 2 * Math.PI);
	
		ctx2.fillStyle = 'red';
	   
	}
    ctx2.fill();

    //ligando os pontos
    if(comCurva2 === true){
      
	    if(i > 0){
        ctx2.strokeStyle = "gray";
	      var xAtual = points1d[i-1].x;
	      var yAtual = points1d[i-1].y;
	      ctx2.moveTo(xAtual, yAtual);
	      ctx2.lineTo(points1d[i].x, points1d[i].y);
	      ctx2.stroke();
	    }
	}




  }

  if(numeroPontos1d > 2) {
	  
	  
	if(comCurva3 === true){
	  calcularPontosCurva1d();
	}

	}
}

setInterval(() => {
  ctx2.clearRect(0, 0, canvas2.width, canvas2.height);//redesenha o canvas
  drawPoints1d();
}, 100);



function drawCurve1d(pointsCurve) {
  if(numeroPontos1d > 2) {
    for(var i in pointsCurve) {
      ctx2.beginPath();
      
      if(i > 0) {
        ctx2.strokeStyle = "black";
        var xAtual = pointsCurve[i-1].x;
        var yAtual = pointsCurve[i-1].y;
        ctx2.moveTo(xAtual, yAtual);
        ctx2.lineTo(pointsCurve[i].x, pointsCurve[i].y);
        ctx2.stroke();
      }
    }
  }
}

function calcularPontosCurva1d() {
  var pointsCurve = [];  
  //para cada avaliacao:
  //var t = 1/2;
  var t = 0;
  for(var cont = 0; cont < numeroTestes; t = t + 1/numeroTestes, cont++){
  	var pointsDeCasteljau = points1d.slice(0, numeroPontos1d + 1);
    //para cada nivel:
    for(var n = 1; n < numeroPontos1d; n++) {
      //para cada ponto:
      for(var p = 0; p < numeroPontos1d - n; p++) {
        var cordX = (1 - t) * pointsDeCasteljau[p].x + t * pointsDeCasteljau[p+1].x;
        var cordY = (1 - t) * pointsDeCasteljau[p].y + t * pointsDeCasteljau[p+1].y;
        pointsDeCasteljau[p] = {x: cordX, y: cordY};
      }
    }
    pointsCurve.push(pointsDeCasteljau[0]);
  }
  drawCurve1d(pointsCurve);

}


//----------------------Cavnas3-------------------------------------

var canvas3 = document.getElementById('canvs3');
var ctx3 = canvas3.getContext('2d');


resizeCanvas3();

function resizeCanvas3() {
  canvas3.width = parseFloat(window.getComputedStyle(canvas3).width);
  canvas3.height = parseFloat(window.getComputedStyle(canvas3).height);
}

$('#num_avaliacoes').on('change',function(event){//Funcao para editar o numero de avaliações
	numeroTestes = (event.target.value); 
	drawPoints2d();
})


function drawPoints2d() {
  //desenha todos os pontos
  for (var i in points2d) {
    if(comCurva1 === true){	
	    ctx3.beginPath();
	    ctx3.arc(points2d[i].x, points2d[i].y, 5, 0, 2 * Math.PI);
	
		ctx3.fillStyle = 'red';
	   
	}
    ctx3.fill();

    //ligando os pontos
    if(comCurva2 === true){
	    if(i > 0){
        ctx3.strokeStyle = "gray";
	      var xAtual = points2d[i-1].x;
	      var yAtual = points2d[i-1].y;
	      ctx3.moveTo(xAtual, yAtual);
	      ctx3.lineTo(points2d[i].x, points2d[i].y);
	      ctx3.stroke();
	    }
	}
  }

  if(numeroPontos2d > 2) {
	  
	  
	if(comCurva3 === true){
	  calcularPontosCurva2d();
	}

	}
}

setInterval(() => {
  ctx3.clearRect(0, 0, canvas3.width, canvas3.height);//redesenha o canvas
  drawPoints2d();
}, 100);



function drawCurve2d(pointsCurve) {
  if(numeroPontos2d > 2) {
    for(var i in pointsCurve) {
      ctx3.beginPath();
      
      if(i > 0) {
        ctx3.strokeStyle = "black";
        var xAtual = pointsCurve[i-1].x;
        var yAtual = pointsCurve[i-1].y;
        ctx3.moveTo(xAtual, yAtual);
        ctx3.lineTo(pointsCurve[i].x, pointsCurve[i].y);
        ctx3.stroke();
      }
    }
  }
}

function calcularPontosCurva2d() {
  var pointsCurve = [];
  //para cada avaliacao:
  //var t = 1/2;
  var t = 0;
  for(var cont = 0; cont < numeroTestes; t = t + 1/numeroTestes, cont++){
  	var pointsDeCasteljau = points2d.slice(0, numeroPontos2d + 1);
    //para cada nivel:
    for(n = 1; n < numeroPontos2d; n++) {
      //para cada ponto:
      for(p = 0; p < numeroPontos2d - n; p++) {
        var cordX = (1 - t) * pointsDeCasteljau[p].x + t * pointsDeCasteljau[p+1].x;
        var cordY = (1 - t) * pointsDeCasteljau[p].y + t * pointsDeCasteljau[p+1].y;
        pointsDeCasteljau[p] = {x: cordX, y: cordY};
      }
    }
    pointsCurve.push(pointsDeCasteljau[0]);
  }
  drawCurve2d(pointsCurve);

}

//----------------------Cavnas4-------------------------------------

var canvas4 = document.getElementById('canvs4');
var ctx4 = canvas4.getContext('2d');



resizeCanvas4();

function resizeCanvas4() {
  canvas4.width = parseFloat(window.getComputedStyle(canvas4).width);
  canvas4.height = parseFloat(window.getComputedStyle(canvas4).height);
}

$('#num_avaliacoes').on('change',function(event){//Funcao para editar o numero de avaliações
	numeroTestes = (event.target.value); 
	drawPoints3d();
})


function drawPoints3d() {
  //desenha todos os pontos
  for (var i in points3d) {
    if(comCurva1 === true){	
	    ctx4.beginPath();
	    ctx4.arc(points3d[i].x, points3d[i].y, 5, 0, 2 * Math.PI);
	
		ctx4.fillStyle = 'red';
	   
	}
    ctx4.fill();

    //ligando os pontos
    if(comCurva2 === true){
	    if(i > 0){
        ctx4.strokeStyle = "gray";
	      var xAtual = points3d[i-1].x;
	      var yAtual = points3d[i-1].y;
	      ctx4.moveTo(xAtual, yAtual);
	      ctx4.lineTo(points3d[i].x, points3d[i].y);
	      ctx4.stroke();
	    }
	}




  }

  if(numeroPontos3d > 2) {
	 
	  
	if(comCurva3 === true){
	  calcularPontosCurva3d();
	}

	}
}

setInterval(() => {
  ctx4.clearRect(0, 0, canvas4.width, canvas4.height);//redesenha o canvas
  drawPoints3d();
}, 100);



function drawCurve3d(pointsCurve) {
  if(numeroPontos3d > 2) {
    for(var i in pointsCurve) {
      ctx4.beginPath();
      
      if(i > 0) {
        ctx4.strokeStyle = "black";
        var xAtual = pointsCurve[i-1].x;
        var yAtual = pointsCurve[i-1].y;
        ctx4.moveTo(xAtual, yAtual);
        ctx4.lineTo(pointsCurve[i].x, pointsCurve[i].y);
        ctx4.stroke();
      }
    }
  }
}

function calcularPontosCurva3d() {
  var pointsCurve = [];
  //para cada avaliacao:
  //var t = 1/2;
  var t = 0;
  for(var cont = 0; cont < numeroTestes; t = t + 1/numeroTestes, cont++){
  	var pointsDeCasteljau = points3d.slice(0, numeroPontos3d + 1);
    //para cada nivel:
    for(n = 1; n < numeroPontos3d; n++) {
      //para cada ponto:
      for(p = 0; p < numeroPontos3d - n; p++) {
        var cordX = (1 - t) * pointsDeCasteljau[p].x + t * pointsDeCasteljau[p+1].x;
        var cordY = (1 - t) * pointsDeCasteljau[p].y + t * pointsDeCasteljau[p+1].y;
        pointsDeCasteljau[p] = {x: cordX, y: cordY};
      }
    }
    pointsCurve.push(pointsDeCasteljau[0]);
  }
  drawCurve3d(pointsCurve);

}


