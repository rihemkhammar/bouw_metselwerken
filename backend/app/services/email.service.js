import transporter from "../configs/email.config.js";

export const sendClientCredentials = async ({ name, email, password }) => {
  const loginUrl = process.env.FRONTEND_URL + "/login";

  const mailOptions = {
    from: `"Administration" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "✅ Votre demande a été approuvée — Vos identifiants de connexion",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        
        <div style="background-color: #1a1a2e; padding: 24px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 22px;">Bienvenue, ${name} 👋</h1>
        </div>

        <div style="padding: 32px; background-color: #ffffff;">
          <p style="color: #333; font-size: 15px;">
            Votre demande d'accès a été <strong style="color: #22c55e;">approuvée</strong> par l'administrateur.
            Voici vos identifiants pour vous connecter à la plateforme :
          </p>

          <div style="background-color: #f4f4f4; border-left: 4px solid #1a1a2e; padding: 16px; border-radius: 4px; margin: 24px 0;">
            <p style="margin: 0 0 8px 0; font-size: 14px; color: #555;">
              <strong>📧 Email :</strong> ${email}
            </p>
            <p style="margin: 0; font-size: 14px; color: #555;">
              <strong>🔑 Mot de passe :</strong> 
              <span style="font-family: monospace; background: #e8e8e8; padding: 2px 8px; border-radius: 4px; font-size: 15px;">${password}</span>
            </p>
          </div>

          <div style="text-align: center; margin: 32px 0;">
            <a href="${loginUrl}" 
               style="background-color: #1a1a2e; color: #ffffff; padding: 12px 32px; text-decoration: none; border-radius: 6px; font-size: 15px; display: inline-block;">
              Se connecter maintenant
            </a>
          </div>

          <p style="color: #e53e3e; font-size: 13px; border: 1px solid #fed7d7; background: #fff5f5; padding: 12px; border-radius: 4px;">
            ⚠️ <strong>Important :</strong> Pour votre sécurité, veuillez changer votre mot de passe dès votre première connexion.
          </p>
        </div>

        <div style="background-color: #f9f9f9; padding: 16px; text-align: center; border-top: 1px solid #e0e0e0;">
          <p style="color: #999; font-size: 12px; margin: 0;">
            Cet email a été envoyé automatiquement. Ne pas répondre.
          </p>
        </div>

      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};