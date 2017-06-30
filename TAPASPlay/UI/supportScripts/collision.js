function preventCollision(haloIdNumber)
{
    //console.log("eseguo preventcollision");
    var mainCircleRadius = parseInt(bodyStyles.getPropertyValue('--main-circle-radius'),10);
    
    
    var center = findCenter("main_circle_" + haloIdNumber);
    var obstacles = [roundObstacle, squareObstacle, triangularObstacle];
    
    // COLLISIONS BETWEEN THE MAIN CIRCLE AND THE FITTING PIECES
    $("." + obstacles[0] + ", ." + obstacles[1] + ", ." + obstacles[2]).not("." + stopObstacle).each(function()
    {
        var obstacle = $(this);
        var rect = obstacle.get(0).getBoundingClientRect();
        var angle = getRotationAngle(obstacle.parent().attr('id'));
        var width = obstacle.width();
        var height = obstacle.height();
        var trueVertices = computeHVertices(rect, angle, width, height);
        for(var i=0; i<4; i++)
        {
            var distance = computeDistance(trueVertices[i], center);
            if(distance <= mainCircleRadius)
            {
                //console.log("collisione con main piece", trueVertices);
                moveFittingPiece(obstacle.parent().attr('id'), trueVertices[i], haloIdNumber);
                return;
            }
        }
    });
    
    
    // COLLISIONS BETWEEN THE PUZZLE PIECES AND THE FITTING PIECES SHAPED DIFFERENTLY OR
    // BETWEEN PUZZLE PIECES AND FITTING PIECES FROM DIFFERENT CONTAINERS
    $("." + puzzlePiece).each(function()
    {
        var puzzlePiece = $(this);
        var puzzlePieceRect = puzzlePiece.get(0).getBoundingClientRect();
        var puzzlePieceClass = puzzlePiece.attr("class");
        
        $("." + obstacles[0] + ", ." + obstacles[1] + ", ." + obstacles[2]).not("." + stopObstacle).each(function()
        {
            var obstacle = $(this);
            var obstacleClass = obstacle.attr("class");
            if(!sameShape(puzzlePieceClass, obstacleClass) || !sameContainer(puzzlePieceClass, obstacleClass))
            {
                var fittingPieceRect = obstacle.get(0).getBoundingClientRect();
                var fittingPieceAngle = getRotationAngle(obstacle.parent().attr('id'));
                var fittingPieceWidth = obstacle.width();
                var fittingPieceHeight = obstacle.height();
                var fittingPieceTrueVertices = computeHVertices(fittingPieceRect, fittingPieceAngle, fittingPieceWidth, fittingPieceHeight);
                for(var i=0; i<4; i++)
                {
                    if(collisionBtwPuzzlePieceAndFittingPiece(puzzlePieceRect, fittingPieceTrueVertices[i]))
                    {
                        /*console.log("collisione con puzzle piece", fittingPieceTrueVertices);
                        console.log("puzzlepiececlass", puzzlePieceClass);
                        console.log("obstacleclass", obstacleClass);
                        console.log("sameshape?", sameShape(puzzlePieceClass, obstacleClass));
                        console.log("sameContainer?", sameContainer(puzzlePieceClass, obstacleClass));*/
                        moveFittingPiece(obstacle.parent().attr('id'), fittingPieceTrueVertices[i], haloIdNumber);
                    }
                }
            }
        });
    });
}

function preventCollisionBtwFittingPieces(haloIdNumber)
{
    var obstacles = [roundObstacle, squareObstacle, triangularObstacle];
    $("." + obstacles[0] + ", ." + obstacles[1] + ", ." + obstacles[2]).not("." + stopObstacle).each(function()
    {
        var fittingPiece = $(this);
        var fittingPieceRect = fittingPiece.get(0).getBoundingClientRect();
        
        $("." + obstacles[0] + ", ." + obstacles[1] + ", ." + obstacles[2]).not("." + stopObstacle).each(function()
        {
            var obstacle = $(this);
            {
                var obstacleRect = obstacle.get(0).getBoundingClientRect();
                var obstacleAngle = getRotationAngle(obstacle.parent().attr('id'));
                var obstacleWidth = obstacle.width();
                var obstacleHeight = obstacle.height();
                var obstacleTrueVertices = computeHVertices(obstacleRect, obstacleAngle, obstacleWidth, obstacleHeight);
                for(var i=0; i<4; i++)
                {
                    if(collisionBtwPuzzlePieceAndFittingPiece(fittingPieceRect, obstacleTrueVertices[i]))
                    {
                        moveFittingPiece(obstacle.parent().attr('id'), obstacleTrueVertices[i], haloIdNumber);
                        return;
                    }
                }
            }
        });
    });   
}


