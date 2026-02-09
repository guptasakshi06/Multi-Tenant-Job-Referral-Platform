
const {sendEmail} = require("./mailer");

async function test() {
    await sendEmail({
        to: "test@mailhog.dev",
    subject: "MailHog Test",
    text: "If you see this, email setup is working 🎉",
    });

     console.log("✅ Test email sent");
  process.exit(0);
    
}

test();