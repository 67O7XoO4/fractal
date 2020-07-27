

(function(){

    //to compute angle
    const degreToRadian = Math.PI / 180;

    // Size of canvas. These get updated after browser loading.
    let canvasConfig = {w : 150, h: 150};

    let currentDrawing;
    
    let initData =  {
        initialWidthBranch : 20,
        initialLengthBranch : 175,
        nbBranchesAtALevel : 4,
        branchDiminutionFactor : 6,     // shrink branch length at each recursion level
        branchMinLength : 30,                 // Branch min length: stop recursion if the computed length is too short
        angleMax : 180,                     // angle in which branches will spread over
        trunkColor : '#500000', 
        leafColor : '#228B22', 
        onlyDot : false
    };

    let kali =  {
        initialWidthBranch : 50,
        initialLengthBranch : 225,
        nbBranchesAtALevel : 6,
        branchDiminutionFactor : 5,     
        branchMinLength : 5,            
        angleMax : 400,                 
        trunkColor : '#000000', 
        leafColor : '#00FFFF', 
        onlyDot : true
    };
    let bandg =  {
        initialWidthBranch : 25,
        initialLengthBranch : 200,
        nbBranchesAtALevel : 3,
        branchDiminutionFactor : 6,     
        branchMinLength : 5,            
        angleMax : 360,                 
        trunkColor : '#0000a0', 
        leafColor : '#00FF00', 
        onlyDot : false
    };

    let sorrow =  {
        initialWidthBranch : 3,
        initialLengthBranch : 225,
        nbBranchesAtALevel : 4,
        branchDiminutionFactor : 6,     
        branchMinLength : 5,            
        angleMax : 360,                 
        trunkColor : '#000000', 
        leafColor : '#000000', 
        onlyDot : false
    };

    // Called initially and whenever the window resizes to update the canvas
    // get size: width/height variables.
    function initCanvas() {
        canvasConfig.displayedCanvas = document.getElementById("canvas");
        //map the canvas size to the displayed size
        canvasConfig.displayedCanvas.width= canvasConfig.displayedCanvas.clientWidth;
        canvasConfig.displayedCanvas.height= canvasConfig.displayedCanvas.clientHeight;
        //save the size
        canvasConfig.w = canvasConfig.displayedCanvas.clientWidth;
        canvasConfig.h = canvasConfig.displayedCanvas.clientHeight;
        
        canvasConfig.offscreenCanvas = document.createElement('canvas');
        canvasConfig.offscreenCanvas.width = canvasConfig.displayedCanvas.width;
        canvasConfig.offscreenCanvas.height = canvasConfig.displayedCanvas.height;
    }
    
    //
    function drawTree(){

        loader.computing = true;

        if (currentDrawing) clearTimeout(currentDrawing);

        //make it async to let the browser a chance to display loader
        currentDrawing = window.setTimeout(()=>{

            var ctx = canvasConfig.offscreenCanvas.getContext("2d");
            // Clear the canvas
            ctx.resetTransform();
            ctx.clearRect(0, 0, canvasConfig.w, canvasConfig.h);
            
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.strokeStyle = config.trunkColor;
            
            //start position
            ctx.translate(canvasConfig.w / 2, canvasConfig.h * 19 /20);
            ctx.rotate(-90 * degreToRadian);
            
            ctx.lineWidth = config.initialWidthBranch;

            const angle = - config.angleMax / (config.nbBranchesAtALevel +1) * degreToRadian;

            //display recursively all branches of the tree
            drawBranch(config.initialLengthBranch, angle, ctx);
    
            //display on real canvas
            let dctx = canvasConfig.displayedCanvas.getContext("2d");
    
            dctx.clearRect(0, 0, canvasConfig.w, canvasConfig.h);
            dctx.drawImage(canvasConfig.offscreenCanvas, 0, 0);
    
            loader.computing = false;   
            currentDrawing = null;             
        }, 1);

    }

    //recursive function to draw a branch
    function drawBranch(branchLength, angle, ctx){

        //save the state
        ctx.save();

        ctx.beginPath();

        if (branchLength < config.branchMinLength){
            //for the last branches, we use leafColor
            ctx.strokeStyle = config.leafColor;  
        }

        // draw
        if ( ! config.onlyDot) ctx.moveTo(0,0);
        ctx.lineTo(branchLength, 0);

        ctx.stroke();
        
        ctx.translate(branchLength, 0);

        if (branchLength > config.branchMinLength){

            ctx.lineWidth = ctx.lineWidth * config.branchDiminutionFactor/10;
            
            branchLength = branchLength * config.branchDiminutionFactor/10;

            ctx.rotate( config.angleMax / 2 * degreToRadian );// left(angleMax / 2);
            
            //create nbb sub branches
            _.range(config.nbBranchesAtALevel).forEach(()=>{

                ctx.rotate(angle);//right(angle)            
                drawBranch(branchLength, angle, ctx);

            });

        }
        //restore state
        ctx.restore();
    }


    window.onload = () => {
        // Make sure the canvas always fills the whole window
        window.addEventListener("resize", ()=>{
            initCanvas();

            drawTree();
        }, false);

        initCanvas();

        drawTree();
    };

    var loader = new Vue({
        el: '#loader',
        data: {
            computing : false
        }
    });

    var config = new Vue({
        el: '#config',
        data: _.clone(initData),

        methods:{
            reset : function(){
                Object.assign(this.$data, initData);
                drawTree();
            },
            kali: function(){
                Object.assign(this.$data, kali);
                drawTree();
            },
            bandg: function(){
                Object.assign(this.$data, bandg);
                drawTree();
            },
            sorrow: function(){
                Object.assign(this.$data, sorrow);
                drawTree();
            },
            drawTree: _.debounce(drawTree, 15)
        }

    })

})();


