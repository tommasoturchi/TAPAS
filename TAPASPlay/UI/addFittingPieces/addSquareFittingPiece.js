function addSquareFittingPiece(haloPiecesCounter, haloIdNumber, outputShape, cost, op)
{
    var squareWidth = parseInt(bodyStyles.getPropertyValue('--square-width'),10);
    var squareHeight = parseInt(bodyStyles.getPropertyValue('--square-height'),10);
    var borderWidth = parseInt(bodyStyles.getPropertyValue('--border-width'),10);
    var fittingPieceWidth = parseInt(bodyStyles.getPropertyValue('--fitting-rectangle-width'),10);
    var halfWidth = fittingPieceWidth/2;
    var leftPartLeft = 0;
    var rightPartLeft = halfWidth;
    var fittingPieceHeight = parseInt(bodyStyles.getPropertyValue('--fitting-rectangle-height'),10);

    var containerClass = containerClassStr(haloIdNumber);
    
    var miniContainer = document.createElement("div");
    miniContainer.id = "fitting_piece_" + haloPiecesCounter + "_halo_" + haloIdNumber;
    miniContainer.className = fittingPieceContainerClass + " " + containerClass;
    
    var idStringInCommon = "square_" + haloPiecesCounter + "_halo_" + haloIdNumber;
    
    var fittingPiece = document.createElement("div");
    fittingPiece.id = idStringInCommon + "_fitting_rectangle";
    fittingPiece.className = fittingRectangleClass + " " + containerClass;
    miniContainer.style.width = fittingPieceWidth.toString().concat("px");
    miniContainer.style.height = fittingPieceHeight.toString().concat("px");
    miniContainer.style.background = piecesBackgroundColour;
    
    var insideSquare = document.createElement("div");
    insideSquare.id = idStringInCommon + "_fitting_square";
    insideSquare.className = "inside_fitting_square ";
    insideSquare.style.width = squareWidth.toString().concat("px");
    insideSquare.style.height = squareHeight.toString().concat("px");
    var insideSquareLeft = ((fittingPieceWidth-squareWidth-borderWidth*2)/2);
    insideSquare.style.left = insideSquareLeft.toString().concat("px");
    
    var leftPart = document.createElement("div");
    leftPart.id = "left_part";
    leftPart.className = "left_side";
    leftPart.style.position = "absolute";
    leftPart.style.height = fittingPieceHeight.toString().concat("px");
    leftPart.style.width = halfWidth.toString().concat("px");
    leftPart.style.top = "0px";
    leftPart.style.left = leftPartLeft.toString().concat("px");
    
    var rightPart = document.createElement("div");
    rightPart.id = "right_part";
    rightPart.className = "right_side";
    rightPart.style.position = "absolute";
    rightPart.style.height = fittingPieceHeight.toString().concat("px");
    rightPart.style.width = halfWidth.toString().concat("px");
    rightPart.style.top = "0px";
    rightPart.style.left = rightPartLeft.toString().concat("px");
    
    var wrapperId;
    var wrapper;
    if(haloIdNumber == 0)
        wrapperId = leftContentWrapperId;
    else
        wrapperId = rightContentWrapperId;
    wrapper = document.getElementById(wrapperId);
    wrapper.appendChild(miniContainer);
    miniContainer.appendChild(fittingPiece);
    fittingPiece.appendChild(leftPart);
    fittingPiece.appendChild(rightPart);
    fittingPiece.appendChild(insideSquare);
    
    /*
    if(outputShape < 0)
        addTextInDiv(fittingPiece, halfWidth, "&nbsp;10", "×(-3)");
    else if(outputShape > 0)
        addTextInDiv(fittingPiece, halfWidth, "&nbsp;10", "&nbsp;×(-3)");
    else if(outputShape == 0)
        addTextInDiv(fittingPiece, halfWidth, "&nbsp;&nbsp;5", "&nbsp;+7");
    */
    addTextInDiv(fittingPiece, halfWidth, cost, op);
    
    fittingPiece.className = fittingPiece.className + " " + squareObstacle + " " + fittingPieceClass;
      
    $( "#" + miniContainer.id).draggable({
        containment: "#" + wrapperId,
        cancel : "#" + insideSquare.id,
        drag: function()
        {              
            preventCollisionBtwFittingPieces(haloIdNumber);                    
        },
        start: function()
        {
            $("#" + miniContainer.id).data("dragging", true);
        },
        stop: function()
        {
            $("#" + miniContainer.id).data("dragging", false);
            sendMoveIngredient(miniContainer.id, haloIdNumber);
        } 
    });
    
    rotateFittingPiece(miniContainer.id);
    
    addToIdRelationshipArray(miniContainer.id, 0);
    
    if(outputShape < 0)
        addRoundPieceOnOperation(haloPiecesCounter, haloIdNumber, miniContainer.id);
    else if(outputShape > 0)
        addSquarePieceOnOperation(haloPiecesCounter, haloIdNumber, miniContainer.id);
    else if(outputShape == 0)
        addTriangularPieceOnOperation(haloPiecesCounter, haloIdNumber, miniContainer.id);
    else
        addFinalPiece(haloPiecesCounter, haloIdNumber, miniContainer.id);
}



