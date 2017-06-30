function init(haloId)
{
    var idNumber = getEverythingFromFirstNumberOn(haloId);
    var wrapperId;
    if(idNumber == 0)
        wrapperId = leftContentWrapperId;
    else
        wrapperId = rightContentWrapperId;
    
    $( "#" + haloId).draggable({
        containment: "#" + wrapperId,
        drag: function()
        {              
            preventCollision(idNumber);
            attachMatchingPieces(idNumber);                        
        }
    });
    rotateMainPiece(idNumber);
}


function writeMouseCoordinates()
{
    var inputX = document.getElementById("x-coord");
    var inputY = document.getElementById("y-coord");
    var coordX;
    var coordY;
    
    document.onmousemove=function(e) {
        var e=e||window.event;
        coordX=e.pageX||e.clientX+document.body.scrollLeft,
        coordY=e.pageY||e.clientY+document.body.scrollTop;  
        inputX.value = coordX;
        inputY.value = coordY;
    };
    
    document.ondragover=function(e) {
        e = e || window.event;
        coordX = e.clientX, coordY = e.clientY;
        inputX.value = coordX;
        inputY.value = coordY;
    };
}

function getEverythingFromFirstNumberOn(str)
{
    return str.replace( /^\D+/g, '');
}

function getShadow(id, className)
{
    var piece = document.getElementById(id);
    var clone = piece.cloneNode(false); // false: it doesn't clone his descendants
    clone.className = className;
    clone.id = id + "_shadow";
    return clone;
}

// inputAngle in rad, rotationOffset in deg
function addRotation(piece, inputAngle, rotationOffset)
{
    var rotationAngle;
    inputAngle = inputAngle / (2*Math.PI) * 360;
    rotationAngle = inputAngle + rotationOffset;
    while(rotationAngle < 0 || rotationAngle > 360)
    {
        if(rotationAngle < 0)
            rotationAngle = rotationAngle + 360;
        else
            rotationAngle = rotationAngle - 360;
    }
    
    var rotationString = "rotate(".concat(rotationAngle).concat("deg)");
    //console.log("rotazione", rotationAngle);
    piece.style.transform = rotationString;
    piece.style.webkitTransform = rotationString;
    piece.style.msTransform = rotationString;
}

function mainCircleCenterCoords() // looks like it just depends on radius length
{
     var mainCircleRadius = parseInt(bodyStyles.getPropertyValue('--main-circle-radius'),10);
     var borderWidth = parseInt(bodyStyles.getPropertyValue('--halo-border-width'),10)
    return[mainCircleRadius + borderWidth, mainCircleRadius + borderWidth];
}


function computeDistance(p1, p2)
{
    return Math.sqrt(Math.pow(p1[0] - p2[0],2) + Math.pow(p1[1] - p2[1],2));
}


function getRotationAngle(id) // returns angle in rad
{
    var element = document.getElementById(id);
    var style = window.getComputedStyle(element, null);

    var transform = style.getPropertyValue("-webkit-transform") ||
        style.getPropertyValue("-moz-transform") ||
        style.getPropertyValue("-ms-transform") ||
        style.getPropertyValue("-o-transform") ||
        style.getPropertyValue("transform") ||
        "none";

    if(transform != "none")
    {
        transform = transform.split('(')[1].split(')')[0].split(',');
        var sin = parseFloat(transform[0]);
        var cos = parseFloat(transform[1]);
        var radAngle = - Math.atan2(sin, cos) + Math.PI/2;
        if(radAngle < 0.001 && radAngle > -0.001)
            radAngle = 0;
        return radAngle;
    }
    else
        return 0;
    //console.log("angle", degAngle);
}


function checkRightClick(e)
{
    var isRightMB;
    e = e || window.event;

    if ("which" in e)  // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
        isRightMB = (e.which == 3); 
    else if ("button" in e)  // IE, Opera 
        isRightMB = (e.button == 2); 
    return isRightMB;
}

