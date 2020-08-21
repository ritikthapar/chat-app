const express = require('express')
const path = require('path')
const http = require('http')
const socketio=require('socket.io')
const formatMessage = require('./utils/messages')
const {userJoin,currentuser,userLeave,getRoomUsers} = require('./utils/user')

const app = express()
const server= http.createServer(app)
const io = socketio(server)

//Set static folder
app.use(express.static(path.join(__dirname,'public')))

const botName='ChatCord Bot'

//Run when client connect
io.on('connection',socket =>{

    socket.on('joinRoom',({username,room})=>{
        const user = userJoin(socket.id,username,room)

        socket.join(user.room)

         //Welcome current user
    socket.emit('message',formatMessage(botName,'Welcome to ChatCord!'))
    //Broadcast when a user connect
    socket.broadcast.to(user.room).emit('message',formatMessage(botName, user.username+' has join a chat'))

    //Send users and room info
    io.to(user.room).emit('roomUsers',{
        room: user.room,
        users:getRoomUsers(user.room)
    })
    
    })
    
    //listen for chat message
    socket.on('chatMessage',(msg)=>{
        const user = currentuser(socket.id)
        io.to(user.room).emit('message',formatMessage(user.username,msg))
    })

      //Run when a client Disconnect
      socket.on('disconnect',()=>{
          const user=userLeave(socket.id)
          if(user){
            io.to(user.room).emit('message',formatMessage(botName,user.username+' has left the chat'))

            //Send users and room info
    io.to(user.room).emit('roomUsers',{
        room: user.room ,
        users:getRoomUsers(user.room)
    })
          }
        
    })

})

const port=process.env.PORT || 3000

server.listen(port,()=>{
    console.log('server is listen to port:'+port)
})