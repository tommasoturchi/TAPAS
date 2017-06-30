function addTriangularPiece(haloPiecesCounter, haloAngleCounter, haloIdNumber)
{
    var mainCircleRadius = parseInt(bodyStyles.getPropertyValue('--main-circle-radius'),10);
    var triangleHalfBase = parseInt(bodyStyles.getPropertyValue('--triangle-half-base'),10); 
    var triangleSidesWidth = parseInt(bodyStyles.getPropertyValue('--triangle-sides-width'),10);
    var leftPartLeft =  -triangleHalfBase + triangleSidesWidth;
    var triangleHeight = parseInt(bodyStyles.getPropertyValue('--triangle-height'),10);
    var leftAndRightTop = 0;
    
    
    var mainCircleCenter = mainCircleCenterCoords();
    var angle = 0;
    if (haloAngleCounter == 0)
        angle = Math.PI * 3 / 2;
    else if (haloAngleCounter == 1)
        angle = Math.PI / 6;
    else
        angle = Math.PI * 5 / 6;

    var externalTriangleCoords = [mainCircleCenter[0] - triangleHalfBase + (Math.cos(angle)*(mainCircleRadius+triangleHeight/2)),
        mainCircleCenter[1] - triangleHeight/2 + (Math.sin(angle)*(mainCircleRadius + triangleHeight/2))];
    
    var containerClass = containerClassStr(haloIdNumber);
    
    var containerId = "container_" + haloIdNumber;
    var container = document.getElementById(containerId);
    
    var pieceContainer = document.createElement("div");
    pieceContainer.id = "puzzle_piece_" + haloPiecesCounter + "_halo_" + haloIdNumber;
    pieceContainer.className = puzzlePieceContainerClass + " " + containerClass + " " + outputPart;
    container.appendChild(pieceContainer);
    
    var triangleBorder = document.createElement("div");
    triangleBorder.id = "triangle_" + haloPiecesCounter + "_halo_" + haloIdNumber;
    triangleBorder.className = containerClass + " " + mainPiece + haloIdNumber  + " " + puzzlePiece + " " + triangularPiece +  " triangular_pieces_border "; //+  attractionOnClass;
    triangleBorder.style.left = externalTriangleCoords[0].toString().concat("px");
    triangleBorder.style.top = externalTriangleCoords[1].toString().concat("px");
    triangleBorder.style.borderBottomColor = piecesBackgroundColour;
    pieceContainer.appendChild(triangleBorder);

    var rotationOffset = 90;
    addRotation(triangleBorder, angle, rotationOffset);
    
    var leftPart = document.createElement("div");
    leftPart.id = "left_part";
    leftPart.className = "left_side_triangular_piece";
    leftPart.style.position = "absolute";
    leftPart.style.top = leftAndRightTop.toString().concat("px");
    leftPart.style.left = leftPartLeft.toString().concat("px");;
    leftPart.style.margin = "0px";
    
    var rightPart = document.createElement("div");
    rightPart.id = "right_part";
    rightPart.className = "right_side_triangular_piece";
    rightPart.style.position = "absolute";
    rightPart.style.top = leftAndRightTop.toString().concat("px");
    var rightPartLeft = leftPartLeft + triangleHalfBase;
    rightPart.style.left = rightPartLeft.toString().concat("px");
    console.log("leftpartleft", leftPartLeft);
    console.log("rightpartleft", rightPartLeft);
    
    leftPart.style.zIndex = "20";
    rightPart.style.zIndex = "20";
     
    triangleBorder.appendChild(leftPart);
    triangleBorder.appendChild(rightPart);
    
    triangleBorder.style.zIndex = document.getElementById("main_circle_" + haloIdNumber).style.zIndex;
    
    var addedPiecesArray = eval(haloAddedPiecesArrayVarName(haloIdNumber));
    addedPiecesArray.push(pieceContainer.id);
    
    var stackPosition = 1;    
    addToIdRelationshipArray(pieceContainer.id, stackPosition);
    
    addHilt(haloIdNumber, haloPiecesCounter, angle, rotationOffset, mainCircleCenter, container);
    
    var swordNumber = haloAngleCounter + 1;
    addFirstPieceToTheSword(pieceContainer.id, haloIdNumber, swordNumber);
    
    rotateMainPiece(haloIdNumber);
}

function addTriangularPieceOnOperation(haloPiecesCounter, haloIdNumber, onTopOfWhatId)
{
    var triangleHalfBase = parseInt(bodyStyles.getPropertyValue('--triangle-half-base'),10); 
    var triangleHeight = parseInt(bodyStyles.getPropertyValue('--triangle-height'),10);
    var fittingPieceWidth = parseInt(bodyStyles.getPropertyValue('--fitting-rectangle-width'),10);
    var triangleTop = -triangleHeight;
    var triangleLeft = (fittingPieceWidth - triangleHalfBase*2) / 2;
    //if(inputShape == triangularPiece)
      //  triangleLeft = triangleLeft + 1;
    
    
    var miniContainer = document.getElementById(onTopOfWhatId);
    
    var containerClass = containerClassStr(haloIdNumber);
                           
    var pieceContainer = document.createElement("div");
    pieceContainer.id = "puzzle_piece_" + haloPiecesCounter + "_halo_" + haloIdNumber;
    pieceContainer.className = puzzlePieceContainerClass + " " + containerClass + " " +  outputPart;
    miniContainer.appendChild(pieceContainer);
    
    var triangleBorder = document.createElement("div");
    triangleBorder.id = "triangle_" + haloPiecesCounter + "_halo_" + haloIdNumber;
    triangleBorder.className = containerClass + " " + mainPiece + haloIdNumber + " " + puzzlePiece + " " + triangularPiece +  " triangular_pieces_border";
    triangleBorder.style.left = triangleLeft.toString().concat("px");
    triangleBorder.style.top = triangleTop.toString().concat("px");
    triangleBorder.style.borderBottomColor = piecesBackgroundColour;
    pieceContainer.appendChild(triangleBorder);
    
    var leftPart = document.createElement("div");
    leftPart.id = "left_part";
    leftPart.className = "left_side_triangular_piece";
    leftPart.style.position = "absolute";
    leftPart.style.top = triangleTop.toString().concat("px");
    leftPart.style.left = triangleLeft.toString().concat("px");;
    leftPart.style.margin = "0px";
    
    var rightPart = document.createElement("div");
    rightPart.id = "right_part";
    rightPart.className = "right_side_triangular_piece";
    rightPart.style.position = "absolute";
    rightPart.style.top = triangleTop.toString().concat("px");
    var rightPartLeft = triangleLeft + triangleHalfBase;
    rightPart.style.left = rightPartLeft.toString().concat("px");
    
    leftPart.style.zIndex = "20";
    rightPart.style.zIndex = "20";
    
    pieceContainer.appendChild(leftPart);
    pieceContainer.appendChild(rightPart);
    
    var onTopOf = document.getElementById(onTopOfWhatId);
    onTopOf.style.zIndex = "13";
            
    var addedPiecesArray = eval(haloAddedPiecesArrayVarName(haloIdNumber));
    addedPiecesArray.push(pieceContainer.id);
}