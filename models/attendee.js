var mongoose = require('mongoose')
    Schema = mongoose.Schema;


var attendeeSchema = new Schema({
  id  : Schema.Types.ObjectId,
  name: String,
  user_id: String
});

var attendee = mongoose.model('attendee', attendeeSchema);

module.exports = {
  Attendee: attendee
};
