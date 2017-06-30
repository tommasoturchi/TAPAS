var ws = new WebSocket("ws://localhost:9001/ui");

function startInteraction()
{
    ws.onmessage = function(event)
    {
        var json = JSON.parse(event.data);
        //console.log(json); 
        var howManyCommands = json.commands.length;
        for(var i = 0; i < howManyCommands; i++)
        {
            var id = json.commands[i].id;
            var cmd = json.commands[i].cmd;
            var left = json.commands[i].args.left;
            var top = json.commands[i].args.top;
            var theta = json.commands[i].args.theta;
            var type1 = json.commands[i].args.type1;
            var type2 = json.commands[i].args.type2;
            var id2 = json.commands[i].args.id2;
            var cost = json.commands[i].args.cost;
            var op = json.commands[i].args.op;

            if(cmd == 0)
                moveHalo(id, left, top, theta);
            else if(cmd == 1)
                addAHilt(id, type1);
            else if(cmd == 2)
                createOperation(id, left, top, theta, type1, type2, cost, op, id2); // type1: inputType, type2: outputType
            else if(cmd == 3)
                moveOperation(id, left, top, theta);            
            else if(cmd == 4)
                activateAttractionOnSword(id, id2); //id: haloIdNUmber, id2: swordNumber
            else if(cmd == 5)
                removeTheLastPieceFromASword(id, id2); //id: haloIdNUmber, id2: swordNumber
            else if(cmd == 6)
                resetOneSword(id, id2); //id: haloIdNUmber, id2: swordNumber
            else if(cmd == 7)
                resetEverySword(id);
            else if(cmd == 8)
                removeAllOperations(id);
            else if(cmd == 9)
                removeHaloAndOps(id);
            else if(cmd == 10)
                sendScore(id);
            else
                console.log("comando inesistente");
        }
    };
}


function moveHalo(serverId, left, top, theta)
{
    var contentWrapper = document.getElementById(leftContentWrapperId);
    if(idRelationshipCounter < serverId)
        addAHalo(left, top);
    else
    {
        var haloId = getInterfaceId(serverId);
        var halo = document.getElementById(haloId);
        var wrapperWidth = contentWrapper.offsetWidth;
        var wrapperHeight = contentWrapper.offsetHeight;
        left = left*(wrapperWidth - halo.offsetWidth);
        top = top*(wrapperHeight - halo.offsetHeight);

        addRotation(halo, theta, 0);

        $("#" + haloId).css({
                left: left,
                top: top
        });

        var wrapperId;
        var wrapper;
        if (serverId == 0)
            wrapperId = leftContentWrapperId;
        else
            wrapperId = rightContentWrapperId;
        wrapper = document.getElementById(wrapperId);
    
        $(wrapper).find("*").css({display : "block"});
    }
}

function addAHilt(haloIdNumber, type)
{
    addASwordToTheMap(haloIdNumber);
    
    if(type < 0)
        addRoundPiece(eval(haloPiecesCounterVarName(haloIdNumber)), eval(haloAngleCounterVarName(haloIdNumber)), haloIdNumber);
    else if(type > 0)
        addSquarePiece(eval(haloPiecesCounterVarName(haloIdNumber)), eval(haloAngleCounterVarName(haloIdNumber)), haloIdNumber);
    else
        addTriangularPiece(eval(haloPiecesCounterVarName(haloIdNumber)), eval(haloAngleCounterVarName(haloIdNumber)), haloIdNumber);
    
    eval(haloAngleCounterVarName(haloIdNumber) + " ++");  
    eval(haloPiecesCounterVarName(haloIdNumber) + " ++"); 
    
}

function createOperation(haloIdNumber, left, top, theta, inputType, outputType, cost, op) // to be fixed
{
    var contentWrapper;
    op = op.replace("x", "×");
    if(inputType < 0)
        addRoundFittingPiece(eval(haloPiecesCounterVarName(haloIdNumber)), haloIdNumber, outputType, cost, op);
    else if(inputType > 0)
        addSquareFittingPiece(eval(haloPiecesCounterVarName(haloIdNumber)), haloIdNumber, outputType, cost, op);
    else
        addTriangularFittingPiece(eval(haloPiecesCounterVarName(haloIdNumber)), haloIdNumber, outputType, cost, op);
        
    eval(haloPiecesCounterVarName(haloIdNumber) + " ++");  
    
    // move and rotate to left, top and theta coordinates
    if(haloIdNumber == 0)
        contentWrapper = document.getElementById(leftContentWrapperId);
    else
        contentWrapper = document.getElementById(rightContentWrapperId);
    
    var wrapperWidth = contentWrapper.offsetWidth;
    var wrapperHeight = contentWrapper.offsetHeight;
    
    var addedOperationId = idRelationship[idRelationship.length - 1].interfaceId;
    var addedOperation = document.getElementById(addedOperationId);
    
    left = left*(wrapperWidth - addedOperation.offsetWidth);
    top = top*(wrapperHeight - addedOperation.offsetHeight);
    addedOperation.style.left = left.toString().concat("px");
    addedOperation.style.top = top.toString().concat("px");

    addRotation(addedOperation, theta, 0);
}

