var mongoose = require('mongoose')
    Schema = mongoose.Schema;


var conferenceSchema = new Schema({
  id  : Schema.Types.ObjectId,
  name: String,
  sessions: [{}],
  info: String,
  city: String,
  state: String,
  country: String
});

var conference = mongoose.model('conference', conferenceSchema);

module.exports = {
  Conference: conference
};
