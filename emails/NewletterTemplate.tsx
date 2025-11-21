import * as React from 'react';
import { Html, Text, Link, Section } from '@react-email/components';
import { EmailLayout, h1, text, button } from './Layout';

export const NewsletterEmail = ({ name }: { name: string }) => (
  <Html>
    <EmailLayout previewText="Weekly Digest: IP Tech Trends">
      <Text style={h1}>Weekly Intelligence.</Text>
      <Text style={text}>Hello {name},</Text>
      <Text style={text}>
        We are currently processing a high volume of IDFs through the Donna Neural Engine. 
        Here is what changed in the Indian Patent landscape this week:
      </Text>
      <Section style={{ background: "rgba(255,255,255,0.05)", padding: "20px", borderRadius: "8px", marginBottom: "20px" }}>
        <Text style={{ ...text, color: "#fff", margin: 0 }}>
          • <strong>IPO API Update:</strong> New status codes added for hearings.<br/>
          • <strong>Feature Drop:</strong> You can now export claims to .docx.<br/>
          • <strong>Waitlist Status:</strong> We are opening 5 new spots on Friday.
        </Text>
      </Section>
      <Link href="https://donna-ai.com/login" style={button}>Access Dashboard</Link>
    </EmailLayout>
  </Html>
);