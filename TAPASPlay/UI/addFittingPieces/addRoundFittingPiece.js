function addRoundFittingPiece(haloPiecesCounter, haloIdNumber, outputShape, cost, op)
{
    var rectangleWidth = parseInt(bodyStyles.getPropertyValue('--fitting-rectangle-width'), 10);
    var halfWidth = rectangleWidth/2;
    var quarterWidth = halfWidth/2;
    
    var rectangleHeight = parseInt(bodyStyles.getPropertyValue('--fitting-rectangle-height'),10);
    
    var containerClass = containerClassStr(haloIdNumber);
    
    var miniContainer = document.createElement("div");
    miniContainer.id = "fitting_piece_" + haloPiecesCounter + "_halo_" + haloIdNumber;
    miniContainer.className = fittingPieceContainerClass + " " + containerClass;
    miniContainer.style.width = rectangleWidth.toString().concat("px");
    miniContainer.style.height = rectangleHeight.toString().concat("px");
    
    var idStringInCommon = "smaller_circle_" + haloPiecesCounter + "_halo_" + haloIdNumber;
    
    var fittingPiece = document.createElement("div");
    fittingPiece.id = idStringInCommon + "_fitting_rectangle";
    fittingPiece.className = fittingRectangleClass + " " + containerClass;
    fittingPiece.style.background = piecesBackgroundColour;
    
    var roundPart = document.createElement("div");
    roundPart.id = idStringInCommon + "_fitting_round";
    roundPart.className = "fitting_round_part";
    roundPart.style.bottom = "0px";
    roundPart.style.left = quarterWidth.toString().concat("px");
    
    var leftPart = document.createElement("div");
    leftPart.id = "left_part";
    leftPart.className = "left_side";
    leftPart.style.position = "absolute";
    leftPart.style.height = rectangleHeight.toString().concat("px");
    leftPart.style.width = halfWidth.toString().concat("px");
    leftPart.style.top = "0px";
    leftPart.style.left = "0px";
    
    var rightPart = document.createElement("div");
    rightPart.id = "right_part";
    rightPart.className = "right_side";
    rightPart.style.position = "absolute";
    rightPart.style.height = rectangleHeight.toString().concat("px");
    rightPart.style.width = halfWidth.toString().concat("px");
    rightPart.style.top = "0px";
    rightPart.style.left = halfWidth.toString().concat("px");
    
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
    fittingPiece.appendChild(roundPart);
    
    /*
    if(outputShape == -1)
        addTextInDiv(fittingPiece, halfWidth, "20", "×(-3)");
    else if(outputShape == 1)
        addTextInDiv(fittingPiece, halfWidth, "5", "+50");
    else if(outputShape == 0)
        addTextInDiv(fittingPiece, halfWidth, "5", "+50");
    */
    addTextInDiv(fittingPiece, halfWidth, cost, op);
    
    fittingPiece.className = fittingPiece.className + " " + roundObstacle + " " + fittingPieceClass;
    
    $( "#" + miniContainer.id).draggable({
        containment: "#" + wrapperId,
        //cancel : "#" + internalShadow.id,
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
    
    if(outputShape == -1)
        addRoundPieceOnOperation(haloPiecesCounter, haloIdNumber, miniContainer.id);
    else if(outputShape == 1)
        addSquarePieceOnOperation(haloPiecesCounter, haloIdNumber, miniContainer.id);
    else if(outputShape == 0)
        addTriangularPieceOnOperation(haloPiecesCounter, haloIdNumber, miniContainer.id);
    else
        addFinalPiece(haloPiecesCounter, haloIdNumber, miniContainer.id);
}