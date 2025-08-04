// src/app/[locale]/tos/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from 'react';
import Link from 'next/link';

export default function TosPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center text-gray-800">Terms of Service</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-lg max-w-none text-gray-700">
            <p className="text-sm text-center text-gray-500">Last Updated: August 4, 2024</p>

            <h2 className="font-semibold text-xl text-gray-800 mt-8">1. Agreement to Terms</h2>
            <p>
              Welcome to urltiny.cc (the "Service"). These Terms of Service ("Terms") are a binding legal agreement between you and urltiny.cc. 
              By accessing or using our Service, you acknowledge that you have read, understood, and agree to be bound by these Terms. 
              If you do not agree with these Terms, you are prohibited from using the Service.
            </p>

            <h2 className="font-semibold text-xl text-gray-800 mt-8">2. Description of Service</h2>
            <p>
              urltiny.cc is a URL shortening service that allows users to shorten long web addresses (URLs). The Service also provides features 
              such as custom aliases and QR code generation for the shortened URLs. For unregistered users, a history of created URLs is stored 
              locally in the user's browser.
            </p>

            <h2 className="font-semibold text-xl text-gray-800 mt-8">3. User Responsibilities and Conduct</h2>
            <p>
              You are solely responsible for the URLs you shorten using our Service. You agree not to use the Service for any of the following purposes:
            </p>
            <ul>
              <li>To shorten URLs that point to any illegal, malicious, or harmful content, including but not limited to malware, phishing scams, or adult content.</li>
              <li>To engage in spamming or any form of unsolicited advertising.</li>
              <li>To violate any applicable local, state, national, or international law.</li>
            </ul>
            <p>
              We reserve the right, at our sole discretion, to deactivate any shortened URL that we believe violates these Terms, without prior notice.
            </p>

            <h2 className="font-semibold text-xl text-gray-800 mt-8">4. Intellectual Property</h2>
            <p>
              The Service and its original content, features, and functionality are and will remain the exclusive property of urltiny.cc and its licensors.
            </p>

            <h2 className="font-semibold text-xl text-gray-800 mt-8">5. Disclaimer of Warranties and Limitation of Liability</h2>
            <p>
              The Service is provided on an "AS IS" and "AS AVAILABLE" basis. urltiny.cc makes no warranty that the Service will be uninterrupted, timely, secure, or error-free. 
              In no event shall urltiny.cc be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, 
              or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
            </p>

            <h2 className="font-semibold text-xl text-gray-800 mt-8">6. Changes to Terms</h2>
            <p>
              We reserve the right to modify or replace these Terms at any time. We will notify users of any changes by posting the new Terms on this page. 
              Your continued use of the Service after any such changes constitutes your acceptance of the new Terms.
            </p>
            
            <h2 className="font-semibold text-xl text-gray-800 mt-8">7. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please <Link href="/privacy">contact us</Link> (Contact method can be added in Privacy Policy).
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
