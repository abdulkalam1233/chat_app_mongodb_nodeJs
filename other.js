

/* message.addEventListener('keypress', function(){
    socket.emit('typing', handle.value);
}) */

// Listen for events

socket.on('chat-hist',(data,messages) => {
  //console.log(data)
  //output.innerHTML=""
  /* if(messages.length>=1){
  messages.forEach(element => {
      output.innerHTML += '<p><strong>' + element.senderId + ': </strong>' + element.text + '</p>';
  })}  */
  handle.innerHTML="";
  handle.innerHTML = data;
 // handle.Value=data;
})

 /* socket.on('chat-hist',(data) => {
      var msgs;
      Message.find({senderId:socket.nickname,receiverId:data},(err,docs) => {
        
        msgs = (docs.sort({time:1}))
        
      });
      Message.find({senderId:data,receiverId:socket.nickname},(err,doc) => {
        
        msgs.concat(doc.sort({time:1}));
        console.log(msgs)
      });
      socket.emit('chat-hist',data,msgs);
    })
 */

