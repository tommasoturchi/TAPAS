<!DOCTYPE html>
<!--
To change this license header, choose License Headers in Project Properties.
To change this template file, choose Tools | Templates
and open the template in the editor.
-->
<html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" type="text/css" href="./style/main.css"/>
        <link rel="stylesheet" type="text/css" href="./style/fit_for_round_pieces.css"/>
        <link rel="stylesheet" type="text/css" href="./style/fit_for_triangular_pieces.css"/>
        <link rel="stylesheet" type="text/css" href="./style/fit_for_square_pieces.css"/>
        <link rel="stylesheet" type="text/css" href="./style/layout.css"/>
        <title>TAPASPlay</title>
    </head>
    
    <body oncontextmenu="return false"> <!--; -->
        
        <script src="./externalLibs/jquery-1.11.3.min.js"></script>
        <script src="./externalLibs/jquery-ui.js"></script>
        <script src="./externalLibs/jquery.event.drag-2.2.js"></script>

        <script type="text/javascript" src="./supportScripts/collision.js"></script>
        <script type="text/javascript" src="./supportScripts/generalUtility.js"></script>
        <script type="text/javascript" src="./supportScripts/attachPieces.js"></script>
        <script type="text/javascript" src="./supportScripts/webSocketDInteraction.js"></script>
        <script type="text/javascript" src="./supportScripts/idRelationshipArraySupport.js"></script>
        <script type="text/javascript" src="./supportScripts/swordMapFunctions.js"></script>
        
        <script type="text/javascript" src="addPuzzlePieces/addRoundPiece.js"></script>
        <script type="text/javascript" src="addPuzzlePieces/addTriangularPiece.js"></script>
        <script type="text/javascript" src="addPuzzlePieces/addSquarePiece.js"></script>
        <script type="text/javascript" src="addPuzzlePieces/addFinalPiece.js"></script>
        <script type="text/javascript" src="addFittingPieces/addRoundFittingPiece.js"></script>
        <script type="text/javascript" src="addFittingPieces/addTriangularFittingPiece.js"></script>
        <script type="text/javascript" src="addFittingPieces/addSquareFittingPiece.js"></script>
        
        
        <div id="outer-wrapper">
            
            <div id="left-content-wrapper" class="wrapper-border">
                <!--div id="player-one-title" class="player-title">Player 1</div-->
            </div>
            <div id="right-content-wrapper" class="wrapper-border">
                <!--div id="player-two-title" class="player-title">Player 2</div-->
            </div>
            
        </div>
        
        <script>
            startInteraction();
            
            var bodyStyles = window.getComputedStyle(document.body);
            var halo0Colour = bodyStyles.getPropertyValue('--halo-0-Colour');
            var halo0BorderColour = bodyStyles.getPropertyValue('--halo-0-Border-Colour');
            var halo1Colour = bodyStyles.getPropertyValue('--halo-1-Colour');
            var halo1BorderColour = bodyStyles.getPropertyValue('--halo-1-Border-Colour');
            /*var halo2Colour = bodyStyles.getPropertyValue('--halo-2-Colour');
            var halo2BorderColour = bodyStyles.getPropertyValue('--halo-2-Border-Colour');
            var halo3Colour = bodyStyles.getPropertyValue('--halo-3-Colour');
            var halo3BorderColour = bodyStyles.getPropertyValue('--halo-3-Border-Colour');
            */
           
            var piecesBackgroundColour = bodyStyles.getPropertyValue('--pieces-background');
            var piecesBorderColour = bodyStyles.getPropertyValue('--pieces-border-colour'); // unused
            
            var mainPiece = "main_piece_";
            var puzzlePiece = "puzzle_piece";
            var endPieceClass = "end_piece";
            var roundPiece = "round_piece";
            var squarePiece = "square_piece";
            var triangularPiece = "triangular_piece";
            var puzzlePieceContainerClass = "piece_container";
            var finalPieceContainerClass = "final_shape_container";
            var outputPart = "output";
            
            var stopRotatingClass = "stop_rotating";
            var attractionOnClass = "attraction_on";
            
            var costClass = "cost";
            var operationClass = "operation";
            
            var fittingRectangleClass = "fitting_rectangle";
            var fittingPieceContainerClass = "fitting_piece_container";
            var fittingPieceClass = "fitting_piece";    
            var roundObstacle = "round_obstacle";
            var squareObstacle = "square_obstacle";
            var triangularObstacle = "triangular_obstacle";
            var stopObstacle = "stop_obstacle";
            
            var operationClass = "operation";
            var operationId = "operation_";
            
            
            var outerWrapperId = "outer-wrapper";
            var leftContentWrapperId = "left-content-wrapper";
            var rightContentWrapperId = "right-content-wrapper";
            
            var idHaloCounter = -1;
            
            var idRelationshipCounter = -1;
            var idRelationship = [];
            
        </script>
    </body>
</html>
