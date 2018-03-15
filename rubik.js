window.onload = function () {
    // document.getElementById("webgl").appendChild(Cube.toFace());

    window.requestAniFrame = window.requestAnimationFrame ||
                             window.mozRequestAnimationFrame ||
                             window.webkitRequestAnimationFrame ||
                             window.msRequestAnimationFrame;

    var scene;
    var group; //rubik cube
    var camera;
    var render;
    var material;
    var depth = 720;
    var canvas = document.getElementById("webgl");

    (function () { //initial
        scene = new THREE.Scene();

        group = new THREE.Group();

        camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, depth);
        camera.lookAt(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -1), new THREE.Vector3(0, 1, 0));

        render = new THREE.WebGLRenderer({ canvas: canvas });
        render.clear(true, true);
        render.setClearColor(new THREE.Color(0.17, 0.17, 0.17));
        render.setSize(window.innerWidth, window.innerHeight, true);

        material = new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(Cube.toFace()) });
        material.map.minFilter = THREE.LinearFilter;
        // console.log(material);
    })();

    var controller = {
        translate: new THREE.Vector3(0, 0, -depth/2),
        rotate: new THREE.Matrix4(),
        scale: 1,
        rx: 0, ry: 0,
        tx: 0, ty: 0,
        isPressed: false
    };

    (function () { //createCubes
        var length = 50;
        var texOffset = function (offset) {
            return {
                offset: offset,
                red: 0,
                orange: offset,
                blue: offset * 2,
                green: offset * 3,
                yellow: offset * 4,
                white: offset * 5,
                black: offset * 6
            };
        }(1.0/7);
        var cubes = [ //x->z->y
            {
                position: new THREE.Vector3(-length, -length, length),
                offset: texOffset.offset,
                front: texOffset.blue,
                back: texOffset.black,
                right: texOffset.black,
                left: texOffset.orange,
                bottom: texOffset.white,
                top: texOffset.black
            },
            {
                position: new THREE.Vector3(0, -length, length),
                offset: texOffset.offset,
                front: texOffset.blue,
                back: texOffset.black,
                right: texOffset.black,
                left: texOffset.black,
                bottom: texOffset.white,
                top: texOffset.black
            },
            {
                position: new THREE.Vector3(length, -length, length),
                offset: texOffset.offset,
                front: texOffset.blue,
                back: texOffset.black,
                right: texOffset.red,
                left: texOffset.black,
                bottom: texOffset.white,
                top: texOffset.black
            },
            {
                position: new THREE.Vector3(-length, -length, 0),
                offset: texOffset.offset,
                front: texOffset.black,
                back: texOffset.black,
                right: texOffset.black,
                left: texOffset.orange,
                bottom: texOffset.white,
                top: texOffset.black
            },
            {
                position: new THREE.Vector3(0, -length, 0),
                offset: texOffset.offset,
                front: texOffset.black,
                back: texOffset.black,
                right: texOffset.black,
                left: texOffset.black,
                bottom: texOffset.white,
                top: texOffset.black
            },
            {
                position: new THREE.Vector3(length, -length, 0),
                offset: texOffset.offset,
                front: texOffset.black,
                back: texOffset.black,
                right: texOffset.red,
                left: texOffset.black,
                bottom: texOffset.white,
                top: texOffset.black
            },
            {
                position: new THREE.Vector3(-length, -length, -length),
                offset: texOffset.offset,
                front: texOffset.black,
                back: texOffset.green,
                right: texOffset.black,
                left: texOffset.orange,
                bottom: texOffset.white,
                top: texOffset.black
            },
            {
                position: new THREE.Vector3(0, -length, -length),
                offset: texOffset.offset,
                front: texOffset.black,
                back: texOffset.green,
                right: texOffset.black,
                left: texOffset.black,
                bottom: texOffset.white,
                top: texOffset.black
            },
            {
                position: new THREE.Vector3(length, -length, -length),
                offset: texOffset.offset,
                front: texOffset.black,
                back: texOffset.green,
                right: texOffset.red,
                left: texOffset.black,
                bottom: texOffset.white,
                top: texOffset.black
            }, //first floor
            {
                position: new THREE.Vector3(-length, 0, length),
                offset: texOffset.offset,
                front: texOffset.blue,
                back: texOffset.black,
                right: texOffset.black,
                left: texOffset.orange,
                bottom: texOffset.black,
                top: texOffset.black
            },
            {
                position: new THREE.Vector3(0, 0, length),
                offset: texOffset.offset,
                front: texOffset.blue,
                back: texOffset.black,
                right: texOffset.black,
                left: texOffset.black,
                bottom: texOffset.black,
                top: texOffset.black
            },
            {
                position: new THREE.Vector3(length, 0, length),
                offset: texOffset.offset,
                front: texOffset.blue,
                back: texOffset.black,
                right: texOffset.red,
                left: texOffset.black,
                bottom: texOffset.black,
                top: texOffset.black
            },
            {
                position: new THREE.Vector3(-length, 0, 0),
                offset: texOffset.offset,
                front: texOffset.black,
                back: texOffset.black,
                right: texOffset.black,
                left: texOffset.orange,
                bottom: texOffset.black,
                top: texOffset.black
            },
            {
                position: new THREE.Vector3(0, 0, 0),
                offset: texOffset.offset,
                front: texOffset.black,
                back: texOffset.black,
                right: texOffset.black,
                left: texOffset.black,
                bottom: texOffset.black,
                top: texOffset.black
            },
            {
                position: new THREE.Vector3(length, 0, 0),
                offset: texOffset.offset,
                front: texOffset.black,
                back: texOffset.black,
                right: texOffset.red,
                left: texOffset.black,
                bottom: texOffset.black,
                top: texOffset.black
            },
            {
                position: new THREE.Vector3(-length, 0, -length),
                offset: texOffset.offset,
                front: texOffset.black,
                back: texOffset.green,
                right: texOffset.black,
                left: texOffset.orange,
                bottom: texOffset.black,
                top: texOffset.black
            },
            {
                position: new THREE.Vector3(0, 0, -length),
                offset: texOffset.offset,
                front: texOffset.black,
                back: texOffset.green,
                right: texOffset.black,
                left: texOffset.black,
                bottom: texOffset.black,
                top: texOffset.black
            },
            {
                position: new THREE.Vector3(length, 0, -length),
                offset: texOffset.offset,
                front: texOffset.black,
                back: texOffset.green,
                right: texOffset.red,
                left: texOffset.black,
                bottom: texOffset.black,
                top: texOffset.black
            }, //second floor
            {
                position: new THREE.Vector3(-length, length, length),
                offset: texOffset.offset,
                front: texOffset.blue,
                back: texOffset.black,
                right: texOffset.black,
                left: texOffset.orange,
                bottom: texOffset.black,
                top: texOffset.yellow
            },
            {
                position: new THREE.Vector3(0, length, length),
                offset: texOffset.offset,
                front: texOffset.blue,
                back: texOffset.black,
                right: texOffset.black,
                left: texOffset.black,
                bottom: texOffset.black,
                top: texOffset.yellow
            },
            {
                position: new THREE.Vector3(length, length, length),
                offset: texOffset.offset,
                front: texOffset.blue,
                back: texOffset.black,
                right: texOffset.red,
                left: texOffset.black,
                bottom: texOffset.black,
                top: texOffset.yellow
            },
            {
                position: new THREE.Vector3(-length, length, 0),
                offset: texOffset.offset,
                front: texOffset.black,
                back: texOffset.black,
                right: texOffset.black,
                left: texOffset.orange,
                bottom: texOffset.black,
                top: texOffset.yellow
            },
            {
                position: new THREE.Vector3(0, length, 0),
                offset: texOffset.offset,
                front: texOffset.black,
                back: texOffset.black,
                right: texOffset.black,
                left: texOffset.black,
                bottom: texOffset.black,
                top: texOffset.yellow
            },
            {
                position: new THREE.Vector3(length, length, 0),
                offset: texOffset.offset,
                front: texOffset.black,
                back: texOffset.black,
                right: texOffset.red,
                left: texOffset.black,
                bottom: texOffset.black,
                top: texOffset.yellow
            },
            {
                position: new THREE.Vector3(-length, length, -length),
                offset: texOffset.offset,
                front: texOffset.black,
                back: texOffset.green,
                right: texOffset.black,
                left: texOffset.orange,
                bottom: texOffset.black,
                top: texOffset.yellow
            },
            {
                position: new THREE.Vector3(0, length, -length),
                offset: texOffset.offset,
                front: texOffset.black,
                back: texOffset.green,
                right: texOffset.black,
                left: texOffset.black,
                bottom: texOffset.black,
                top: texOffset.yellow
            },
            {
                position: new THREE.Vector3(length, length, -length),
                offset: texOffset.offset,
                front: texOffset.black,
                back: texOffset.green,
                right: texOffset.red,
                left: texOffset.black,
                bottom: texOffset.black,
                top: texOffset.yellow
            } //third floor

        ];

        cubes.forEach(function (item) {
            group.add(new THREE.Mesh(Cube.cube(item), material));
        });
        scene.add(group);
    })();

    var debug = 5;
    (function update() {
        var s = new THREE.Matrix4();
        if(canvas.width > canvas.height){
            s.multiplyScalar(controller.scale * canvas.height / depth);
        } else {
            s.multiplyScalar(controller.scale * canvas.width / depth);
        }
        group.matrix.copy(new THREE.Matrix4().setPosition(controller.translate).
                            multiply((s)));
        if(debug) {
            debug--;
            console.log(s.multiply(new THREE.Matrix4().setPosition(controller.translate)));
            console.log(group.matrix);
        }
        group.updateMatrix();
        render.render(scene, camera);
        window.requestAniFrame(update);
    })();

    function onMouseDown(event) {
        if(event.which === 1 || event.which === 0){
            controller.rx = event.x;
            controller.ry = event.y;
            controller.isPressed = true;
        } else if(event.which === 3){
            controller.tx = event.x;
            controller.ty = event.y;
            controller.isPressed = true;
        }
    }
    function onMouseMove(event) {
        if(controller.isPressed){
            if(event.which === 1 || event.which === 0){
                controller.rx = event.x - controller.rx;
                controller.ry = event.y - controller.ry;
                var angle = controller.rx * controller.rx - controller.ry * controller.ry;
                if(angle > 10){ //位移太小忽略
                    angle = Math.atan(Math.sqrt(angle / 2)) * 3;
                    if(controller.rx / controller.ry >= 6) controller.ry = 0;
                    else if(controller.ry / controller.rx >= 6) controller.rx = 0;
                    controller.rotate = new THREE.Matrix4().makeRotationAxis(
                        new THREE.Vector3(controller.ry, controller.rx, 0), angle).multiply(controller.rotate);
                    // group.rotateOnAxis(new THREE.Vector3(controller.ry, controller.rx, 0).normalize(), angle);
                    controller.rx = event.x;
                    controller.ry = event.y;
                } else {
                    controller.rx = event.x - controller.rx;
                    controller.ry = event.y - controller.ry;
                }
            } else if(event.which === 3){
                controller.translate.add(new THREE.Vector3(controller.tx, -controller.ty, 0));

                controller.tx = event.x;
                controller.ty = event.y;
            }
        }
    }
    function onMouseUp() {
        console.log(group);
        console.log(new THREE.Matrix4().setPosition(controller.translate).multiply(controller.rotate.multiply(group.matrix)));
        controller.isPressed = false;
    }

    canvas.addEventListener("mousedown", onMouseDown, false);
    canvas.addEventListener("mousemove", onMouseMove, false);
    canvas.addEventListener("mouseup", onMouseUp, false);

    canvas.addEventListener("wheel", function (event) {
        if(controller.scale < 3 && event.wheelDelta > 0){
            controller.scale *= 1.2;
        } else if(controller.scale > 0.1 && event.wheelDelta < 0){
            controller.scale *= 0.9;
        }
    }, false);
    window.addEventListener("resize", function () {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        camera.aspect = canvas.width / canvas.height;
        camera.updateProjectionMatrix();
        render.setSize(canvas.width, canvas.height);
    }, false);
    canvas.oncontextmenu = function (ev) { return false; }; //右键菜单

    // console.log(render);
    // console.log(scene);
};