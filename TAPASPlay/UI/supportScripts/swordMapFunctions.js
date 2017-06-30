function addASwordToTheMap(haloIdNumber){
    var map = retrieveSwordMap(haloIdNumber);
    var swordIndex = map.size + 1;
    var key = "sword" + swordIndex;
    map.set(key, []);
}

function retrieveSwordMap(haloIdNumber){
    return(eval(haloSwordsMapVarName(haloIdNumber)));
}

function addFirstPieceToTheSword(pieceId, haloIdNumber, swordNumber){
    var map = retrieveSwordMap(haloIdNumber);
    var swordKey = "sword" + swordNumber;
    var sword = map.get(swordKey);
    sword.push(pieceId);
}

function addNotFirstPieceToTheSword(pieceId, haloIdNumber, outputPiece){
    // replace piece if it's not a final piece
    var toBeChecked = $("#" + pieceId).find("." + finalPieceContainerClass);
    if($(toBeChecked).length == 0){
        var newCost = updateCost(pieceId);
        createOperation(haloIdNumber, 0.2, 0.2, 0, getInputShape(pieceId), getOutputShape(pieceId), newCost, getPieceOperation(pieceId));
    }
    
    var map = retrieveSwordMap(haloIdNumber);
    var swordNumber = getSwordNumberFromPieceId(haloIdNumber, outputPiece);
    var swordKey = "sword" + swordNumber;
    var sword = map.get(swordKey);
    sword.push(pieceId);
}

function removeTheLastPieceFromASword(haloIdNumber, swordNumber){
    var map = retrieveSwordMap(haloIdNumber);
    var swordKey = "sword" + swordNumber;
    var sword = map.get(swordKey);
    
    var removedPieceId = sword.pop();
    
    removePieceSubstitute(removedPieceId, haloIdNumber);
    
    var wrapperId;
    var wrapper;
    if(haloIdNumber == 0)
        wrapperId = leftContentWrapperId;
    else
        wrapperId = rightContentWrapperId;
    
    $("#" + wrapperId).append($("#" + removedPieceId));
    
    $("#" + removedPieceId).find("*").removeClass(stopObstacle);
    $("#" + removedPieceId).removeClass(stopRotatingClass);
    $("#" + removedPieceId).draggable('enable');
    $("#" + removedPieceId).css('top', 10);
    $("#" + removedPieceId).css('left', 10);
    addRotation(document.getElementById(removedPieceId), 0, 0);
    
    // restore attraction property on last element of the sword
    var newLastElementId = sword[sword.length-1];
    $("#" + newLastElementId).find("." + puzzlePiece).addClass(attractionOnClass);
}

function resetOneSword(haloIdNumber, swordNumber) {
    var map = retrieveSwordMap(haloIdNumber);
    var swordKey = "sword" + swordNumber;
    var swordLength = map.get(swordKey).length;
    
    for(var i = 0; i < swordLength - 1; i++) // length - 1 because the initial piece mustn't be removed
        removeTheLastPieceFromASword(haloIdNumber, swordNumber);       
}

function resetEverySword(haloIdNumber) {
    var map = retrieveSwordMap(haloIdNumber);
    
    for(var i = 1; i <= map.size; i++)
        resetOneSword(haloIdNumber, i);
}

function activateAttractionOnSword(haloIdNumber, swordNumber){
    var map = retrieveSwordMap(haloIdNumber);
    var swordKey, sword, lastElementId;
        
    for(var i = 1; i <= map.size; i++){
        swordKey = "sword" + i;
        sword = map.get(swordKey);
        lastElementId = sword[sword.length-1];
        
        if(i == swordNumber) // activate the sword
            $("#" + lastElementId).find("." + puzzlePiece).addClass(attractionOnClass);
            
        else // deactivate all other swords
            $("#" + lastElementId).find("." + puzzlePiece).removeClass(attractionOnClass);
                        
    }
}

function computeCostAndPointsOfASword(haloIdNumber, swordNumber){
    var map = retrieveSwordMap(haloIdNumber);
    var swordKey = "sword" + swordNumber;
    var sword = map.get(swordKey);
    
    var cost = 0;
    var points = 0;
        
    for(var i = 0; i < sword.length; i++){
        if(i != 0 && !finalPiece(sword[i])){ // initial piece doesn't have any cost nor op
            cost = cost + parseInt(getPieceCost(sword[i]));
            points = updatePointsCount(getPieceOperation(sword[i]), points);
        }
    }
        
    return[cost, points];        
}

function getSwordNumberFromPieceId(haloIdNumber, pieceId){
    var map = retrieveSwordMap(haloIdNumber);
    var swordKey;
    
    for(var i = 1; i <= map.size; i++){
          
        swordKey = "sword" + i;
        var sword = map.get(swordKey);
        
        // check which sword the outputpiece belongs to and adds the pieceId to that sword
        for(var j = 0; j < sword.length; j++){
            if((pieceId.parent().attr('id').localeCompare(sword[j]) == 0) || 
                    (pieceId.parent().parent().attr('id').localeCompare(sword[j]) == 0)){
                return i;
            }
        }
    }
}