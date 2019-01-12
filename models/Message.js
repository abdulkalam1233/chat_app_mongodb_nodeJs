const mongoose = require('mongoose');
var Message = new mongoose.model('Message',{
  senderId: {
    type :String,
    required : true,
    minlength : 3,
    trim : true

  },
  receiverId: {
    type :String,
    required : true,
    minlength : 3,
    trim : true

  },
  time:{
    type : String,
    required : true,
    default : Date.now
  },
  text:{
    type: String,
    trim : true
  }
}
);

module.exports = {Message};