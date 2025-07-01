import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD // Replace with your actual email password
  }
});

export const sendPasswordResetEmail = async (to: string, resetLink: string) => {
  const mailOptions = {
    from: 'BookStore',
    to,
    subject: 'Password Reset Request',
    html: `<p>Code to reset your password: ${resetLink}</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Password reset email sent successfully');
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
};
