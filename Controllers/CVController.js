const { Resend } = require("resend");
const resend = new Resend(process.env.RESEND_API_KEY);
const fs = require("fs");

const sendJobApplicationMail = async (req, res) => {
  try {
    const { name, email, phone, message, jobTitle, jobId, course } = req.body;
    const files = req.files ? Object.values(req.files) : [];

    const resendFiles = files
      .map((file) => {
        if (!file.tempFilePath) return null;
        return {
          filename: file.name,
          content: fs.readFileSync(file.tempFilePath).toString("base64"),
        };
      })
      .filter(Boolean);

    const emailBody = `
      <h2>New Job Application Received</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Job Title:</strong> ${jobTitle || "Not Given"}</p>
      <p><strong>Job ID:</strong> ${jobId || "Not Given"}</p>
      <p><strong>Course:</strong> ${course || "Not Given"}</p>
      <p><strong>Message:</strong><br>${message}</p>
      <p><em>Submitted from your website career page.</em></p>
    `;

    await resend.emails.send({
      from: "Casino Nepal <test@resend.dev>",
      to: "casinotrainingnepal@gmail.com",
      reply_to: email,
      subject: `New Job Application – ${jobTitle || "Not Given"}`,
      html: emailBody,
      attachments: resendFiles.length > 0 ? resendFiles : undefined,
    });

    res.json({ success: true, message: "Job application sent successfully!" });
  } catch (error) {
    console.error("Mail Error:", error);
    res.status(500).json({ success: false, message: "Error sending email" });
  }
};

module.exports = { sendJobApplicationMail };
