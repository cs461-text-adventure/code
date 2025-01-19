import AuthMain from "@/components/auth/AuthMain";
import Card from "@/components/auth/card";
import Description from "@/components/auth/description";
import Title from "@/components/auth/title";

export default function VerifyEmail() {
  return (
    <AuthMain>
      <Card>
        <Title>Verify Your Email</Title>
        <Description>
          Please check your inbox for a verification email and click on the link
          to complete the registration process.
        </Description>
      </Card>
    </AuthMain>
  );
}
