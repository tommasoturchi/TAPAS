function addSquarePiece(haloPiecesCounter, haloAngleCounter, haloIdNumber)
{        
    var mainCircleRadius = parseInt(bodyStyles.getPropertyValue('--main-circle-radius'),10);
    var squareHeight = parseInt(bodyStyles.getPropertyValue('--square-height'),10); 
    var squareWidth = parseInt(bodyStyles.getPropertyValue('--square-width'),10);
    
    var squareWidth = parseInt(bodyStyles.getPropertyValue('--square-width'),10);
    var squareHalfWidth = squareWidth/2;
      
    var mainCircleCenter = mainCircleCenterCoords();
    var angle = 0;
    if (haloAngleCounter == 0)
        angle = Math.PI * 3 / 2;
    else if (haloAngleCounter == 1)
        angle = Math.PI / 6;
    else
        angle = Math.PI * 5 / 6;
    
    var squareCoords = [mainCircleCenter[0] - squareWidth/2 + Math.cos(angle)*(mainCircleRadius+squareHeight/2),
        mainCircleCenter[1] - squareHeight/2 + Math.sin(angle)*(mainCircleRadius+squareHeight/2)];
    
    var containerClass = containerClassStr(haloIdNumber);
    
    var containerId = "container_" + haloIdNumber;
    var container = document.getElementById(containerId);
    var pieceContainer = document.createElement("div");
    pieceContainer.id = "puzzle_piece_" + haloPiecesCounter + "_halo_" + haloIdNumber;
    pieceContainer.className = puzzlePieceContainerClass + " " + containerClass + " " + outputPart;
    container.appendChild(pieceContainer);
    
    var square = document.createElement("div");
    square.id = "square_" + haloPiecesCounter + "_halo_" + haloIdNumber;
    square.className = containerClass + " " + mainPiece + haloIdNumber + " " + puzzlePiece + " " + squarePiece; //+ " " + attractionOnClass;
    square.style.left = squareCoords[0].toString().concat("px");
    square.style.top = squareCoords[1].toString().concat("px");
    square.style.background = piecesBackgroundColour;
    
    var leftPart = document.createElement("div");
    leftPart.id = "left_part";
    leftPart.className = "left_side_square_piece";
    leftPart.style.position = "absolute";
    leftPart.style.height = squareHeight.toString().concat("px");
    leftPart.style.width = squareHalfWidth.toString().concat("px");
    leftPart.style.top = "0px";
    leftPart.style.left = "0px";
    leftPart.style.margin = "0px";
    
    var rightPart = document.createElement("div");
    rightPart.id = "right_part";
    rightPart.className = "right_side_square_piece";
    rightPart.style.position = "absolute";
    rightPart.style.height = squareHeight.toString().concat("px");
    rightPart.style.width = squareHalfWidth.toString().concat("px");
    rightPart.style.top = "0px";
    rightPart.style.left = squareHalfWidth.toString().concat("px");
    
    pieceContainer.appendChild(square);

    var rotationOffset = 90;
    addRotation(square, angle, rotationOffset);

    square.appendChild(leftPart);
    square.appendChild(rightPart);

    square.style.zIndex = document.getElementById("main_circle_" + haloIdNumber).style.zIndex;
    
    var addedPiecesArray = eval(haloAddedPiecesArrayVarName(haloIdNumber));
    addedPiecesArray.push(pieceContainer.id);
    
    var stackPosition = 1;
    addToIdRelationshipArray(pieceContainer.id, stackPosition);
    
    addHilt(haloIdNumber, haloPiecesCounter, angle, rotationOffset, mainCircleCenter, container);
    
    var swordNumber = haloAngleCounter + 1;
    addFirstPieceToTheSword(pieceContainer.id, haloIdNumber, swordNumber);
    
    rotateMainPiece(haloIdNumber);
}



function addSquarePieceOnOperation(haloPiecesCounter, haloIdNumber, onTopOfWhatId)
{        
    var squareHeight = parseInt(bodyStyles.getPropertyValue('--square-height'),10); 
    
    var squareWidth = parseInt(bodyStyles.getPropertyValue('--square-width'),10);
    var squareHalfWidth = squareWidth/2;
    var fittingPieceWidth = parseInt(bodyStyles.getPropertyValue('--fitting-rectangle-width'),10);
    var squareLeft = (fittingPieceWidth - squareWidth)/2;
    var leftPartLeft = squareLeft;
    var rightPartLeft = squareLeft + squareHalfWidth;
    var squareTop = -squareHeight;
    var leftAndRightPartTop = squareTop;
      
    var miniContainer = document.getElementById(onTopOfWhatId);
    
    var containerClass = containerClassStr(haloIdNumber);
    
    var pieceContainer = document.createElement("div");
    pieceContainer.id = "puzzle_piece_" + haloPiecesCounter + "_halo_" + haloIdNumber;
    pieceContainer.className = puzzlePieceContainerClass + " " + containerClass + " " +  outputPart;
    miniContainer.appendChild(pieceContainer);
        
    var square = document.createElement("div");
    square.id = "square_" + haloPiecesCounter + "_halo_" + haloIdNumber;
    square.className = containerClass + " " + puzzlePiece + " " + squarePiece;
    square.style.left = squareLeft.toString().concat("px");
    square.style.top = squareTop.toString().concat("px");
    square.style.background = piecesBackgroundColour;
        
    var leftPart = document.createElement("div");
    leftPart.id = "left_part";
    leftPart.className = "left_side_square_piece";
    leftPart.style.position = "absolute";
    leftPart.style.height = squareHeight.toString().concat("px");
    leftPart.style.width = squareHalfWidth.toString().concat("px");
    leftPart.style.top = leftAndRightPartTop.toString().concat("px");
    leftPart.style.left = leftPartLeft.toString().concat("px");;
    leftPart.style.margin = "0px";
    
    var rightPart = document.createElement("div");
    rightPart.id = "right_part";
    rightPart.className = "right_side_square_piece";
    rightPart.style.position = "absolute";
    rightPart.style.height = squareHeight.toString().concat("px");
    rightPart.style.width = squareHalfWidth.toString().concat("px");
    rightPart.style.top = leftAndRightPartTop.toString().concat("px");
    rightPart.style.left = rightPartLeft.toString().concat("px");
    
    pieceContainer.appendChild(square);

    var rotationOffset = 0;
    var angle = getRotationAngle(miniContainer.id);
    addRotation(square, angle, rotationOffset);
    
    pieceContainer.appendChild(leftPart);
    pieceContainer.appendChild(rightPart);
    leftPart.style.zIndex = "20";
    rightPart.style.zIndex = "20";

    miniContainer.style.zIndex = "13";
    
    var addedPiecesArray = eval(haloAddedPiecesArrayVarName(haloIdNumber));
    addedPiecesArray.push(pieceContainer.id);
    
    var onTopOf = document.getElementById(onTopOfWhatId);
    onTopOf.style.zIndex = "13";
}

