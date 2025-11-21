import {
    Html, Body, Container, Text, Link, Preview, Section, Heading, Hr
  } from "@react-email/components";
  import * as React from "react";
  
  export const WelcomeEmail = ({ name }: { name: string }) => (
    <Html>
      <Preview>Welcome to the Inner Circle of IP Law.</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Logo Area */}
          <Section style={header}>
             <Text style={logoText}>DONNA<span style={{color: '#7C3AED'}}>AI</span></Text>
          </Section>
  
          {/* Hero Content */}
          <Section style={content}>
            <Heading style={h1}>Request Received.</Heading>
            <Text style={text}>
              Hello {name},
            </Text>
            <Text style={text}>
              We have received your application for early access to the <strong>Donna Patent Platform</strong>. 
              Our team is currently reviewing your firm's profile.
            </Text>
            <Text style={text}>
              Because we connect directly with the IPO database, we manually verify every account to ensure security and compliance.
            </Text>
  
            {/* The "Sexy" Button */}
            <Section style={btnContainer}>
              <Link href="https://donna-ai.com" style={button}>
                View Live Status
              </Link>
            </Section>
            
            <Hr style={hr} />
            
            <Text style={footer}>
              Sent from the Donna AI System.<br/>
              Gurgaon, India.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
  
  // --- STYLES (Inline CSS for Email Clients) ---
  const main = {
    backgroundColor: "#000000", // Fallback
    fontFamily: '"Plus Jakarta Sans", sans-serif',
  };
  
  const container = {
    margin: "0 auto",
    padding: "20px 0 48px",
    backgroundColor: "#020205", // Brand Dark
    maxWidth: "560px",
    border: "1px solid #333",
    borderRadius: "12px",
  };
  
  const header = {
    padding: "30px",
    textAlign: "center" as const,
  };
  
  const logoText = {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#ffffff",
    letterSpacing: "-1px",
  };
  
  const content = {
    padding: "0 40px",
  };
  
  const h1 = {
    color: "#ffffff",
    fontSize: "32px",
    fontWeight: "bold",
    textAlign: "center" as const,
    margin: "30px 0",
    padding: "0",
    background: "linear-gradient(to right, #8B5CF6, #06B6D4)", // Liquid Text Fallback
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent", // Note: Some email clients strip this, fallback is white
  };
  
  const text = {
    color: "#94A3B8",
    fontSize: "16px",
    lineHeight: "26px",
  };
  
  const btnContainer = {
    textAlign: "center" as const,
    marginTop: "32px",
  };
  
  const button = {
    backgroundColor: "#7C3AED", // Brand Purple
    borderRadius: "8px",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "bold",
    textDecoration: "none",
    textAlign: "center" as const,
    display: "inline-block",
    padding: "12px 24px",
    boxShadow: "0 4px 12px rgba(124, 58, 237, 0.4)",
  };
  
  const hr = {
    borderColor: "#333",
    margin: "40px 0 20px",
  };
  
  const footer = {
    color: "#666",
    fontSize: "12px",
    textAlign: "center" as const,
  };