const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports.send_email = async (artist, user) => {
  const msg = {
    to: user.email.email_address,
    from: 'jeffstjean5@gmail.com',
    subject: `New ${artist.most_recent.type} Release!`,
    html: `New ${artist.most_recent.type} from <a href=${artist.spotify_link}>${artist.name}</a>:
     <a href=${artist.most_recent.spotify_link}>${artist.most_recent.name}</a>
    <img src='${artist.most_recent.image}'></img>`
  };
  try {
    await sgMail.send(msg);
    console.log(`Email sent to ${user.name}`);
  }
  catch(e) {
    console.log(e)
  }

}