function moveOperation(id, left, top, theta)
{
    var contentWrapper;
    var operationId = getInterfaceId(id);
    var operation = document.getElementById(operationId);
    if($(operation).hasClass(containerClassStr(0)))
        contentWrapper = document.getElementById(leftContentWrapperId);
    else
        contentWrapper = document.getElementById(rightContentWrapperId);
    var wrapperWidth = contentWrapper.offsetWidth;
    var wrapperHeight = contentWrapper.offsetHeight;
    
    left = left*(wrapperWidth - operation.offsetWidth);
    top = top*(wrapperHeight - operation.offsetHeight);
    operation.style.left = left.toString().concat("px");
    operation.style.top = top.toString().concat("px");

    addRotation(operation, theta, 0);
}

function removeAllOperations(haloIdNumber)
{
    var wrapperId;
    var wrapper;
    if(haloIdNumber == 0)
        wrapperId = leftContentWrapperId;
    else
        wrapperId = rightContentWrapperId;
    wrapper = document.getElementById(wrapperId);
    
    $(wrapper).children("." + fittingPieceContainerClass).remove();
}

function removeHaloAndOps(haloIdNumber)
{
    var wrapperId;
    var wrapper;
    if(haloIdNumber == 0)
        wrapperId = leftContentWrapperId;
    else
        wrapperId = rightContentWrapperId;
    wrapper = document.getElementById(wrapperId);
    
    $(wrapper).find("*").css({display : "none"});//.remove();
}

function sendScore(haloIdNumber){
    var map = retrieveSwordMap(haloIdNumber);
    for(var i = 1; i <= map.size; i++)
        sendCostAndPoints(haloIdNumber, i);
}

function sendAttachedPiece(puzzlePiece, fittingPiece)
{
    var puzzlePieceInterfaceId = puzzlePiece.parent().attr('id');
    var fittingPieceInterfaceId = fittingPiece.parent().attr('id');
    
    var puzzlePieceServerId = getServerId(puzzlePieceInterfaceId);
    var fittingPieceServerId = getServerId(fittingPieceInterfaceId);
    
    var message = JSON.stringify({
        id: fittingPieceServerId,
        cmd: 11,
        args: {id2: puzzlePieceServerId}
    });
    console.log("sendAttachedPiece", message);
    ws.send(message);
}

function sendMoveIngredient(fittingPieceId, haloIdNumber)
{
    var fittingPieceServerId = getServerId(fittingPieceId);
    var wrapperId;
    var wrapper;
    if(haloIdNumber == 0)
        wrapperId = leftContentWrapperId;
    else
        wrapperId = rightContentWrapperId;
    wrapper = document.getElementById(wrapperId);
    var fittingPiece = document.getElementById(fittingPieceId);
    var leftOffset = parseInt(fittingPiece.style.left,10) / wrapper.offsetWidth;
    var topOffset = parseInt(fittingPiece.style.top,10) / wrapper.offsetHeight;;
    
    var rotationAngle = getRotationAngle(fittingPieceId);
    var message = JSON.stringify({
        id: fittingPieceServerId,
        cmd: 12,
        args: {left: leftOffset,
               top: topOffset,
               theta: rotationAngle}
    });
    console.log("sendMoveIngredient", message);
    ws.send(message);
            
}

function sendCostAndPoints(haloIdNumber, swordNumber)
{
    var costAndPoints = computeCostAndPointsOfASword(haloIdNumber, swordNumber);
    var message = JSON.stringify({
        id: haloIdNumber,
        cmd: 13,
        args: {id2: swordNumber,
               cost: costAndPoints[0],
               points: costAndPoints[1]}
    });
    console.log("sendCostAndPoints", message);
    ws.send(message);
}