function computeHVertices(rect, angle, width, height)
/* 
 * INPUT: the bounding rect, the rotation angle, the width and height of the div 
 * OUTPUT: an array containing the four true vertices of the div
*/
{
    var v1, v2, v3, v4;
    if(angle == 0 || angle == Math.PI/2 || angle == Math.PI || angle == Math.PI*3/2 || angle == -Math.PI)
    {
        v1 = [rect.left, rect.top, 'v1'];
        v2 = [rect.left, rect.bottom, 'v2'];
        v3 = [rect.right, rect.bottom, 'v3'];
        v4 = [rect.right, rect.top, 'v4'];
        return [v1, v2, v3, v4];
    }
    var nw = height;
    var sw = width;
    if((-Math.PI/2 < angle && angle < 0) || (Math.PI/2 < angle && angle <Math.PI))
    {
        nw = width;
        sw = height;
        angle = angle + Math.PI/2;
    }
    v1 = [rect.left + nw*Math.abs(Math.sin(angle)), rect.top, 'v1'];
    v2 = [rect.left, rect.top + nw*Math.abs(Math.cos(angle)), 'v2'];
    v3 = [rect.left + sw*Math.abs(Math.cos(angle)), rect.bottom, 'v3'];
    v4 = [rect.right, rect.top + sw*Math.abs(Math.sin(angle)), 'v4'];
    return [v1, v2, v3, v4];
}

function collisionBtwPuzzlePieceAndFittingPiece(puzzleRect, fittingVertex)
{
    if(fittingVertex[0] > puzzleRect.left && fittingVertex[0] < puzzleRect.right && 
            fittingVertex[1] > puzzleRect.top && fittingVertex[1] < puzzleRect.bottom)
        return true;
    else
        return false;
}


function moveFittingPiece(id, v, haloIdNumber) //JQUERY ANIMATE VERSION
{
    var wrapperId;
    if(haloIdNumber == 0)
        wrapperId = leftContentWrapperId;
    else
        wrapperId = rightContentWrapperId;
    if($("#" + id).data("dragging") == true)
        return;
    var element = document.getElementById(id);
    var fittingBoundingRect = element.getBoundingClientRect();
    var wrapBoundingRect = document.getElementById(wrapperId).getBoundingClientRect();
    var whereToMove = movesAllowed(fittingBoundingRect, wrapBoundingRect);
    //console.log('vertice', v);
    if(v[2] == 'v1') // collision with the vertex on the top - if possible, move down
    {
        if(whereToMove[2])
            moveDown(id);
        else if(whereToMove[1])
            moveLeft(id);
        else
            moveRight(id);
        
        return;
        
    }
    if(v[2] == 'v2') // collision withn the vertex on the left - if possible, move right
    {
        if(whereToMove[3])
            moveRight(id);
        else if(whereToMove[0])
            moveUp(id);
        else
            moveDown(id);
        
        return;

    }
    if(v[2] == 'v3') // collision with the vertex on the bottom - if possible, move up
    {
        if(whereToMove[0])
            moveUp(id);
        else if(whereToMove[1])
            moveLeft(id);
        else
            moveRight(id);
        
        return;

    }
    else // collision with the vertex on the right - if possible, move left
    {
        if(whereToMove[1])
            moveLeft(id);
        else if(whereToMove[0])
            moveUp(id);
        else
            moveDown(id);
        
        return;
    }
}


function movesAllowed(fittingBoundingRect, wrapBoundingRect)
/*
 * returns an array of four boolean values that correspond to the possibility
 * of moving respectively upward, leftward, downward, rightward
 */
{
    var moves = [];
    if(fittingBoundingRect.top - 50 > wrapBoundingRect.top)
        moves.push(true);
    else
        moves.push(false);
    if(fittingBoundingRect.left - 50 > wrapBoundingRect.left)
        moves.push(true);
    else
        moves.push(false);
    if(fittingBoundingRect.bottom + 50 < wrapBoundingRect.bottom)
        moves.push(true);
    else
        moves.push(false);
    if(fittingBoundingRect.right + 50 < wrapBoundingRect.right)
        moves.push(true);
    else
        moves.push(false);
    
    return moves; 
}

function moveDown(id)
{
    $("#" + id).stop(true, true).animate({
        top: '+=50px'
    });
    return;
}

function moveRight(id)
{
    $("#" + id).stop(true, true).animate({
        left: '+=50px'
    });
    return;
}

function moveUp(id)
{
    $("#" + id).stop(true, true).animate({
        top: '-=50px'
    });
    return;
}

function moveLeft(id)
{
    $("#" + id).stop(true, true).animate({
        left: '-=50px'
    });
    return;
}
