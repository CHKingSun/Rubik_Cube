var Color = Color || {};

Color.RED = 'rgba(199, 62, 58, 1)';
Color.ORANGE = 'rgba(240, 94, 28, 1)';
Color.BLUE = 'rgba(0, 98, 132, 1)';
Color.GREEN = 'rgba(27, 192, 62, 1)';
Color.YELLOW = 'rgba(255, 196, 8, 1)';
Color.WHITE = 'rgba(252, 250, 242, 1)';
Color.BLACK = 'rgba(0, 0, 0, 1)';

var Cube = Cube || {};

Cube.toFace = function () {
    var canvas = document.createElement("canvas");
    canvas.width = 256 * 7;
    canvas.height = 256;
    var context = canvas.getContext("2d");
    if(context){
        var addFace = function (color, offset) {
            context.fillStyle = Color.BLACK;
            context.fillRect(offset, 0, 256, 256);
            context.fillStyle = color;
            context.fillRect(offset+16, 16, 224, 224);
            context.strokeStyle = color;
            context.lineJoin = "round";
            context.lineWidth = 16;
            context.strokeRect(offset+16, 16, 224, 224);
        };
        addFace(Color.RED, 0);
        addFace(Color.ORANGE, 256);
        addFace(Color.BLUE, 256*2);
        addFace(Color.GREEN, 256*3);
        addFace(Color.YELLOW, 256*4);
        addFace(Color.WHITE, 256*5);
        addFace(Color.BLACK, 256*6);
        return canvas;
    } else {
        console.log("Your browser does not support canvas!");
        return null;
    }
};

Cube.cube = function (cube) {
    var minX = cube.position.x - 25;
    var maxX = cube.position.x + 25;
    var minY = cube.position.y - 25;
    var maxY = cube.position.y + 25;
    var minZ = cube.position.z - 25;
    var maxZ = cube.position.z + 25;

    var geometry = new THREE.Geometry();

    geometry.vertices = [
        new THREE.Vector3(minX, minY, maxZ),
        new THREE.Vector3(maxX, minY, maxZ),
        new THREE.Vector3(maxX, maxY, maxZ),
        new THREE.Vector3(minX, maxY, maxZ),
        new THREE.Vector3(minX, minY, minZ),
        new THREE.Vector3(maxX, minY, minZ),
        new THREE.Vector3(maxX, maxY, minZ),
        new THREE.Vector3(minX, maxY, minZ)
    ];

    geometry.faces = [
        new THREE.Face3(0, 1, 2),
        new THREE.Face3(0, 2, 3), //front
        new THREE.Face3(1, 5, 6),
        new THREE.Face3(1, 6, 2), //right
        new THREE.Face3(5, 4, 7),
        new THREE.Face3(5, 7, 6), //back
        new THREE.Face3(4, 0, 3),
        new THREE.Face3(4, 3, 7), //left
        new THREE.Face3(3, 2, 6),
        new THREE.Face3(3, 6, 7), //top
        new THREE.Face3(4, 5, 1),
        new THREE.Face3(4, 1, 0)  //bottom
    ];

    geometry.faceVertexUvs = [[
        [new THREE.Vector2(cube.front, 0), new THREE.Vector2(cube.front+cube.offset, 0),
            new THREE.Vector2(cube.front+cube.offset, 1.0)],
        [new THREE.Vector2(cube.front, 0), new THREE.Vector2(cube.front+cube.offset, 1.0),
            new THREE.Vector2(cube.front, 1.0)], //front
        [new THREE.Vector2(cube.right, 0), new THREE.Vector2(cube.right+cube.offset, 0),
            new THREE.Vector2(cube.right+cube.offset, 1.0)],
        [new THREE.Vector2(cube.right, 0), new THREE.Vector2(cube.right+cube.offset, 1.0),
            new THREE.Vector2(cube.right, 1.0)], //right
        [new THREE.Vector2(cube.back, 0), new THREE.Vector2(cube.back+cube.offset, 0),
            new THREE.Vector2(cube.back+cube.offset, 1.0)],
        [new THREE.Vector2(cube.back, 0), new THREE.Vector2(cube.back+cube.offset, 1.0),
            new THREE.Vector2(cube.back, 1.0)], //back
        [new THREE.Vector2(cube.left, 0), new THREE.Vector2(cube.left+cube.offset, 0),
            new THREE.Vector2(cube.left+cube.offset, 1.0)],
        [new THREE.Vector2(cube.left, 0), new THREE.Vector2(cube.left+cube.offset, 1.0),
            new THREE.Vector2(cube.left, 1.0)], //left
        [new THREE.Vector2(cube.top, 0), new THREE.Vector2(cube.top+cube.offset, 0),
            new THREE.Vector2(cube.top+cube.offset, 1.0)],
        [new THREE.Vector2(cube.top, 0), new THREE.Vector2(cube.top+cube.offset, 1.0),
            new THREE.Vector2(cube.top, 1.0)], //top
        [new THREE.Vector2(cube.bottom, 0), new THREE.Vector2(cube.bottom+cube.offset, 0),
            new THREE.Vector2(cube.bottom+cube.offset, 1.0)],
        [new THREE.Vector2(cube.bottom, 0), new THREE.Vector2(cube.bottom+cube.offset, 1.0),
            new THREE.Vector2(cube.bottom, 1.0)]  //bottom
    ]];

    geometry.computeVertexNormals();
    return geometry;
};