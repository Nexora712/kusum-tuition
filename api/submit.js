const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    // Handle OPTIONS method
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { name, email, phone, class: studentClass, message } = req.body;

        // Validate required fields
        if (!name || !email || !phone || !studentClass) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Create email transporter with timeout
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            connectionTimeout: 10000, // 10 seconds timeout
            greetingTimeout: 10000
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
                <p><strong>Message:</strong> ${message || 'No message provided'}</p>
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

        // Send emails with timeout
        const sendEmail = async (mailOptions) => {
            return new Promise((resolve, reject) => {
                const timeout = setTimeout(() => {
                    reject(new Error('Email sending timeout'));
                }, 10000);

                transporter.sendMail(mailOptions, (error, info) => {
                    clearTimeout(timeout);
                    if (error) {
                        reject(error);
                    } else {
                        resolve(info);
                    }
                });
            });
        };

        await Promise.all([
            sendEmail(adminMailOptions),
            sendEmail(studentMailOptions)
        ]);

        res.status(200).json({ success: true, message: 'Emails sent successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ 
            error: 'Failed to process request',
            message: error.message
        });
    }
}; 