function findCenter(id)
{
    var circle = document.getElementById(id);
    var holder = circle.getBoundingClientRect();
    //console.log(holder.left, holder.right, holder.top, holder.bottom);

    var topLeftVertex = [holder.left, holder.top];
    var bottomLeftVertex = [holder.left, holder.bottom];
    var topRightVertex = [holder.right, holder.top];

    var center = [(topRightVertex[0] + topLeftVertex[0]) / 2, (topLeftVertex[1] + bottomLeftVertex[1]) / 2];

    //console.log("findCenter", center);
    return center;
}


function rotateMainPiece(haloIdNumber)
{
    var dragging = false;
    var mainPiececlass = "main_piece_" + haloIdNumber;
        $(function() {
        var mainPiece = $('.' + mainPiececlass);
        //console.log("zindex prerotation", $("#smaller_circle_0").css("z-index"));
        mainPiece.mousedown(function(e) {
            e = e || window.event;
            if(checkRightClick(e))
                dragging = true;
        });
        $(document).mouseup(function() {
            dragging = false;
        });
        $(document).mousemove(function(e) {
            e = e || window.event;
            if (dragging) {
                var centerId = "main_circle_" + haloIdNumber;
                var center = findCenter(centerId);
                var toRotate = $("#container_" + haloIdNumber);
                var mouse_x = e.pageX;
                var mouse_y = e.pageY;
                var radians = Math.atan2(mouse_y - center[1], mouse_x - center[0]);
                var degree = (radians * (180 / Math.PI))+90;
                
                toRotate.css('-moz-transform', 'rotate(' + degree + 'deg)');
                toRotate.css('-moz-transform-origin', '50% 50%');
                toRotate.css('-webkit-transform', 'rotate(' + degree + 'deg)');
                toRotate.css('-webkit-transform-origin', '50% 50%');
                toRotate.css('-o-transform', 'rotate(' + degree + 'deg)');
                toRotate.css('-o-transform-origin', '50% 50%');
                toRotate.css('-ms-transform', 'rotate(' + degree + 'deg)');
                toRotate.css('-ms-transform-origin', '50% 50%');
                
            }
        });
    });
}

function stopRotatingElement(elemId)
{
    var elem = $('#' + elemId);
    elem.on('mousedown', function(e) {
        return false;
    });
    elem.on('mouseup', function(e) {
        return false;
    });
    elem.on('mousemove', function(e) {
        return false;
    });
    $(document).mousemove(function(e) {
        return false;
    });
    $(document).mouseup(function() {
            return false;
    });
    elem.on('mouseout', function(e) {
        return false;
    });
    

}


function rotateAround(elementId, pivot)
{
    var toRotate = $("#" + elementId);
    toRotate.css('-moz-transform-origin', pivot);
    toRotate.css('-webkit-transform-origin', pivot);
    toRotate.css('-o-transform-origin', pivot);
    toRotate.css('-ms-transform-origin', pivot);
}


function rotateFittingPiece(rectangleId)
{
    var dragging = false;

        $(function() {
        var piece = $('#' + rectangleId);
        //console.log("zindex prerotation", $("#smaller_circle_0").css("z-index"));
        piece.mousedown(function(e) {
            e = e || window.event;
            if(checkRightClick(e))
                dragging = true;
            if(piece.attr('class').indexOf(stopRotatingClass) >= 0)
                dragging = false;
        });
        $(document).mouseup(function() {
            dragging = false;
        });
        $(document).mousemove(function(e) {
            e = e || window.event;
            
            if (dragging) {
                var center = findCenter(rectangleId);
                var toRotate = piece;
                var mouse_x = e.pageX;
                var mouse_y = e.pageY;
                var radians = Math.atan2(mouse_y - center[1], mouse_x - center[0]);
                var degree = (radians * (180 / Math.PI))+90;
                toRotate.css('-moz-transform', 'rotate(' + degree + 'deg)');
                toRotate.css('-moz-transform-origin', '50% 50%');
                toRotate.css('-webkit-transform', 'rotate(' + degree + 'deg)');
                toRotate.css('-webkit-transform-origin', '50% 50%');
                toRotate.css('-o-transform', 'rotate(' + degree + 'deg)');
                toRotate.css('-o-transform-origin', '50% 50%');
                toRotate.css('-ms-transform', 'rotate(' + degree + 'deg)');
                toRotate.css('-ms-transform-origin', '50% 50%');
                
            }
        });
    });
}

