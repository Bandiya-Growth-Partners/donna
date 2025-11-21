// FILE: emails/NewsletterTemplate.tsx
import * as React from 'react';
import { Html, Text, Link, Section } from '@react-email/components';
import { EmailLayout, h1, text, button } from './Layout';

export const NewsletterEmail = ({ name }: { name: string }) => (
  <Html>
    <EmailLayout previewText="Weekly Digest">
      <Text style={h1}>Weekly Intelligence.</Text>
      <Text style={text}>Hello {name},</Text>
      <Section style={{ background: "rgba(255,255,255,0.05)", padding: "20px", marginBottom: "20px" }}>
        <Text style={{ ...text, color: "#fff", margin: 0 }}>
          System Update: IPO Sync Complete.
        </Text>
      </Section>
      <Link href="https://donna-ai.com" style={button}>Dashboard</Link>
    </EmailLayout>
  </Html>
);