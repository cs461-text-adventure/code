import { Resend } from "resend";
import "dotenv/config";

const resend = new Resend(process.env.RESEND_API_KEY);
const from = process.env.RESEND_EMAIL || "delivered@resend.dev";

export async function sendEmail({
  to,
  subject,
  text,
}: {
  to: string;
  subject: string;
  text: string;
}) {
  const res = await resend.emails.send({
    from,
    to,
    subject,
    html: text,
  });
  console.log(res);
}
