function attachMatchingPieces(haloIdNumber)
{
    attachRoundPieces(haloIdNumber);
    attachTriangularPieces(haloIdNumber);
    attachSquarePieces(haloIdNumber);
}

function attachRoundPieces(haloIdNumber)
{
    var containerClass = containerClassStr(haloIdNumber);
    
    $("." + roundPiece).filter("." + attractionOnClass).each(function()
    {
        var outputPiece = $(this);
        $("." + roundObstacle).filter("." + containerClass).not("." + stopObstacle).each(function () //stopObstacle pieces have already been added to the main halo
        {
            var inputPiece = $(this);
            doTheJob(outputPiece, inputPiece, haloIdNumber);
        });     
    });
}

function attachTriangularPieces(haloIdNumber)
{
    var containerClass = containerClassStr(haloIdNumber);
    $("." + triangularPiece).filter("." + attractionOnClass).each(function()
    {
        var outputPiece = $(this);
        $("." + triangularObstacle).filter("." + containerClass).not("." + stopObstacle).each(function () //stopObstacle pieces have already been added to the main halo
        {
            var inputPiece = $(this);
            doTheJob(outputPiece, inputPiece, haloIdNumber);
        });
    });
}

function attachSquarePieces(haloIdNumber)
{
    var containerClass = containerClassStr(haloIdNumber);
    $("." + squarePiece).filter("." + attractionOnClass).each(function()
    {
        var outputPiece = $(this);        
        $("." + squareObstacle).filter("." + containerClass).not("." + stopObstacle).each(function () //stopObstacle pieces have already been added to the main halo
        {
            var inputPiece = $(this);
            doTheJob(outputPiece, inputPiece, haloIdNumber);
        });
    });
}

function doTheJob(outputPiece, inputPiece, haloIdNumber)
{
    var puzzlePieceRect = outputPiece.get(0).getBoundingClientRect();
    var fittingPieceWidth = inputPiece.width();
    var fittingPieceHeight = inputPiece.height();
    var rotationAngle = getRotationAngle(inputPiece.parent().attr('id'));
    var boundingRect = inputPiece.get(0).getBoundingClientRect();
    var mergingVertices = retrieveMergingVertices(boundingRect, rotationAngle, fittingPieceWidth, fittingPieceHeight);
    for(var i=0; i<2; i++)
    {
        if(collisionBtwPuzzlePieceAndFittingPiece(puzzlePieceRect, mergingVertices[i]))
        {
            modifyClassNames(outputPiece, inputPiece, haloIdNumber);
            attachPieces(outputPiece, inputPiece, haloIdNumber);
            addNotFirstPieceToTheSword(inputPiece.parent().attr('id'), haloIdNumber, outputPiece);
            var addedPiecesArray = eval(haloAddedPiecesArrayVarName(haloIdNumber));
            addedPiecesArray.push(inputPiece.parent().attr('id'));
            incrementStackPosition(outputPiece, inputPiece);
            
            // send collision and updated points to the server
            sendAttachedPiece(outputPiece, inputPiece);
            var swordNumber = getSwordNumberFromPieceId(haloIdNumber, inputPiece);
            sendCostAndPoints(haloIdNumber, swordNumber);
        }
    }
}


function retrieveMergingVertices(rect, angle, width, height)
/*  
 *  INPUT: the bounding rect, the rotation angle, width and height of the div
 *  OUTPUT: the two vertices that will merge into the main piece
 */
{
    if(angle < 0.001 && angle > -0.001)
        angle = 0;
    
    var trueVertices = computeHVertices(rect, angle, width, height);
    var mergingVertices = [];
    if(0 <= angle && angle < Math.PI/2 || angle == Math.PI*2)
    {
        trueVertices[1].push("bottom left");
        trueVertices[2].push("bottom right");
        mergingVertices.push(trueVertices[1], trueVertices[2]);
        return mergingVertices;
    }
    else if(Math.PI/2 <= angle && angle < Math.PI)
    {
        trueVertices[0].push("bottom left");
        trueVertices[1].push("bottom right");
        mergingVertices.push(trueVertices[0], trueVertices[1]);
        return mergingVertices;
    }
    else if(Math.PI <= angle && angle < Math.PI*3/2)
    {
        trueVertices[0].push("bottom right");
        trueVertices[3].push("bottom left");
        mergingVertices.push(trueVertices[0], trueVertices[3]);
        return mergingVertices;
    }
    else
    {
        trueVertices[2].push("bottom left");
        trueVertices[3].push("bottom right");
        mergingVertices.push(trueVertices[2], trueVertices[3]);
        return mergingVertices;
    }
}


