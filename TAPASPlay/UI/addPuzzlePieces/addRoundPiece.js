function addRoundPiece(haloPiecesCounter, haloAngleCounter, haloIdNumber)
{        
    var mainCircleRadius = parseInt(bodyStyles.getPropertyValue('--main-circle-radius'),10);
    var smallerCircleHeight = parseInt(bodyStyles.getPropertyValue('--smaller-circle-height'),10); 
    var smallerCircleWidth = parseInt(bodyStyles.getPropertyValue('--smaller-circle-width'),10);
    var leftAndRightPartHeight = smallerCircleHeight;
    var halfCircleWidth = smallerCircleWidth/2;
    
    var mainCircleCenter = mainCircleCenterCoords();
    
    console.log("coord centro", mainCircleCenter);
    
    var angle = 0;
    if (haloAngleCounter == 0)
        angle = Math.PI * 3 / 2;
    else if (haloAngleCounter == 1)
        angle = Math.PI / 6;
    else
        angle = Math.PI * 5 / 6;
    
    var smallerCircleCoords = [mainCircleCenter[0] - smallerCircleWidth/2 + Math.cos(angle)*(mainCircleRadius + smallerCircleHeight/2),
        mainCircleCenter[1] - smallerCircleHeight/2  + Math.sin(angle)*(mainCircleRadius+smallerCircleHeight/2)];
   
    var containerClass = containerClassStr(haloIdNumber);
    
    var containerId = "container_" + haloIdNumber;
    var container = document.getElementById(containerId);
    var pieceContainer = document.createElement("div");
    pieceContainer.id = "puzzle_piece_" + haloPiecesCounter + "_halo_" + haloIdNumber;
    pieceContainer.className = puzzlePieceContainerClass + " " + containerClass + " " +  outputPart;
    container.appendChild(pieceContainer);
    
    var smallerCircle = document.createElement("div");
    smallerCircle.id = "smaller_circle_" + haloPiecesCounter + "_halo_" + haloIdNumber;
    smallerCircle.className = containerClass + " " + puzzlePiece + " " + roundPiece; //+ " " + attractionOnClass;
    smallerCircle.style.left = smallerCircleCoords[0].toString().concat("px");
    smallerCircle.style.top = smallerCircleCoords[1].toString().concat("px");
    
    smallerCircle.style.background = piecesBackgroundColour;
    smallerCircle.style.borderColor = piecesBorderColour;
    
    var leftPart = document.createElement("div");
    leftPart.id = "left_part";
    leftPart.className = "left_side_round_piece";
    leftPart.style.position = "absolute";
    leftPart.style.height = leftAndRightPartHeight.toString().concat("px");
    leftPart.style.width = halfCircleWidth.toString().concat("px");
    leftPart.style.top = "0px";//leftAndRightPartTop.toString().concat("px");
    leftPart.style.left = "0px";
    leftPart.style.margin = "0px";
    
    var rightPart = document.createElement("div");
    rightPart.id = "right_part";
    rightPart.className = "right_side_round_piece";
    rightPart.style.position = "absolute";
    rightPart.style.height = leftAndRightPartHeight.toString().concat("px");
    rightPart.style.width = halfCircleWidth.toString().concat("px");
    rightPart.style.top = "0px";//leftAndRightPartTop.toString().concat("px");
    rightPart.style.left = halfCircleWidth.toString().concat("px");
    
    pieceContainer.appendChild(smallerCircle);
    
    var rotationOffset = 90;
    addRotation(smallerCircle, angle, rotationOffset);
       
    smallerCircle.appendChild(leftPart);
    smallerCircle.appendChild(rightPart);
    
    smallerCircle.style.zIndex = document.getElementById("main_circle_" + haloIdNumber).style.zIndex;
    
    var addedPiecesArray = eval(haloAddedPiecesArrayVarName(haloIdNumber));
    addedPiecesArray.push(pieceContainer.id);
    
    var stackPosition = 1;
    addToIdRelationshipArray(pieceContainer.id, stackPosition);
    
    addHilt(haloIdNumber, haloPiecesCounter, angle, rotationOffset, mainCircleCenter, container);
    
    var swordNumber = haloAngleCounter + 1;
    addFirstPieceToTheSword(pieceContainer.id, haloIdNumber, swordNumber);
   
    rotateMainPiece(haloIdNumber);
}


function addRoundPieceOnOperation(haloPiecesCounter, haloIdNumber, onTopOfWhatId)
{
    var smallerCircleHeight = parseInt(bodyStyles.getPropertyValue('--smaller-circle-height'),10); 
    var smallerCircleWidth = parseInt(bodyStyles.getPropertyValue('--smaller-circle-width'),10);
    var fittingPieceWidth = parseInt(bodyStyles.getPropertyValue('--fitting-rectangle-width'),10);
    var smallerCircleLeft = (fittingPieceWidth - smallerCircleWidth)/2;
    var halfCircleWidth = smallerCircleWidth/2;
    var smallerCircleTop = -smallerCircleHeight;
    var leftAndRightPartHeight = smallerCircleHeight;
    var leftAndRightPartTop = -smallerCircleHeight;
    var rightPartLeft = (fittingPieceWidth / 2);
    
    var borderColourString = "#cccccc";//eval(retrieveBorderColour(haloIdNumber));
    
    var miniContainer = document.getElementById(onTopOfWhatId);
    
    var containerClass = containerClassStr(haloIdNumber);
    
    var pieceContainer = document.createElement("div");
    pieceContainer.id = "puzzle_piece_" + haloPiecesCounter + "_halo_" + haloIdNumber;
    pieceContainer.className = puzzlePieceContainerClass + " " + containerClass + " " +  outputPart;
    miniContainer.appendChild(pieceContainer);
    
    var smallerCircle = document.createElement("div");
    smallerCircle.id = "smaller_circle_" + haloPiecesCounter + "_halo_" + haloIdNumber;
    var smallerCircleId = smallerCircle.id;
    smallerCircle.className = containerClass + " " + mainPiece + haloIdNumber + " " + puzzlePiece + " " + roundPiece;
    smallerCircle.style.left = smallerCircleLeft.toString().concat("px");
    smallerCircle.style.top = smallerCircleTop.toString().concat("px");
    
    smallerCircle.style.background = piecesBackgroundColour;
    smallerCircle.style.borderColor = borderColourString;
    
    var leftPart = document.createElement("div");
    leftPart.id = "left_part";
    leftPart.className = "left_side_round_piece";
    leftPart.style.position = "absolute";
    leftPart.style.height = leftAndRightPartHeight.toString().concat("px");
    leftPart.style.width = halfCircleWidth.toString().concat("px");
    leftPart.style.top = leftAndRightPartTop.toString().concat("px");
    leftPart.style.left = smallerCircle.style.left;
    leftPart.style.margin = "0px";
    
    var rightPart = document.createElement("div");
    rightPart.id = "right_part";
    rightPart.className = "right_side_round_piece";
    rightPart.style.position = "absolute";
    rightPart.style.height = leftAndRightPartHeight.toString().concat("px");
    rightPart.style.width = halfCircleWidth.toString().concat("px");
    rightPart.style.top = leftAndRightPartTop.toString().concat("px");
    rightPart.style.left = rightPartLeft.toString().concat("px");
    
    pieceContainer.appendChild(smallerCircle);
    
    
    var rotationOffset = 0;
    var angle = getRotationAngle(miniContainer.id);
    addRotation(smallerCircle, angle, rotationOffset);
    
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
