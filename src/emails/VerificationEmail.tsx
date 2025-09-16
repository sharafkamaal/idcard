// src/emails/VerificationEmail.tsx
import {
  Html,
  Head,
  Font,
  Preview,
  Heading,
  Row,
  Section,
  Text,
  Button,
} from "@react-email/components";

interface VerificationEmailProps {
  username: string;
  otp: string;
}

export default function VerificationEmail({ username, otp }: VerificationEmailProps) {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Verification Code</title>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          webFont={{
            url: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>Here&apos;s your verification code: {otp}</Preview>
      <Section style={{ padding: "20px", fontFamily: "Roboto, Verdana, sans-serif" }}>
        <Row>
          <Heading as="h2">Hello {username},</Heading>
        </Row>
        <Row>
          <Text>
            Thank you for registering. Please use the following verification code:
          </Text>
        </Row>
        <Row>
          <Text style={{ fontSize: "20px", fontWeight: "bold", marginTop: "10px" }}>
            {otp}
          </Text>
        </Row>
        <Row>
          <Text>If you did not request this code, please ignore this email.</Text>
        </Row>
      </Section>
    </Html>
  );
}
