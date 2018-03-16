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
        group.position.set(0, 0, -depth/2);

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
        scale: 1,
        rx: 0, ry: 0,
        tx: 0, ty: 0,
        mouse: new THREE.Vector2(),
        isIntersect: false,
        isPressed: false,
        isRotate: false
    };
    var per_position = [];

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

        cubes.forEach(function (item, index) {
            group.add(new THREE.Mesh(Cube.cube(item), material));
            group.children[index].name = index;
            per_position.push(item.position);
        });
        scene.add(group);
        // console.log(group);
    })();

    (function update() {
        if(canvas.width > canvas.height){
            group.scale.setScalar(controller.scale * canvas.height / depth);
        } else {
            group.scale.setScalar(controller.scale * canvas.width / depth);
        }
        group.updateMatrix();
        render.render(scene, camera);
        window.requestAniFrame(update);
    })();

    var rotateLayer = {
        F: 0, //%9 == 1||2||3
        M: 1, //%9 == 4||5||6
        B: 2, //%9 == 7||8||9
        L: 3, //%3 == 0
        V: 4, //纵向 %3 == 1
        R: 5, //%3 == 2
        D: 6, //<9
        H: 7, //横向 9=><18
        U: 8 //>=18
    };
    
    function moveCube(layer, dir) {
        if(!controller.isRotate){
            controller.isRotate = true;
            var cubeIndex, axis;
            if(dir != -1) dir = 1;
            else dir = -1;
            switch (layer){
                case rotateLayer.F:
                    // cubeIndex = group.children.filter(function (value, index) {
                    //     return index % 9 === 0 || index % 9 === 1 || index % 9 === 2;
                    // });
                    cubeIndex = group.children.filter(function (item) {
                        return item.name % 9 === 0 || item.name % 9 === 1 || item.name % 9 === 2;
                    });
                    axis = new THREE.Vector3(0, 0, -dir);
                    break;
                case rotateLayer.M:
                    // cubeIndex = group.children.filter(function (value, index) {
                    //     return index % 9 === 3 || index % 9 === 4 || index % 9 === 5;
                    // });
                    cubeIndex = group.children.filter(function (item) {
                        return item.name % 9 === 3 || item.name % 9 === 4 || item.name % 9 === 5;
                    });
                    axis = new THREE.Vector3(0, 0, -dir);
                    break;
                case rotateLayer.B:
                    // cubeIndex = group.children.filter(function (value, index) {
                    //     return index % 9 === 6 || index % 9 === 7 || index % 9 === 8;
                    // });
                    cubeIndex = group.children.filter(function (item) {
                        return item.name % 9 === 6 || item.name  % 9 === 7 || item.name  % 9 === 8;
                    });
                    axis = new THREE.Vector3(0, 0, dir);
                    break;
                case rotateLayer.L:
                    // cubeIndex = group.children.filter(function (value, index) {
                    //     return index % 3 === 0;
                    // });
                    cubeIndex = group.children.filter(function (item) {
                        return item.name % 3 === 0;
                    });
                    axis = new THREE.Vector3(-dir, 0, 0);
                    break;
                case rotateLayer.V:
                    // cubeIndex = group.children.filter(function (value, index) {
                    //     return index % 3 === 1;
                    // });
                    cubeIndex = group.children.filter(function (item) {
                        return item.name % 3 === 1;
                    });
                    axis = new THREE.Vector3(-dir, 0, 0);
                    break;
                case rotateLayer.R:
                    // cubeIndex = group.children.filter(function (value, index) {
                    //     return index % 3 === 2;
                    // });
                    cubeIndex = group.children.filter(function (item) {
                        return item.name % 3 === 2;
                    });
                    axis = new THREE.Vector3(dir, 0, 0);
                    break;
                case rotateLayer.D:
                    // cubeIndex = group.children.filter(function (value, index) {
                    //     return index < 9;
                    // });
                    cubeIndex = group.children.filter(function (item) {
                        return item.name < 9;
                    });
                    axis = new THREE.Vector3(0, -dir, 0);
                    break;
                case rotateLayer.H:
                    // cubeIndex = group.children.filter(function (value, index) {
                    //     return index >= 9 && index < 18;
                    // });
                    cubeIndex = group.children.filter(function (item) {
                        return item.name >= 9 && item.name < 18;
                    });
                    axis = new THREE.Vector3(0, -dir, 0);
                    break;
                case rotateLayer.U:
                    // cubeIndex = group.children.filter(function (value, index) {
                    //     return index >= 18;
                    // });
                    cubeIndex = group.children.filter(function (item) {
                        return item.name >= 18;
                    });
                    axis = new THREE.Vector3(0, dir, 0);
                    break;
            }
            if(cubeIndex){
                (function move(cubeIndex, axis, startTime, lastTime, currentTime) {
                    if(startTime === 0){
                        window.requestAniFrame(function (current) {
                            // console.log(current + '\t' + startTime);
                            move(cubeIndex, axis, current, current, current);
                        });
                        return;
                    }
                    else if(currentTime - startTime >= 600) {
                        var angle = Math.PI * (startTime + 600 - lastTime) / 1200; //3*time/20 * PI/180
                        cubeIndex.forEach(function (item) {
                            item.rotateOnWorldAxis(axis, angle);
                        });
                        cubeIndex.forEach(function (item) {
                            var center = per_position[item.name].clone().applyAxisAngle(axis, Math.PI/2);
                            for (var i = 0; i < group.children.length; ++i){
                                if(new THREE.Vector3().subVectors(center, per_position[i]).length() <= 1){
                                    // console.log({
                                    //    center: center,
                                    //    position: per_position[i],
                                    //    item: item,
                                    //    index: i,
                                    //    children: group.children[i]
                                    // });
                                    item.name = i;
                                    // console.log(group.children[i]);
                                    break;
                                }
                            }
                        });
                        controller.isRotate = false;
                        return;
                    }
                    else {
                        var angle = Math.PI * (currentTime - lastTime) / 1200;
                        cubeIndex.forEach(function (item) {
                            item.rotateOnWorldAxis(axis, angle);
                        });
                    }
                    window.requestAniFrame(function (current) {
                        // console.log(current + '\t' + startTime);
                        move(cubeIndex, axis, startTime, currentTime, current);
                    });
                })(cubeIndex, axis, 0);
            }
        }
    }

    function onMouseDown(event) {
        if(event.which === 1 || event.which === 0){
            moveCube(Math.floor(Math.random()*8), 1);
            controller.rx = event.x;
            controller.ry = event.y;
            // controller.mouse.x = ( event.clientX / canvas.width) * 2 - 1;
            // controller.mouse.y = - ( event.clientY / canvas.height) * 2 + 1;
            controller.isPressed = true;
        } else if(event.which === 3){
            moveCube(Math.floor(Math.random()*8), -1);
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
                var angle = controller.rx * controller.rx + controller.ry * controller.ry;
                // console.log(angle);
                if(angle >= 10){ //位移太小忽略
                    angle = Math.atan(Math.sqrt(angle / 2)) / 9.6;
                    if(controller.rx/controller.ry >= 6 || controller.rx/controller.ry <= -6) controller.ry = 0;
                    else if(controller.ry/controller.rx >= 6 || controller.ry/controller.rx <= -6) controller.rx = 0;
                    group.rotateOnWorldAxis(new THREE.Vector3(controller.ry, controller.rx, 0).normalize(), angle);
                    controller.rx = event.x;
                    controller.ry = event.y;
                } else {
                    controller.rx = event.x - controller.rx;
                    controller.ry = event.y - controller.ry;
                }
            } else if(event.which === 3){
                group.position.add(new THREE.Vector3(event.x - controller.tx, controller.ty - event.y, 0));

                controller.tx = event.x;
                controller.ty = event.y;
            }
        }
    }
    function onMouseUp() {
        // console.log(group);
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