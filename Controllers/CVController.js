const nodemailer = require("nodemailer");

const sendJobApplicationMail = async (req, res) => {
  try {
    const { name, email, phone, message, course, jobTitle, jobId } = req.body;

    // Files uploaded through express-fileupload
    const files = req.files ? Object.values(req.files) : [];

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "casinotrainingnepal@gmail.com",
        pass: "xxtrcizhjdjjbcbs",
      },
    });

    await transporter.sendMail({
      from: email,
      to: "casinotrainingnepal@gmail.com",
      subject: `New Job Application – ${jobTitle}`,
      html: `
        <h2>New Job Application Received</h2>

        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        


<p><strong>Job Title:</strong> ${jobTitle ? jobTitle : "Not Given"}</p>

<p><strong>Job ID:</strong> ${jobId ? jobId : "Not Given"}</p>


        <p><strong>Message:</strong><br>${message}</p>
        


        <p><em>This application was submitted from your website career page.</em></p>
      `,

      // Attach all uploaded files
      attachments: files.map((file) => ({
        filename: file.name,
        path: file.tempFilePath,
      })),
    });

    res.json({
      success: true,
      message: "Job application sent successfully!",
    });
  } catch (error) {
    console.error("Mail Error:", error);
    res.status(500).json({
      success: false,
      message: "Error sending job application email",
    });
  }
};

const sendCV = async (req, res) => {
  try {
    const { name, email, phone, message, course } = req.body;

    // Files uploaded through express-fileupload
    const files = req.files ? Object.values(req.files) : [];

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "casinotrainingnepal@gmail.com",
        pass: "xxtrcizhjdjjbcbs",
      },
    });

    await transporter.sendMail({
      from: email,
      to: "casinotrainingnepal@gmail.com",
      subject: `New CV Recevied`,
      html: `
        <h2>New CV Received</h2>

        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        
     <p><strong>Course:</strong> ${course ? course : "Not Given"}</p>

        <p><strong>Message:</strong><br>${message}</p>
        
        <p><em>This CV was submitted from your website career page.</em></p>
      `,

      // Attach all uploaded files
      attachments: files.map((file) => ({
        filename: file.name,
        path: file.tempFilePath,
      })),
    });

    res.json({
      success: true,
      message: "CV sent successfully!",
    });
  } catch (error) {
    console.error("Mail Error:", error);
    res.status(500).json({
      success: false,
      message: "Error sending job application email",
    });
  }
};

module.exports = { sendJobApplicationMail, sendCV };
