import mjml from 'mjml';
import { Resend } from 'resend';
import { useEnvironment } from '../environment';
import { useLogger } from '../logger';
import { authSchema } from 'drizzle-db';

import resetPasswordTemplate from './reset_password_template.mjml?raw';
import verifyAccountTemplate from './verify_account_template.mjml?raw';

const { logger } = useLogger();
const { serverEnv } = useEnvironment();

export function useAuthEmail() {
  const logoUrl = `${serverEnv!.PUBLIC_BASEURL}/donut.svg`;

  const resend = new Resend(serverEnv!.RESEND_API_KEY);

  return {
    sendVerificationEmail: async (user: authSchema.User, url: string) => {
      logger.info(`Sending verification email to ${user.email}`);
      try {
        const { error } = await resend.emails.send({
          from: `Best Donuts EU <${serverEnv!.SMTP_USER}>`,
          to: user.email,
          subject: 'Please verify your email',
          html: mjml(verifyAccountTemplate)
            .html.replace('{{logo_url}}', logoUrl)
            .replace('{{user_name}}', user.firstName)
            .replace('{{verification_link}}', url)
        });
        if (error) {
          throw new Error(error.message);
        }
        logger.debug(`Verification email sent to ${user.email}`);
      } catch (e) {
        logger.warn(`Failed to send verification email to ${user.email}`, e);
      }
    },
    sendResetPassword: async (user: authSchema.User, url: string) => {
      logger.info(`Sending reset password email to ${user.email}`);
      try {
        const { error } = await resend.emails.send({
          from: `Best Donuts EU <${serverEnv!.SMTP_USER}>`,
          to: user.email,
          subject: 'Reset your password',
          html: mjml(resetPasswordTemplate)
            .html.replace('{{logo_url}}', logoUrl)
            .replace('{{user_name}}', user.firstName)
            .replace('{{reset_link}}', url)
        });
        if (error) {
          throw new Error(error.message);
        }
        logger.debug(`Reset password email sent to ${user.email}`);
      } catch (e) {
        logger.warn(`Failed to send reset password email to ${user.email}`, e);
      }
    }
  };
}