function animateRotate(id, startAngle, finalAngle, duration)
{
    var $element = $("#" + id);
    $({deg: startAngle}).animate({deg: finalAngle}, {
        duration: duration,
        step: function(now) {
            // in the step-callback (that is fired each step of the animation),
            // you can use the `now` paramter which contains the current
            // animation-position (`0` up to `angle`)
            $element.css({
                transform: 'rotate(' + now + 'deg)'
            });
        }
    });
}

function wait(miliseconds) {
   var currentTime = new Date().getTime();

   while (currentTime + miliseconds >= new Date().getTime()) {
   }
}


function getLeftAndTop(id)
/*
 * input: id of the element
 * output: left and top in the space, calculated based upon rotation angle and boundingrect
 * for instance:
 *       .
 *    .     .
 * .           .        if a square is rotated by 90 degrees like that, this function returns the top vertex coords
 *    .     .
 *       .
 */
{
    var element = document.getElementById(id);
    var rect = element.getBoundingClientRect();
    var width = element.offsetWidth;
    var height = element.offsetHeight;
    var angle = getRotationAngle(id);
    var left = rect.left;
    var right = rect.right;
    var top = rect.top;
    var bottom = rect.bottom;
    
    if(angle < 0 || angle == Math.PI * 3/2)
        return [left, top + Math.abs(Math.sin(angle) * (width))];
    else if(angle < Math.PI /2)
        return [left + Math.abs(Math.sin(angle) * (height)), top];
    else if(angle < Math.PI)
        return [right, top + Math.abs(Math.cos(angle) * (height))];
    else
        return [left + Math.abs(Math.cos(angle) * (width)), bottom];
}

function retrieveTriangularWidthAndHeight()
{
    var triangleHalfBase = parseInt(bodyStyles.getPropertyValue('--triangle-half-base'),10); 
    var triangleHeight = parseInt(bodyStyles.getPropertyValue('--triangle-height'),10);
      
    var toReturn = [triangleHalfBase*2, triangleHeight];
    return toReturn;    
}

function getMiddlePoint(p1, p2)
{
    return [(p1[0] + p2[0])/2, (p1[1] + p2[1])/2];
}


function addToAddedPiecesArray(pieceId, haloIdNumber)
{
    eval(haloAddedPiecesArrayVarName(haloIdNumber) + ".push(" + pieceId + ")");    
    //console.log("haloAddedPiecesArray", eval(haloAddedPiecesArrayVarName(haloIdNumber)));
}

function retrievePieceShape(pieceId)
{
    var triangle = $("#" + pieceId).find("." + triangularPiece).length + $("#" + pieceId).find("." + triangularObstacle).length;
    var square = $("#" + pieceId).find("." + squarePiece).length + $("#" + pieceId).find("." + squareObstacle).length;
    var round = $("#" + pieceId).find("." + roundPiece).length + $("#" + pieceId).find("." + roundObstacle).length;
    
    if(triangle > 0)
        return triangularObstacle;
    else if(square > 0)
        return squareObstacle;
    else
        return roundObstacle;
}

function sameShape(puzzlePieceClass, obstacleClass)
{
    if(puzzlePieceClass.indexOf(roundPiece) >= 0 && obstacleClass.indexOf(roundObstacle) >= 0)
        return true;
    if(puzzlePieceClass.indexOf(triangularPiece) >= 0 && obstacleClass.indexOf(triangularObstacle) >= 0)
        return true;
    if(puzzlePieceClass.indexOf(squarePiece) >= 0 && obstacleClass.indexOf(squareObstacle) >= 0)
        return true;
    return false;
}

function sameContainer(puzzlePieceClass, obstacleClass)
{
    var containerClass;
    for(var i = 0; i <= idHaloCounter; i++)
    {
        containerClass = containerClassStr(i);
        if(puzzlePieceClass.indexOf(containerClass) >= 0 && obstacleClass.indexOf(containerClass) >= 0)
        return true;
    }
    return false;
}

