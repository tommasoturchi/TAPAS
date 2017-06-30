function addFinalPiece(haloPiecesCounter, haloIdNumber, onTopOfWhatId)
{
    var endPieceHalfBase = parseInt(bodyStyles.getPropertyValue('--end-piece-half-base'),10); 
    var endPieceHeight = parseInt(bodyStyles.getPropertyValue('--end-piece-height'),10);
    var fittingPieceWidth = parseInt(bodyStyles.getPropertyValue('--fitting-rectangle-width'),10);
    var endPieceTop = -endPieceHeight;
        
    var miniContainer = document.getElementById(onTopOfWhatId);
    
    var containerClass = containerClassStr(haloIdNumber);
                           
    var pieceContainer = document.createElement("div");
    pieceContainer.id = "final_piece_" + haloPiecesCounter + "_halo_" + haloIdNumber;
    pieceContainer.className = finalPieceContainerClass + " " + containerClass;
    miniContainer.appendChild(pieceContainer);
    
    var endPiece = document.createElement("div");
    endPiece.id = "end_part_" + haloPiecesCounter + "_halo_" + haloIdNumber;
    endPiece.className = containerClass + " " + mainPiece + haloIdNumber + " " + endPieceClass;
    endPiece.style.left = "0px";
    endPiece.style.top = endPieceTop.toString().concat("px");
    endPiece.style.borderBottomColor = piecesBorderColour;
    pieceContainer.appendChild(endPiece);
    
    var leftPart = document.createElement("div");
    leftPart.id = "left_part";
    leftPart.className = "left_side_end_piece";
    leftPart.style.position = "absolute";
    leftPart.style.height = "0px";
    leftPart.style.width = "0px";
    leftPart.style.top = endPieceTop.toString().concat("px");
    leftPart.style.left = "0px";
    leftPart.style.margin = "0px";
    
    var rightPart = document.createElement("div");
    rightPart.id = "right_part";
    rightPart.className = "right_side_end_piece";
    rightPart.style.position = "absolute";
    rightPart.style.height = "0px";
    rightPart.style.width = "0px";
    rightPart.style.top = endPieceTop.toString().concat("px");
    var rightPartLeft = endPieceHalfBase;
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