function modifyClassNames(outputPiece, inputPiece, haloIdNumber)
{
    inputPiece.addClass(stopObstacle);
    inputPiece.addClass(mainPiece + haloIdNumber);
    inputPiece.parent().addClass(stopRotatingClass);
    outputPiece.removeClass(attractionOnClass);
    var inputPieceParent = inputPiece.parent();
    var inputPieceOutput = inputPieceParent.find("." + puzzlePiece);
    inputPieceOutput.addClass(attractionOnClass);
}

function attachPieces(outputPiece, inputPiece, haloIdNumber)
{
    var shapeOfPiece;
    if(outputPiece.attr('class').indexOf(triangularPiece) >=0 )
        shapeOfPiece = triangularPiece;
    else if(outputPiece.attr('class').indexOf(squarePiece) >=0 )
        shapeOfPiece = squarePiece;
    else
        shapeOfPiece = roundPiece;
    
    var inputPieceContainerId = inputPiece.parent().attr('id');   
    var inputPieceOriginInTheSpace = getLeftAndTop(inputPieceContainerId);
    
    var containerId = 'container_' + haloIdNumber; 
    
    // DEBUG PART
    
    console.log("puzzlepieceid",outputPiece.attr('id'));
    console.log("fittingPieceId", inputPiece.attr('id'));
    console.log("fittingpiececontainer", inputPieceContainerId);
   
    
    // END DEBUG PART
    // 
    // 
    // da qui il fitting piece fa parte del container
    document.getElementById(containerId).appendChild(document.getElementById(inputPieceContainerId));
    
    setZIndex(inputPiece, haloIdNumber);
    
    var containerOriginInTheSpace = getLeftAndTop(containerId);
    
    var containerRotation = getRotationAngle(containerId);
    var leftOffset = (inputPieceOriginInTheSpace[0] - containerOriginInTheSpace[0]);
    var topOffset = (inputPieceOriginInTheSpace[1] - containerOriginInTheSpace[1]);
    
    var leftRotatedOffset = leftOffset*Math.cos(containerRotation) + topOffset*Math.sin(containerRotation);
    var topRotatedOffset = -leftOffset*Math.sin(containerRotation) + topOffset*Math.cos(containerRotation);
    document.getElementById(inputPieceContainerId).style.left = leftRotatedOffset.toString().concat("px");
    document.getElementById(inputPieceContainerId).style.top = topRotatedOffset.toString().concat("px");
    
    rotateAround(inputPieceContainerId, "top left");
    
    var rotationToBeMatched;
    
    // rotation angle source is different depending on the fact that the puzzlePiece is the first piece
    // attached to the main container or not
    if(firstPieceAttached(outputPiece))
        rotationToBeMatched = outputPiece.attr('id');
    else
        rotationToBeMatched = outputPiece.parent().parent().attr('id');
       
    // match the original fitting piece rotation    
    addRotation(document.getElementById(inputPieceContainerId), getRotationAngle(rotationToBeMatched), 0);
       
    // from here on it's for the attaching animation   
    var rect = outputPiece.get(0).getBoundingClientRect();
    
    var outputPieceRotationAngle;
    
    if(firstPieceAttached(outputPiece))
        outputPieceRotationAngle = getRotationAngle(outputPiece.attr('id')) + containerRotation;
    else
        outputPieceRotationAngle = getRotationAngle(outputPiece.parent().parent().attr('id')) + containerRotation;
    
    while(outputPieceRotationAngle > Math.PI*3/2 || outputPieceRotationAngle < -Math.PI/2){
        if(outputPieceRotationAngle > Math.PI*3/2)
            outputPieceRotationAngle = outputPieceRotationAngle - Math.PI*2;
        else
            outputPieceRotationAngle = outputPieceRotationAngle + Math.PI*2;
    }

    var outputPieceWidth, outputPieceHeight;
    if(outputPiece.attr('class').indexOf(triangularPiece)>= 0){
        var widthAndHeight = retrieveTriangularWidthAndHeight();
        outputPieceWidth = widthAndHeight[0];
        outputPieceHeight = widthAndHeight[1];
    }
    else{
        outputPieceWidth = outputPiece.width();
        outputPieceHeight = outputPiece.height();
    }
    
    var mergingPuzzleVertices = retrieveMergingVertices(rect, outputPieceRotationAngle, outputPieceWidth, outputPieceHeight);
        
    var inputPieceWidth = inputPiece.width();
    var inputPieceHeight = inputPiece.height();
    var boundingRect = inputPiece.get(0).getBoundingClientRect();
    var mergingFittingVertices = retrieveMergingVertices(boundingRect, outputPieceRotationAngle, inputPieceWidth, inputPieceHeight);
    
    var displacementString = computeDisplacement(mergingPuzzleVertices, mergingFittingVertices,
                                        containerRotation, outputPieceRotationAngle, shapeOfPiece);

    console.log("displacement", displacementString);
    $("#" + inputPieceContainerId).animate({
            left: displacementString[0],
            top: displacementString[1]
    });
    
    $("#"+inputPieceContainerId).draggable('disable');  
}