function addAHalo(left, top)
{
    idHaloCounter++;
    createGlobalVariables(idHaloCounter);
    var contentWrapper;
    if(idHaloCounter == 0)
        contentWrapper = document.getElementById(leftContentWrapperId);
    else
        contentWrapper = document.getElementById(rightContentWrapperId);
    var containerWrapperId = "wrapper_" + idHaloCounter;
    var containerId = "container_" + idHaloCounter;
    var mainCircleId = "main_circle_" + idHaloCounter;
    var mainCircleClass = "main_circle main_piece_" + idHaloCounter;
    var containerClass = containerClassStr(idHaloCounter);
    
    
    var containerWrapper = document.createElement("div");
    containerWrapper.id = containerWrapperId;
    contentWrapper.appendChild(containerWrapper);
    
    var container = document.createElement("div");
    container.id = containerId;
    container.className = containerClass;
    
    var mainCircle = document.createElement("div");
    mainCircle.id = mainCircleId;
    mainCircle.className = mainCircleClass;  
    mainCircle.style.zIndex = eval(halozIndexCounterVarName(idHaloCounter));
    eval(halozIndexCounterVarName(idHaloCounter) + " --");
    
    
    containerWrapper.appendChild(container);
    container.appendChild(mainCircle);
    setHaloStyle(container, mainCircle, left, top);
    
    //console.log("idhalocounter",idHaloCounter);    
    
    init(containerId);
    //createGlobalVariables(idHaloCounter);
    
    
    
    addToIdRelationshipArray(containerId, 0);
}

function setHaloStyle(container, mainCircle, leftStart, topStart)
{
    var colourString = eval(retrieveColour(idHaloCounter));
    var borderColourString = eval(retrieveBorderColour(idHaloCounter));
    container.style.position = "absolute";
    
    var left = 300 + idHaloCounter*100;
    var top = 100 + idHaloCounter*50;
    
    if(leftStart !== undefined)
    {
        var contentWrapper;
        if(idHaloCounter == 0)
            contentWrapper = document.getElementById(leftContentWrapperId);
        else
            contentWrapper = document.getElementById(rightContentWrapperId);
        var wrapperWidth = contentWrapper.offsetWidth;
        var wrapperHeight = contentWrapper.offsetHeight;
        left = leftStart*(wrapperWidth - container.offsetWidth);
        top = topStart*(wrapperHeight - container.offsetHeight);
    }
    container.style.left = left.toString().concat("px");
    container.style.top = top.toString().concat("px");
    container.style.width = bodyStyles.getPropertyValue('--main-circle-dim');
    container.style.height = bodyStyles.getPropertyValue('--main-circle-dim'); 
    mainCircle.style.background = colourString; 
    mainCircle.style.borderColor = borderColourString;
}

function createGlobalVariables(idNumber)
{
    // first you define the string that corresponds to the name of the variable
    var containerClass = containerClassStr(idNumber);
    var haloAngleCounter = haloAngleCounterVarName(idNumber);
    var haloPiecesCounter = haloPiecesCounterVarName(idNumber);
    var haloAddedPiecesArray = haloAddedPiecesArrayVarName(idNumber); // DA RIMUOVERE POI
    var haloOperationCounter = haloOperationCounterVarName(idNumber);
    var haloZIndexCounter = halozIndexCounterVarName(idNumber);
    var haloSwordsMap = haloSwordsMapVarName(idNumber);
    
    // then you assign the value
    window[containerClass] = "container_" + idNumber + "_class";
    window[haloAngleCounter] = 0;
    window[haloPiecesCounter] = 0;
    window[haloAddedPiecesArray] = [];
    window[haloOperationCounter] = 0;
    window[haloZIndexCounter] = 1000;
    window[haloSwordsMap] = new Map();
    /*console.log("containerClass", containerClassStr(idNumber),window[containerClass]);
    console.log("haloAngleCounter", haloAngleCounterVarName(idNumber), window[haloAngleCounter]);
    console.log("haloPiecesCounter", haloPiecesCounterVarName(idNumber),window[haloPiecesCounter]);
    console.log("haloAddedPiecesArray",haloAddedPiecesArrayVarName(idNumber), window[haloAddedPiecesArray]);*/
}

