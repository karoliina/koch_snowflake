// the order of the snowflake. 1 = triangle
var order = 1;

// array containing the points of the snowflake
var points = undefined;

// connect points in the points array
function draw() {

    var canvas = document.getElementById("snowflakeCanvas");

    if (canvas.getContext) {
        var ctx = canvas.getContext("2d");

        // get color
        // var colorPicker = document.getElementById("snowflakeColor");
        // var color = colorPicker.val(); // ???

        // set color
        ctx.strokeStyle = "#0000FF";
        ctx.fillStyle = "#FFFFFF";

        // set drawing area side length and calculate parameters
        sideLength = canvas.offsetWidth;
        mid = sideLength / 2;
        d = 0.8 * mid; // half of a side of the initial triangle

        // debugging
        // var debug = document.getElementById("debug");
        // debug.innerHTML = "sideLength: " + sideLength + "<br>";
        // debug.innerHTML += "midpoint: " + mid + "<br>";

        // create new points
        if (order > 7) {
            debug.innerHTML = "Maximum order reached!<br>";
        } else {
            grow(mid, d);

            //console.log(points.length);
            // draw lines connecting points
            ctx.moveTo(points[0].x, points[0].y);
            for (i = 1; i < points.length; i++) {
                ctx.lineTo(points[i].x, points[i].y);
            }
            ctx.lineTo(points[0].x, points[0].y);
            ctx.stroke();
            ctx.fill();

            order++;
        }
    }
}

// create points for the snowflake of the next order
function grow(mid, d) {
    // new temporary array for endpoints
    var tmp = new Array(numPoints(order));

    // create points. a point is represented by an
    // object with the properties x and y.
    if (order == 1) { // triangle
        tmp[0] = new Point(mid, eval(mid - 2 / Math.sqrt(3) * d));
        tmp[1] = new Point(eval(mid + d), eval(mid + Math.sqrt(3) / 3 * d));
        tmp[2] = new Point(eval(mid - d), eval(mid + Math.sqrt(3) / 3 * d));
    } else {
        var k = 0;
        for (i = 0; i < points.length - 1; i++) {
            // get new points of each segment and copy them into tmp array
            segment = divide(points[i], points[i + 1]);
            for (j = 0; j < segment.length; j++) {
                tmp[k] = segment[j];
                k++;
            }
        }
        segment = divide(points[points.length - 1], points[0]);
        for (j = 0; j < segment.length; j++) {
            tmp[k] = segment[j];
            k++;
        }
    }

    // tmp is the new points array
    points = tmp;
}

// helper function, returns array of four points when given the current endpoints and the current
// length of a segment.
function divide(a, b) {
    // calculate distance between a and b and other parameters
    len = Math.sqrt(Math.pow(b.y - a.y, 2) + Math.pow(b.x - a.x, 2));
    h = Math.sqrt(3) / 6.0 * len;

    arr = new Array(4);
    arr[0] = a; // point a
    // compute x and y coordinates of points a1 and a3 by using a parametric equation of a
    // line intersecting a and b
    arr[1] = new Point(eval(a.x + (b.x - a.x) * 1.0 / 3.0), eval(a.y + (b.y - a.y) * 1.0 / 3.0));
    arr[3] = new Point(eval(a.x + (b.x - a.x) * 2.0 / 3.0), eval(a.y + (b.y - a.y) * 2.0 / 3.0));
    // point 2 is the new hill. looking from the midpoint of a and b, it is always reached by turning left.
    xm = (a.x + b.x) / 2.0;
    ym = (a.y + b.y) / 2.0;

    // compute point 2 using the normal vector to the left looking from point a, and the parameter h.
    t = h / Math.sqrt(Math.pow(b.y - a.y, 2) + Math.pow(b.x - a.x, 2));
    arr[2] = new Point(xm + t * (b.y - a.y), ym + t * (a.x - b.x));

    return arr;
}

// returns the number of points in the snowflake of the given order.
function numPoints(order) {
    return 3 * Math.pow(2, 2 * (order - 1));
}

// a point object represents a point in the xy plane.
function Point(x, y) {
    this.x = x;
    this.y = y;
}

Point.prototype.toString = function() {
    return "x: " + this.x + ", y: " + this.y;
}
