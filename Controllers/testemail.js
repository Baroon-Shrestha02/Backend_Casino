require("dotenv").config();
const { Resend } = require("resend");
const resend = new Resend(process.env.RESEND_API_KEY);

async function testMail() {
  try {
    const r = await resend.emails.send({
      from: "Test <test@resend.dev>",
      to: "casinotrainingnepal@gmail.com",
      subject: "Test Email",
      html: "<h1>Hello World</h1>",
    });
    console.log("Success:", r);
  } catch (e) {
    console.error("Error sending email:", e);
  }
}

testMail();
