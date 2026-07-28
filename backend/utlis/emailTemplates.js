const emailTemplate = ({ role, name, email, password }) => {
  return `
    <div style="background-color: #f4f4f4; padding: 30px; font-family: 'Segoe UI', sans-serif;">
      <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        <div style="background-color: #004080; color: #ffffff; padding: 20px;">
          <h2 style="margin: 0;">Welcome to CPMS</h2>
          <p style="margin: 5px 0 0;">College Placement Management System</p>
        </div>
        
        <div style="padding: 30px;">
          <p style="font-size: 16px;">Hello <strong>${name}</strong>,</p>
 
          <p style="font-size: 15px; line-height: 1.6;">
            We're excited to welcome you onboard as a <strong>${role}</strong> in our College Placement Management System (CPMS).
            This platform helps streamline the placement process and enhances coordination between students, TPOs, and management.
          </p>
 
          <div style="background-color: #f0f4f8; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <h3 style="margin: 0 0 10px;">Your Login Credentials:</h3>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Password:</strong> ${password}</p>
          </div>
 
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://cpms-app-theta.vercel.app/" target="_blank"
               style="background-color: #004080; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">
              Log In to CPMS
            </a>
          </div>
 
          <p style="font-size: 14px; color: #555;">Please change your password after logging in for the first time and keep your credentials safe.</p>
 
          <p style="font-size: 14px;">If you did not request this registration, please contact our support team immediately.</p>
 
          <p style="font-size: 14px; margin-top: 30px;">Best regards,<br>The CPMS Team</p>
        </div>
 
        <div style="background-color: #f0f0f0; text-align: center; padding: 15px; font-size: 12px; color: #777;">
          &copy; ${new Date().getFullYear()} CPMS. All rights reserved.
        </div>
      </div>
    </div>
  `;
};

/**
 * Custom email template matching the user-requested format
 * for generating student login credentials and forcing password changes.
 */
const loginCredentialsTemplate = ({ name, email, password, portalLink }) => {
  return `
    <div style="background-color: #f4f5f7; padding: 40px 10px; font-family: 'Segoe UI', Helvetica, Arial, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border: 1px solid #e1e4e8;">
        <!-- Header Section -->
        <div style="background-color: #1a2a40; color: #ffffff; padding: 30px; text-align: center;">
          <div style="font-size: 20px; font-weight: bold; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 5px;">CPMS</div>
          <div style="font-size: 14px; opacity: 0.8; letter-spacing: 0.5px;">COLLEGE PLACEMENT MANAGEMENT SYSTEM</div>
        </div>
        
        <!-- Content Body -->
        <div style="padding: 40px 30px; color: #333333; line-height: 1.6;">
          <p style="font-size: 16px; margin-top: 0; font-weight: 500;">Dear ${name || 'Student'},</p>
          
          <p style="font-size: 15px; color: #4a4a4a;">
            Your account for the <strong>College Placement Management System (CPMS)</strong> has been successfully generated/reset. You can now log in using the credentials listed below:
          </p>
          
          <!-- Credentials Box -->
          <div style="background-color: #fcfcfd; border: 1px solid #eaeaea; padding: 25px; border-radius: 6px; margin: 30px 0;">
            <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
              <tr>
                <td style="padding: 8px 0; color: #7f8c8d; font-weight: bold; width: 120px;">Portal Link:</td>
                <td style="padding: 8px 0;"><a href="${portalLink}" target="_blank" style="color: #3498db; text-decoration: underline; font-weight: 500;">${portalLink}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #7f8c8d; font-weight: bold;">Username:</td>
                <td style="padding: 8px 0; color: #2c3e50; font-weight: 500;">${email}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #7f8c8d; font-weight: bold;">Password:</td>
                <td style="padding: 8px 0; color: #e74c3c; font-weight: bold; font-family: monospace; font-size: 16px; letter-spacing: 0.5px;">${password}</td>
              </tr>
            </table>
          </div>
          
          <!-- CTA Button -->
          <div style="text-align: center; margin: 35px 0;">
            <a href="${portalLink}" target="_blank"
               style="background-color: #7952b3; color: #ffffff; padding: 14px 30px; border-radius: 5px; text-decoration: none; font-weight: bold; font-size: 15px; display: inline-block; box-shadow: 0 4px 10px rgba(121, 82, 179, 0.25);">
              Log In to Portal
            </a>
          </div>
          
          <p style="font-size: 14px; color: #e74c3c; font-weight: 500; background-color: #fdf2f2; padding: 12px; border-radius: 4px; border-left: 3px solid #e74c3c; margin: 25px 0;">
            ⚠️ You will be prompted to change your password for security purposes when logging in for the first time.
          </p>

          <p style="font-size: 14px; color: #555555; margin-bottom: 30px;">
            If you encounter any issues during login, please contact the Placement Administration.
          </p>
          
          <p style="font-size: 14px; margin-top: 30px; border-top: 1px solid #eeeeee; padding-top: 20px;">
            Best regards,<br>
            <strong>Placement Cell Team</strong><br>
            College Placement Management System
          </p>
        </div>
        
        <!-- Footer Section -->
        <div style="background-color: #f7f9fa; text-align: center; padding: 20px; font-size: 11px; color: #7f8c8d; border-top: 1px solid #ebebeb;">
          &copy; ${new Date().getFullYear()} CPMS. All rights reserved.
        </div>
      </div>
    </div>
  `;
};

// Export the default template as module export, with loginCredentialsTemplate attached to preserve backward compatibility.
emailTemplate.loginCredentialsTemplate = loginCredentialsTemplate;
module.exports = emailTemplate;