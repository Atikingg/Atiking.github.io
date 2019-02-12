alert("shit")
setInterval(function() { update(); }, 1000/60);

    var canvas = document.body.appendChild(document.createElement("canvas")).getContext("2d");




    var mousePos;

    function alertSize() {
      var myWidth = 0, myHeight = 0;
      var int1=0;
      if( typeof( window.innerWidth ) == 'number' ) {
        myWidth = window.innerWidth;
        myHeight = window.innerHeight;
        int1=1;
      } else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
        myWidth = document.documentElement.clientWidth;
        myHeight = document.documentElement.clientHeight;
        int1=2;
      } else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
        myWidth = document.body.clientWidth;
        myHeight = document.body.clientHeight;
        int1=3;
      }
      canvas.canvas.width = myWidth;
      canvas.canvas.height = myHeight;
    }

    alertSize();

    var map = { x: -4000, y: -4000, width: 5000, height: 5000, objects: [] };

    var circle = {x: canvas.canvas.width/2, y: canvas.canvas.height/2, radius: 50, contour: []};

    for(var a = 0; a < Math.PI * 2; a += Math.PI / circle.radius){
        circle.contour.push({
            _x: Math.sin(a) * circle.radius, _y: Math.cos(a) * circle.radius
        });
    }

    function getMousePos(canvas, evt) {
      var rect = canvas.canvas.getBoundingClientRect();
      return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
      };
    }

    canvas.canvas.addEventListener('mousemove', function(evt) {
      mousePos = getMousePos(canvas, evt);
    }, false);

    function update() {
        alertSize();

        canvas.save();
        canvas.fillRect(map.x, map.y, map.width, map.height);
        canvas.globalCompositeOperation = "destination-out";
        canvas.fillRect(map.x + circle.radius/2, map.y + circle.radius/2, map.width - circle.radius, map.height - circle.radius);
        canvas.restore();

        var context = document.createElement("canvas").getContext("2d");
        context.canvas.width = canvas.canvas.width;
        context.canvas.height = canvas.canvas.height;

        context.save();
        context.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI);
        context.fillStyle = "#aaa";
        context.fill();
        context.globalCompositeOperation = "destination-in";
        context.fillRect(map.x + circle.radius/2, map.y + circle.radius/2, map.width - circle.radius, map.height - circle.radius);
        context.restore();
        canvas.drawImage(context.canvas, 0, 0);

        if(map.x + circle.radius/2 > circle.x )
            map.x = circle.x - circle.radius/2;
        if(map.y + circle.radius/2 > circle.y )
            map.y = circle.y - circle.radius/2;
        if (-map.x + circle.x + circle.radius/2 > map.width)
            map.x = -map.width + circle.radius/2 + circle.x;
        if (-map.y + circle.y + circle.radius/2 > map.height)
            map.y = -map.height + circle.radius/2 + circle.y;

        circle.contour.forEach(function(p){
            p.x = p._x;
            p.y = p._y;

            if(circle.x + p.x < map.x + circle.radius/2){
                p.x = map.x + circle.radius/2 - circle.x;
            }
            if(circle.y + p.y < map.y + circle.radius/2){
                p.y = map.y + circle.radius/2 - circle.y;
            }
            if(circle.x + p.x > map.x + map.width - circle.radius/2){
                p.x = map.x + map.width - circle.radius/2 - circle.x;
            }
            if(circle.y + p.y > map.y + map.height - circle.radius/2){
                p.y = map.y + map.height - circle.radius/2 - circle.y;
            }
            canvas.strokeStyle = "green";
            canvas.lineWidth = 3;
            canvas.lineTo(p.x + circle.x, p.y + circle.y);
        });
        canvas.stroke();

        if (mousePos.y != Math.round(circle.y) && mousePos.x != Math.round(circle.x))
        {
            angel = 180*Math.atan2(mousePos.x - circle.x,mousePos.y - circle.y)/Math.PI;
            map.x -= Math.round((100/circle.radius) * Math.sin(angel * (Math.PI/180)));
            map.y -= Math.round((100/circle.radius) * Math.cos(angel * (Math.PI/180)));

            console.log(map);
        }
    }
