const canvas = document.getElementById('canvas')
const ctx    = canvas.getContext('2d')

const width  = canvas.width;
const height = canvas.height;
const Pic = new Image();

let current;
let selection = []
var cStep = -1;
let offset = 0
let ogh = []

const tools = {
    circle: {
        mousedown(e){
            current = new Circle(e.clientX,e.clientY, 1, color.value)
        },
        mousemove(e){
            if (!current) return;
            
            current.radius = current.distanceTo(e.clientX, e.clientY)
            Drawable.drawAll()
        },

        mouseup(e){
            current = null
            cPush()
        }
    },
    line: {
        mousedown(e){
            current = new Line(e.clientX, e.clientY, 0, 0, color.value, +size.value)
        },
        mousemove(e){
            if (!current) return;

            current.width = e.clientX - current.x
            current.height = e.clientY - current.y

            Drawable.drawAll()
        },

        mouseup(e){
            current = null
            cPush()
        }
    },
    oval: {
        mousedown(e){
            current = new Oval(e.clientX,e.clientY, e.radiusX,e.radiusY, color.value)
        },
        mousemove(e){
            if (!current) return;
            current.radiusX = current.distanceToX(e.clientX)
            current.radiusY = current.distanceToY(e.clientY)
            // current.radius = current.distanceTo(e.clientX, e.clientY)
            Drawable.drawAll()
        },

        mouseup(e){
            current = null
            cPush()
        }
    },
    rect: {

        mousedown(e){
            current = new Rect(e.clientX,e.clientY, e.width,e.height, color.value)
        },
        mousemove(e){
            if (!current) return;
            current.width = -(current.distanceToXY(e.clientX,e.clientY)[1])
            current.height =  -(current.distanceToXY(e.clientX,e.clientY)[0])
            // current.radius = current.distanceTo(e.clientX, e.clientY)
            Drawable.drawAll()
        },

        mouseup(e){
            current = null
            cPush()
        }

    },
    select: {
        mousedown(e){
            current = new Select(e.clientX,e.clientY, e.width,e.height, color.value)
        },
        mousemove(e){
            if (!current) return;
            current.width = -(current.distanceToXY(e.clientX,e.clientY)[1])
            current.height =  -(current.distanceToXY(e.clientX,e.clientY)[0])
            ogh.push({x: e.clientX,y: e.clientY})
            Drawable.drawAll()
        },
        mouseup(e){
            for (const key of ogh) {
                console.log(key)
            }
            console.log()
            current = null
            cPush()
        }
    },
}

undo.onclick = () => Drawable.undo();


function superHandler(evt){
    let t = tools[tool.value]
    if (typeof t[evt.type] === 'function')
        t[evt.type].call(this, evt)
        
        
}

canvas.onmousemove = superHandler
canvas.onmouseup   = superHandler
canvas.onmousedown = superHandler
canvas.onclick = superHandler

////


function Drawable(){
   Drawable.addInstance(this);
}

const distance = (x1,y1, x2, y2) => ((x1-x2)**2 + (y1-y2)**2)**0.5
const distanceX = (x1, x2) => x1-x2
const distanceY = (y1, y2) => y1-y2


Drawable.prototype.draw = function(){};
Drawable.prototype.distanceTo = function(x,y){
    if (typeof this.x !== 'number' ||
        typeof this.y !== 'number'){
        return NaN
    }
    return distance(this.x, this.y, x, y)
};

Drawable.prototype.distanceToX = function(x){
    if (typeof this.x !== 'number'){
        return NaN
    }

    return Math.abs(distanceX(this.x,x))
};

Drawable.prototype.distanceToY = function(y){
    if (typeof this.y !== 'number'){
        return NaN
    }

    return Math.abs(distanceY(this.y,y))
};

Drawable.prototype.distanceToXY = function(x,y){
    if (typeof this.x !== 'number' ||
        typeof this.y !== 'number'){
        return NaN
    }

    return [distanceY(this.y,y),distanceX(this.x,x)]
};


Drawable.instances = [];
Drawable.PushArray = new Array();


function cPush() {
    cStep++;
    if (cStep < Drawable.PushArray.length) { Drawable.PushArray.length = cStep; }
    Drawable.PushArray.push(document.getElementById('canvas').toDataURL());
}



Drawable.undo =  function() {
    if (cStep >0) {
        cStep--;
        Pic.src = Drawable.PushArray[cStep];
        Drawable.instances.pop()
        Drawable.PushArray.pop()
        Pic.onload = function() {
            ctx.clearRect(0, 0, width, height)
            ctx.drawImage(Pic,0,0);
          }; 
    }
}


