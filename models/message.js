
var mongoose = require('mongoose')
    Schema = mongoose.Schema;


var messageSchema = new Schema({
  id  : Schema.Types.ObjectId,
  sender_id: String,
  receiver_id: String,
  sender_name: String,
  receiver_name: String,
  content: String,
  date: Date,
  read: Boolean
});

var message = mongoose.model('message', messageSchema);

module.exports = {
  Message: message
};