function containerClassStr(idNumber){
    return "container" + idNumber + "Class";
}

function haloAngleCounterVarName(idNumber){
    return "halo" + idNumber + "AngleCounter";
}

function haloPiecesCounterVarName(idNumber){
    return "halo" + idNumber + "PiecesCounter";
}

function haloAddedPiecesArrayVarName(idNumber){
    return "halo" + idNumber + "AddedPiecesArray";
}

function haloOperationCounterVarName(idNumber){
    return "halo" + idNumber + "OperationCounter";
}

function halozIndexCounterVarName(idNumber){
    return "halo" + idNumber + "zIndexCounter";
}

function haloSwordsMapVarName(idNumber){
    return "halo" + idNumber + "Swords";
}


function retrieveColour(idNumber){
    return "halo" + idNumber + "Colour";
}

function retrieveBorderColour(idNumber){
    return "halo" + idNumber + "BorderColour";
}

function getHaloIdNumberFromClass(classString){
    var containerClass;
    for(var i = 0; i <= idHaloCounter; i++)
    {
        containerClass = containerClassStr(i);
        if(classString.indexOf(containerClass) >= 0)
            return i;
    }
    return false;
}


function addTextInDiv(div, rightOffset, text1, text2)
{
    var textHolder1 = document.createElement("p");
    var textHolder2 = document.createElement("p");
    
    var topDistance = 0;
    var leftDistance = 0;
    rightOffset = rightOffset + leftDistance;
    
    var divHeight = parseInt(bodyStyles.getPropertyValue('--fitting-rectangle-height'), 10);
    topDistance = divHeight/4;
    
    text1 = padText(text1);
    text2 = padText(text2);
            
    textHolder1.innerHTML = text1;
    textHolder1.className = costClass;
    textHolder1.style.fontSize = "xx-small";
    textHolder1.style.fontFamily = "Arial,Helvetica,sans-serif";
    textHolder1.style.fontWeight = "bolder";
    textHolder1.style.color = "red";
    textHolder1.style.opacity = "1";
    textHolder1.style.position = "absolute";
    textHolder1.style.zIndex = "1000";
    textHolder1.style.top = topDistance.toString().concat("px");
    textHolder1.style.margin = "0px";
    textHolder2.style.left = leftDistance.toString().concat("px");
    div.appendChild(textHolder1);
    
    
    textHolder2.innerHTML = text2;
    textHolder2.className = operationClass;
    textHolder2.style.fontSize = "xx-small";
    textHolder2.style.fontFamily = "Arial,Helvetica,sans-serif";
    textHolder2.style.fontWeight = "bolder";
    textHolder2.style.textAlign = "center";
    textHolder2.style.color = "green";
    textHolder2.style.opacity = "1";
    textHolder2.style.position = "absolute";
    textHolder2.style.zIndex = "1000";
    textHolder2.style.margin = "0px";
    textHolder2.style.top = topDistance.toString().concat("px");
    textHolder2.style.left = rightOffset.toString().concat("px");
    div.appendChild(textHolder2);    
}

function padText(text){
    var length = text.length;

    if(length == 1)
        text = "&nbsp;&nbsp;&nbsp;" + text;
    else if(length == 2)
        text = "&nbsp;&nbsp;" + text;
    else if(length == 3)
        text = "&nbsp;" + text;
    return text;
}

function firstPieceAttached(puzzlePiece)
{
    if(puzzlePiece.parent().parent().hasClass(fittingPieceContainerClass))
        return false;
    else
        return true;
}