Drawable.addInstance = function(item){
    Drawable.instances.push(item);
}

Drawable.drawAll = function(selection=[]){
    ctx.clearRect(0,0,width,height);
    Drawable.forAll(item => item.draw())
    selection.forEach(item  => item.draw(true))
}

Drawable.forAll = function(callback){
    for(var i = 0; i<Drawable.instances.length;i++){
        callback(Drawable.instances[i])
    }
}

class Circle extends Drawable {
    constructor(x,y,radius, color){
        super()
        this.x      = x;
        this.y      = y;
        this.radius = radius;
        this.color  = color;

        this.draw(); 
    }

    draw(selected){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fillStyle = this.color;
        if (selected){
            ctx.lineWidth = 2
            ctx.stroke();
        }
        ctx.fill();
    }

    in(x,y){
        return this.distanceTo(x,y) < this.radius
    }

    inBounds(x,y,w,h){ // x = 100, this.x = 102, w = 5
        return this.x >= x && this.x <= x + w &&
               this.y >= y && this.y <= y + h 
    }
}


class Oval extends Drawable {
    constructor(x,y,radiusX,radiusY, color){
        super()
        this.x      = x;
        this.y      = y;
        this.radiusX = radiusX;
        this.radiusY = radiusY;
        this.color  = color;

        this.draw(); 
    }

    draw(selected){
        ctx.beginPath();
        ctx.ellipse(this.x, this.y, this.radiusX,  this.radiusY,  Math.PI / 4, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fillStyle = this.color;
        if (selected){
            ctx.lineWidth = 2
            ctx.stroke();
        }
        ctx.fill();
    }

    // draw(selected){
    //     ctx.save();
    //     ctx.scale(0.5, 1);
    //     ctx.beginPath();
    //     ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI,false);
    //     ctx.closePath();
    //     ctx.fillStyle = this.color;
    //     if (selected){
    //         ctx.lineWidth = 2
    //         ctx.stroke();
    //     }
    //     ctx.restore();
    //     ctx.fill();
    // }




    inBounds(x,y,w,h){ // x = 100, this.x = 102, w = 5
        return this.x >= x && this.x <= x + w &&
               this.y >= y && this.y <= y + h 
    }
}


class Rect extends Drawable {
    constructor(x,y,width,height, color){
        super()
        this.x      = x;
        this.y      = y;
        this.width = width;
        this.height = height;
        this.color  = color;

        this.draw(); 
    }

    draw(selected){
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.closePath();
        ctx.fillStyle = this.color;
        if (selected){
            ctx.lineWidth = 2
            ctx.stroke();
        }
        ctx.fill();
    }



    inBounds(x,y,w,h){ // x = 100, this.x = 102, w = 5
        return this.x >= x && this.x <= x + w &&
               this.y >= y && this.y <= y + h 
    }
}

class Select extends Drawable {
    constructor(x,y,width,height, color){
        super()
        this.x      = x;
        this.y      = y;
        this.width = width;
        this.height = height;
        this.color  = color;

        this.draw(); 
    }

    draw(selected){
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.closePath();
        ctx.fillStyle = this.color;
        if (selected){
            ctx.lineWidth = 2
            ctx.stroke();
        }
        ctx.strokeRect(this.x, this.y, this.width, this.height)
    }



    inBounds(x,y,w,h){ // x = 100, this.x = 102, w = 5
        return this.x >= x && this.x <= x + w &&
               this.y >= y && this.y <= y + h 
    }
}
 
class Line extends Drawable {
    constructor(x,y, width, height, color, lineWidth){
        super()
        this.x      = x;
        this.y      = y;
        this.width  = width;
        this.height = height;
        this.color  = color;
        this.lineWidth  = lineWidth;


        this.draw(); 
    }
    

    draw(){
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + this.width, this.y + this.height);
        ctx.closePath();
        ctx.strokeStyle = this.color;
        ctx.lineWidth   = this.lineWidth
        ctx.stroke();
    }
}

color.onchange = () => {
    selection.forEach(c => c.color = color.value)
    Drawable.drawAll(selection)
}

document.getElementById('delete').onclick = () =>{
    debugger
    Drawable.instances = Drawable.instances.filter(item => !selection.includes(item))
    selection = []
    Drawable.drawAll()
}




