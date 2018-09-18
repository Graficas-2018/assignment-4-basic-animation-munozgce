var renderer = null,
    scene = null,
    camera = null,
    root = null,
    monster = null,
    group = null,
    orbitControls = null;
values = []
var jsonLoader = null;
var duration = 15; // ms
var currentTime = Date.now();
var animator=null;
loopAnimation = true;

function loadJson()
{
    if(!jsonLoader)
        jsonLoader = new THREE.JSONLoader();

    jsonLoader.load(
        '../models/monster/monster.js',

        function(geometry, materials)
        {
            var material = materials[0];

            var object = new THREE.Mesh(geometry, material);
            object.castShadow = true;
            object. receiveShadow = true;
            object.scale.set(0.005, 0.005, 0.005);
            object.position.y = -2;
            object.position.x = 1;
            monster = object;
            scene.add(object);
            initAnimations();
        },
        function ( xhr ) {

            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

        },
        // called when loading has errors
        function ( error ) {

            console.log( 'An error happened' );

        });
}



function animate() {

    var now = Date.now();
    currentTime = now;



}

function run() {
    requestAnimationFrame(function() { run(); });

    // Render the scene
    renderer.render( scene, camera );

    // Spin the cube for next frame
    animate();
    KF.update();

    // Update the camera controller
    orbitControls.update();
}

function setLightColor(light, r, g, b)
{
    r /= 255;
    g /= 0;
    b /= 125;

    light.color.setRGB(r, g, b);
}

var directionalLight = null;
var spotLight = null;
var ambientLight = null;
var mapUrl = "../images/checker_large.gif";

var SHADOW_MAP_WIDTH = 2048, SHADOW_MAP_HEIGHT = 2048;

function createScene(canvas) {

    // Create the Three.js renderer and attach it to our canvas
    renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );

    // Set the viewport size
    renderer.setSize(canvas.width, canvas.height);

    // Turn on shadows
    renderer.shadowMap.enabled = true;
    // Options are THREE.BasicShadowMap, THREE.PCFShadowMap, PCFSoftShadowMap
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Create a new Three.js scene
    scene = new THREE.Scene();

    // Add  a camera so we can view the scene
    camera = new THREE.PerspectiveCamera( 45, canvas.width / canvas.height, 1, 4000 );
    camera.position.set(-2, 6, 12);
    scene.add(camera);

    // Create a group to hold all the objects
    root = new THREE.Object3D;

    // Add a directional light to show off the object
    directionalLight = new THREE.DirectionalLight( 0xffffff, 1);

    // Create and add all the lights
    directionalLight.position.set(.5, 0, 3);
    root.add(directionalLight);

    spotLight = new THREE.SpotLight (0xffffff);
    spotLight.position.set(2, 8, 15);
    spotLight.target.position.set(-2, 0, -2);
    root.add(spotLight);

    spotLight.castShadow = true;

    spotLight.shadow.camera.near = 1;
    spotLight.shadow. camera.far = 200;
    spotLight.shadow.camera.fov = 45;

    spotLight.shadow.mapSize.width = SHADOW_MAP_WIDTH;
    spotLight.shadow.mapSize.height = SHADOW_MAP_HEIGHT;

    ambientLight = new THREE.AmbientLight ( 0x888888 );
    root.add(ambientLight);

    // Create the objects

    loadJson();

    // Create a group to hold the objects
    group = new THREE.Object3D;
    root.add(group);

    // Create a texture map
    var map = new THREE.TextureLoader().load(mapUrl);
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(8, 8);

    var color = 0xffffff;

    // Put in a ground plane to show off the lighting
    geometry = new THREE.PlaneGeometry(200, 200, 50, 50);
    var mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color:color, map:map, side:THREE.DoubleSide}));

    mesh.rotation.x = -Math.PI / 2;
    mesh.position.y = -4.02;

    // Add the mesh to our group
    group.add( mesh );
    mesh.castShadow = false;
    mesh.receiveShadow = true;


    // Now add the group to our scene
    scene.add( root );
}
function initAnimations()
{
    animator = new KF.KeyFrameAnimator;
    animator.init({
        interps:
            [
                {
                    keys:[0, 2],
                    values: [
                        { y: 0},
                        { y: 2 *  Math.PI}
                    ],
                    target: monster.rotation
                },
                {
                    keys:[1/5, 1.5/5, 2/5, 2.5/5,  3/5, 3.5/5, 4/5, 4.5/5,  5/5, 5.5/5,  6/5, 6.5/5,  7/5,
                        7.5/5, 8/5, 8.5/5,  9/5, 9.5/5,  10/5, 10.5/5, 11/5],
                    values:[
                        { x : 0, z : 0}, { x : -0.75, z : 0.66}, { x : -1.5, z : 1.32}, { x : -2.25, z : 1.98}, { x : -2.75, z : 2.64 }, { x : -3.5, z : 3.3 }, { x : -4.25, z : 3.96 }, { x : -5, z : 4.62}, { x : -5.75, z : 5.2 }, { x : -6.5, z : 5.94 }, { x : -7.75, z : 6.6 }, { x : -8.5, z : 7.26 }, { x : -9.75, z : 7.92 }, { x : -11.25, z : 8.58}, { x : -12, z : 9.24 }, { x : -13.25, z : 9.9 }, { x : -14.75, z : 10.56 }, { x : -16, z : 11.22 }, { x : -17.25, z :11.88 }, { x : -18, z : 12.54 }, { x : -19.25, z : 13.2},

                    ],

                    target: monster.position
                },

            ],
        loop: loopAnimation,
        duration: duration * 1000

    });


    animator.start();

}
function playAnimations()
{
    animator.start();
}
