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
        // material = new THREE.MeshBasicMaterial({ map:
        //         new THREE.CanvasTexture(Cube.toFace(), THREE.DEFAULT_MAPPING, THREE.RepeatWrapping,
        //         THREE.RepeatWrapping, THREE.LinearFilter, THREE.LinearMipMapLinearFilter)
        // });
        // console.log(material);
    })();

    var controller = {
        scale: 1,
        rx: 0, ry: 0,
        tx: 0, ty: 0,
        isIntersect: false,
        intersect: [[], []],
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
            group.scale.setScalar(controller.scale * canvas.height / (1.5 * depth));
        } else {
            group.scale.setScalar(controller.scale * canvas.width / (1.5 * depth));
        }
        render.render(scene, camera);
        window.requestAniFrame(update);
    })();

    var rotateNormal = {
        F: new THREE.Vector3(0, 0, 1),
        B: new THREE.Vector3(0, 0, -1),
        D: new THREE.Vector3(0, -1, 0),
        U: new THREE.Vector3(0, 1, 0),
        L: new THREE.Vector3(-1, 0, 0),
        R: new THREE.Vector3(1, 0, 0)
    };
    var isFloor = {
        F: function (item) {
            return item.name % 9 === 0 || item.name % 9 === 1 || item.name % 9 === 2;
        },
        M: function (item) {
            return item.name % 9 === 3 || item.name % 9 === 4 || item.name % 9 === 5;
        },
        B: function (item) {
            return item.name % 9 === 6 || item.name  % 9 === 7 || item.name  % 9 === 8;
        },
        L: function (item) {
            return item.name % 3 === 0;
        },
        V: function (item) {
            return item.name % 3 === 1;
        },
        R: function (item) {
            return item.name % 3 === 2;
        },
        D: function (item) {
            return item.name < 9;
        },
        H: function (item) {
            return item.name >= 9 && item.name < 18;
        },
        U: function (item) {
            return item.name >= 18;
        }
    };
    
    function moveCube(cubeIndex, axis) {
        if(!controller.isRotate){
            controller.isRotate = true;
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
                                    item.name = i;
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

    function isIntersect(mouse) {
        var raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);
        // console.log(raycaster);
        return raycaster.intersectObjects(group.children);
    }

    function onMouseDown(event) {
        if(event.which === 1 || event.which === 0){
            // moveCube(Math.floor(Math.random()*8), 1);
            controller.rx = event.x;
            controller.ry = event.y;
            controller.isPressed = true;
            var mouse = new THREE.Vector2();
            mouse.x = ( event.clientX / canvas.width) * 2 - 1;
            mouse.y = - ( event.clientY / canvas.height) * 2 + 1;
            controller.intersect[0] = isIntersect(mouse);
        } else if(event.which === 3){
            // moveCube(Math.floor(Math.random()*8), -1);
            controller.tx = event.x;
            controller.ty = event.y;
            controller.isPressed = true;
        }
    }
    function onMouseMove(event) {
        if(controller.isPressed){
            if(event.which === 1 || event.which === 0){
                if(controller.intersect[0].length > 0){
                    var mouse = new THREE.Vector2();
                    mouse.x = ( event.clientX / canvas.width) * 2 - 1;
                    mouse.y = - ( event.clientY / canvas.height) * 2 + 1;
                    var intersect = isIntersect(mouse);
                    if(intersect.length > 0) controller.intersect[1] = intersect;
                    return;
                }
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
        // console.log(controller.intersect);
        if(controller.intersect[0].length > 0 && controller.intersect[1].length > 0){
            // console.log(controller.intersect[1][0]);
            var dir = controller.intersect[1][0].point.clone().sub(controller.intersect[0][0].point);
            dir.applyQuaternion(group.quaternion.clone().inverse());
            var axis = controller.intersect[0][0].face.normal.clone().applyQuaternion(
                controller.intersect[0][0].object.quaternion).cross(dir).normalize();
            // console.log(axis);
            //近似
            if(axis.x > 0.9) axis = rotateNormal.R;
            else if(axis.x < -0.9) axis = rotateNormal.L;
            else if(axis.y > 0.9) axis = rotateNormal.U;
            else if(axis.y < -0.9) axis = rotateNormal.D;
            else if(axis.z > 0.9) axis = rotateNormal.F;
            else if(axis.z < -0.9) axis = rotateNormal.B;
            else axis = false;

            if(axis){
                // console.log(axis);
                // console.log(controller.intersect[0][0].object);
                // console.log(controller.intersect[1][0].object);
                if(axis.equals(rotateNormal.F) || axis.equals(rotateNormal.B)){
                    if(isFloor.F(controller.intersect[0][0].object)
                    && isFloor.F(controller.intersect[1][0].object)){
                        moveCube(group.children.filter(isFloor.F), axis);
                    } else if(isFloor.M(controller.intersect[0][0].object)
                        && isFloor.M(controller.intersect[1][0].object)){
                        moveCube(group.children.filter(isFloor.M), axis);
                    } else if(isFloor.B(controller.intersect[0][0].object)
                        && isFloor.B(controller.intersect[1][0].object)){
                        moveCube(group.children.filter(isFloor.B), axis);
                    }
                } else if(axis.equals(rotateNormal.L) || axis.equals(rotateNormal.R)){
                    if(isFloor.L(controller.intersect[0][0].object)
                        && isFloor.L(controller.intersect[1][0].object)){
                        moveCube(group.children.filter(isFloor.L), axis);
                    } else if(isFloor.V(controller.intersect[0][0].object)
                        && isFloor.V(controller.intersect[1][0].object)){
                        moveCube(group.children.filter(isFloor.V), axis);
                    } else if(isFloor.R(controller.intersect[0][0].object)
                        && isFloor.R(controller.intersect[1][0].object)){
                        moveCube(group.children.filter(isFloor.R), axis);
                    }
                } else if(axis.equals(rotateNormal.D) || axis.equals(rotateNormal.U)){
                    if(isFloor.D(controller.intersect[0][0].object)
                        && isFloor.D(controller.intersect[1][0].object)){
                        moveCube(group.children.filter(isFloor.D), axis);
                    } else if(isFloor.H(controller.intersect[0][0].object)
                        && isFloor.H(controller.intersect[1][0].object)){
                        moveCube(group.children.filter(isFloor.H), axis);
                    } else if(isFloor.U(controller.intersect[0][0].object)
                        && isFloor.U(controller.intersect[1][0].object)){
                        moveCube(group.children.filter(isFloor.U), axis);
                    }
                } else console.log(axis);
            }

            controller.intersect[0] = [];
            controller.intersect[1] = [];
        }
        controller.isPressed = false;
    }

    canvas.addEventListener("mousedown", onMouseDown, false);
    canvas.addEventListener("mousemove", onMouseMove, false);
    canvas.addEventListener("mouseup", onMouseUp, false);

    canvas.addEventListener("touchstart", function (event) {
        event.x = event.targetTouches[0].clientX;
        event.y = event.targetTouches[0].clientY;
        event.clientX = event.x;
        event.clientY = event.y;
        onMouseDown(event);
    }, false);
    canvas.addEventListener("touchmove", function (event) {
        event.x = event.targetTouches[0].clientX;
        event.y = event.targetTouches[0].clientY;
        event.clientX = event.x;
        event.clientY = event.y;
        onMouseMove(event);
    }, false);
    canvas.addEventListener("touchend", onMouseUp, false);

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