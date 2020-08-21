const users=[]

//Join user to chat
function userJoin(id,username,room){
    const user ={id,username,room}
users.push(user)
return user
}
//user leaves chat
function userLeave(id){
    const index = users.findIndex(user => user.id === id)

    if(index !== -1){
        return users.splice(index,1)[0]
    }
}

//Get room users
function getRoomUsers(room){
    return users.filter(user => user.room === room)
}


//Get current user
function currentuser(id){
    return users.find(user => user.id === id)
}

module.exports={
    userJoin,
    currentuser,
    userLeave,
    getRoomUsers
}