import * as React from "react";
import { Html, Body, Container, Section, Text, Heading, Hr, Link, Preview } from "@react-email/components";

export const EmailLayout = ({ children, previewText }: { children: React.ReactNode, previewText: string }) => (
  <Html>
    <Preview>{previewText}</Preview>
    <Body style={{ backgroundColor: "#000000", fontFamily: '"Plus Jakarta Sans", sans-serif', margin: 0 }}>
      <Container style={{ margin: "0 auto", padding: "40px 20px", maxWidth: "600px" }}>
        {/* Brand Header */}
        <Section style={{ textAlign: "center", marginBottom: "40px" }}>
           <div style={{ fontSize: "24px", fontWeight: "800", color: "#ffffff", letterSpacing: "-1px" }}>
             DONNA<span style={{ color: "#8B5CF6" }}>AI</span>
           </div>
        </Section>
        
        {/* Glass Card Effect for Email */}
        <Section style={{ backgroundColor: "#0A0A0F", border: "1px solid #333", borderRadius: "16px", padding: "40px", boxShadow: "0 4px 20px rgba(0,0,0,0.5)" }}>
          {children}
        </Section>

        <Text style={{ textAlign: "center", color: "#666", fontSize: "12px", marginTop: "40px" }}>
          © 2025 Donna AI Technologies Pvt Ltd.<br/>
          Gurgaon, India • San Francisco, USA
        </Text>
      </Container>
    </Body>
  </Html>
);

// Reusable Styles
export const h1 = { color: "#ffffff", fontSize: "28px", fontWeight: "bold", margin: "0 0 20px", textAlign: "center" as const };
export const text = { color: "#94A3B8", fontSize: "16px", lineHeight: "26px", marginBottom: "20px" };
export const button = { backgroundColor: "#8B5CF6", borderRadius: "8px", color: "#fff", fontSize: "14px", fontWeight: "bold", textDecoration: "none", textAlign: "center" as const, display: "block", width: "100%", padding: "16px 0", marginTop: "20px" };