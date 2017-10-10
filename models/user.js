
var mongoose = require('mongoose')
    Schema = mongoose.Schema;


var userSchema = new Schema({
  id  : Schema.Types.ObjectId,
  name: String,
  dob: Date,
  email: String,
  phone_number: Number,
  username: String,
  password: String,
  messages: [{}]
});

var user = mongoose.model('user', userSchema);

module.exports = {
  User: user
};