function computeDisplacement(outputPieceVertices, inputPieceVertices, containerRotation, puzzleRotation, shape)
{
    
    var temp = [];
    
    if(shape == triangularPiece)
    {
        var triangleHeight = parseInt(bodyStyles.getPropertyValue('--triangle-height'),10);
        var borderWidth = parseInt(bodyStyles.getPropertyValue('--border-width'),10);
        var bottomBorderHeight = $(".fitting_piece_bottom_borders").height();
        var offset = borderWidth + bottomBorderHeight; // due to the border width and to the height of the 
        var middlePointPuzzle = [];
        middlePointPuzzle = getMiddlePoint(outputPieceVertices[0], outputPieceVertices[1]);
        var puzzleEdge = [middlePointPuzzle[0] + triangleHeight*Math.sin(puzzleRotation),
                            middlePointPuzzle[1] - triangleHeight*Math.cos(puzzleRotation)];
        var middlePointFitting = [];
        middlePointFitting = getMiddlePoint(inputPieceVertices[0], inputPieceVertices[1]);
        var fittingEdge = [middlePointFitting[0] + (triangleHeight + offset)*Math.sin(puzzleRotation),
                            middlePointFitting[1] - (triangleHeight + offset)*Math.cos(puzzleRotation)];
        temp = [puzzleEdge[0] - fittingEdge[0], puzzleEdge[1] - fittingEdge[1]];
    }
    
    else if(shape == roundPiece)
    {
        temp = [outputPieceVertices[0][0] - inputPieceVertices[0][0], outputPieceVertices[1][0] - inputPieceVertices[1][0],
                outputPieceVertices[0][1] - inputPieceVertices[0][1], outputPieceVertices[1][1] - inputPieceVertices[1][1]];
        temp[0] = (temp[0] + temp[1])/2;
        temp[1] = (temp[2] + temp[3])/2;
    }
    
    else
    {
        var squareHeight = parseInt(bodyStyles.getPropertyValue('--square-height'),10);
        var borderWidth = parseInt(bodyStyles.getPropertyValue('--border-width'),10);
        var offset = borderWidth; 
        var middlePointPuzzle = [];
        middlePointPuzzle = getMiddlePoint(outputPieceVertices[0], outputPieceVertices[1]);
        var puzzleEdge = [middlePointPuzzle[0] + squareHeight*Math.sin(puzzleRotation),
                            middlePointPuzzle[1] - squareHeight*Math.cos(puzzleRotation)];
        var middlePointFitting = [];
        middlePointFitting = getMiddlePoint(inputPieceVertices[0], inputPieceVertices[1]);
        var fittingEdge = [middlePointFitting[0] + (squareHeight + offset)*Math.sin(puzzleRotation),
                            middlePointFitting[1] - (squareHeight + offset)*Math.cos(puzzleRotation)];
        temp = [puzzleEdge[0] - fittingEdge[0], puzzleEdge[1] - fittingEdge[1]];
    }
        
    var animationCoords = [];
    animationCoords[0] = temp[0]*Math.cos(containerRotation) + temp[1]*Math.sin(containerRotation);
    animationCoords[1] = -temp[0]*Math.sin(containerRotation) + temp[1]*Math.cos(containerRotation);
    var signPattern = new RegExp("-");
    animationCoords[0] = Math.round(animationCoords[0]);
    animationCoords[1] = Math.round(animationCoords[1]);
    var plusminus = [signPattern.test(animationCoords[0].toString()), signPattern.test(animationCoords[1].toString())];
    var displacementString = [];

    if(plusminus[0])
    {
        animationCoords[0] = animationCoords[0].toString().replace('-', '');
        displacementString[0] = "-=" + parseInt(animationCoords[0],10) + "px";
    }
    else
        displacementString[0] = "+=" + parseInt(animationCoords[0],10) + "px";
    if(plusminus[1])
    {
        animationCoords[1] = animationCoords[1].toString().replace('-', '');
        displacementString[1] = "-=" + parseInt(animationCoords[1],10) + "px";
    }
    else
        displacementString[1] = "+=" + parseInt(animationCoords[1],10) + "px";
    return displacementString;        
}

function setZIndex(fittingPiece, haloIdNumber)
{
    var zIndexToAssign = eval(halozIndexCounterVarName(haloIdNumber));
    fittingPiece.parent().css('z-index', zIndexToAssign.toString());
    eval(halozIndexCounterVarName(haloIdNumber) + " --");
}