function addHilt(haloIdNumber, haloPiecesCounter, angle, rotationOffset, mainCircleCenter, container)
{
    var hiltHeight = "85";
    var hiltWidth = "140";
    var mainCircleRadius = parseInt(bodyStyles.getPropertyValue('--main-circle-radius'),10);
    var mainPieceClass = "main_piece_" + haloIdNumber;
    
    var hilt = document.createElement("img");
    hilt.setAttribute("src", "./img/hiltP".concat(haloIdNumber+1,"-",haloPiecesCounter+1,".png"));
    hilt.setAttribute("height", hiltHeight);
    hilt.setAttribute("width", hiltWidth);
    hilt.style.position = "absolute";
    hilt.style.zIndex = "20000";
    hilt.className = mainPieceClass;
    
    var hiltCoords = [mainCircleCenter[0] - parseInt(hiltWidth)/2 + Math.cos(angle)*(mainCircleRadius - parseInt(hiltHeight)/2 + 6),
        mainCircleCenter[1] - parseInt(hiltHeight)/2  + Math.sin(angle)*(mainCircleRadius - parseInt(hiltHeight)/2 + 6)];
    
    hilt.style.left = hiltCoords[0].toString().concat("px");
    hilt.style.top = hiltCoords[1].toString().concat("px");
    container.appendChild(hilt);
    addRotation(hilt, angle, rotationOffset);
}

function getInputShape(pieceId){
    /*  
     * Returns
     * -1: round shape
     * 0: triangular shape
     * 1: square shape
    */
        
    var toBeChecked = $("#" + pieceId).find("." + fittingRectangleClass);
    if($(toBeChecked[0]).hasClass(roundObstacle))
        return -1;
    else if($(toBeChecked[0]).hasClass(triangularObstacle))
        return 0;
    else
        return 1;
}

function getOutputShape(pieceId){
    /*  
     * Returns
     * -1: round shape
     * 0: triangular shape
     * 1: square shape
    */
   
    var toBeChecked = $("#" + pieceId).find("." + puzzlePiece);
    if($(toBeChecked[0]).hasClass(roundPiece))
        return -1;
    else if($(toBeChecked[0]).hasClass(triangularPiece))
        return 0;
    else
        return 1;
}

function getPieceCost(pieceId){
    var p = $("#" + pieceId).find("." + costClass);
    var cost = p[0].innerHTML.replace(/&nbsp;/g, '');
    return cost;
}

function getPieceOperation(pieceId){
    var p = $("#" + pieceId).find("." + operationClass);
    var operation = p[0].innerHTML.replace(/&nbsp;/g, '');
    return operation;
}

function updateCost(pieceId){
    var cost = parseInt(getPieceCost(pieceId),10);
    cost = cost + 5;
    return cost.toString();
}

function updatePointsCount(op, points){
   
    if(op.indexOf("+") > -1)
        points = points + parseInt(op,10);
    else if(op.indexOf("-") > -1 && op.indexOf("×") == -1 && op.indexOf("x") == -1)
        points = points + parseInt(op,10); // parseInt("-10",10) returns -10
    else if(op.indexOf("x") > -1 || op.indexOf("×") > -1){
        op = op.replace("×", "");
        op = op.replace("x", "");
        op = op.replace("(", "");
        op = op.replace(")", "");
        points = points * parseInt(op,10);
    }
    return points;
    
}

function finalPiece(pieceId){
    var toBeChecked = $("#" + pieceId).find("." + finalPieceContainerClass);
    if(toBeChecked.length > 0)
        return true;
    else
        return false;
}

function removePieceSubstitute(pieceId, haloIdNumber){
    var inputShape = getInputShape(pieceId);
    var outputShape = getOutputShape(pieceId);
    
    if(inputShape == -1)
        inputShape = roundObstacle;
    else if(inputShape == 0)
        inputShape = triangularObstacle;
    else
        inputShape = squareObstacle;
    
    if(outputShape == -1)
        outputShape = roundPiece;
    else if(outputShape == 0)
        outputShape = triangularPiece;
    else
        outputShape = squarePiece;
    
    var wrapperId, wrapper, lookForInputShape, lookForOutputShape;
    if(haloIdNumber == 0)
        wrapperId = leftContentWrapperId;
    else
        wrapperId = rightContentWrapperId;
    wrapper = document.getElementById(wrapperId);
    
    var allPieceContainers = $(wrapper).children("." + fittingPieceContainerClass);
    
    for(var i = 0; i < allPieceContainers.length; i++){
        lookForInputShape = $(allPieceContainers[i]).find("." + inputShape);
        lookForOutputShape = $(allPieceContainers[i]).find("." + outputShape);
        if(lookForInputShape.length > 0 && lookForOutputShape.length > 0){
            $(allPieceContainers[i]).remove();
            return;
        }
    }
}

