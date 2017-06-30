function getInterfaceId(serverIdentification){
    for(var i = 0; i < idRelationship.length; i++)
        if(idRelationship[i].serverId == serverIdentification)
            return idRelationship[i].interfaceId;
}

function getServerId(interfaceIdentification){
    for(var i = 0; i < idRelationship.length; i++)
        if(idRelationship[i].interfaceId == interfaceIdentification)
            return idRelationship[i].serverId;
}

function getStackPosition(id){
    for(var i = 0; i < idRelationship.length; i++)
        if(idRelationship[i].interfaceId == id || idRelationship[i].serverId == id)
            return idRelationship[i].stackPosition;
}

function addToIdRelationshipArray(containerId, position)
{
    idRelationshipCounter++;
    var added = {interfaceId: containerId, serverId: idRelationshipCounter, stackPosition: position};
    idRelationship.push(added);
    console.log("idRelationship", idRelationship);
}

function removeFromIdRelationshipArray(toRemoveId)
{
    for(var i = 0; i < idRelationship.length; i++)
    {
        if(idRelationship[i].interfaceId == toRemoveId)
        { 
            idRelationship.splice(i, 1);
            return;
        }
    }
}

function incrementStackPosition(puzzlePiece, fittingPiece)
{
    var id1 = puzzlePiece.parent().attr('id');
    var id2 = fittingPiece.parent().attr('id');
    
    var stackPos;
    for(var i = 0; i < idRelationship.length; i++)
        if(idRelationship[i].interfaceId.toString().localeCompare(id1) == 0)
            stackPos = idRelationship[i].stackPosition;
    
    for(var i = 0; i < idRelationship.length; i++)
        if(idRelationship[i].interfaceId.toString().localeCompare(id2) == 0)
            idRelationship[i].stackPosition = stackPos;    
}

function resetStackPosition(toResetId)
{
    for(var i = 0; i < idRelationship.length; i++)
        if(idRelationship[i].interfaceId.toString().localeCompare(toResetId) == 0)
            idRelationship[i].stackPosition = 0;
}