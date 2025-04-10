const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { name, email, phone, class: studentClass, message } = req.body;

        // Create email transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // Email to admin
        const adminMailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.ADMIN_EMAIL,
            subject: 'New Enrollment Request',
            html: `
                <h2>New Enrollment Request</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone}</p>
                <p><strong>Class:</strong> ${studentClass}</p>
                <p><strong>Message:</strong> ${message}</p>
            `
        };

        // Email to student
        const studentMailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Thank you for your interest in Kusum Tuition Classes',
            html: `
                <h2>Thank you for your interest!</h2>
                <p>Dear ${name},</p>
                <p>Thank you for your interest in Kusum Tuition Classes. We have received your enrollment request and will contact you shortly.</p>
                <p>Best regards,<br>Kusum Tuition Classes</p>
            `
        };

        // Send emails
        await transporter.sendMail(adminMailOptions);
        await transporter.sendMail(studentMailOptions);

        res.status(200).json({ message: 'Form submitted successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Something went wrong' });
    }
}; 