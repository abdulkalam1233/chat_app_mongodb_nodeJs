// Make connection
var socket = io.connect();

// Query DOM
var message = document.getElementById('message'),
      handle = document.getElementById('handle'),
      btn = document.getElementById('send'),
      output = document.getElementById('output'),
      feedback = document.getElementById('feedback');

// Emit events
btn.addEventListener('click', function(){
    socket.emit('chat', {
        message: message.value,
        handle: handle.value
    });
    message.value = "";
});

message.addEventListener('keypress', function(){
    socket.emit('typing', handle.value);
})

// Listen for events
socket.on('mes', function(data){
    feedback.innerHTML = '';
    console.log(data.from+ ':'+ data.msg)
    output.innerHTML += '<p><strong>' + data.from + ': </strong>' + data.msg + '</p>';
});

