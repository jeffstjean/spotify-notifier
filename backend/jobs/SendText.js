const twilio = require('twilio');

const texter = new twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);


module.exports.send_text = async (artist, user) => {
  var msg = `New ${artist.most_recent.type} from ${artist.name}: ${artist.most_recent.name}`;
  try {
    await texter.messages.create({
      body: msg,
      to: user.phone.phone_number,
      from: process.env.TWILIO_PHONE
    })
    console.log(`Text sent to ${user.name}`)
  }
  catch(e) {
    console.log(e)
  }
}
