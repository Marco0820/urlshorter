// src/app/[locale]/privacy/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from 'react';
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center text-gray-800">Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-lg max-w-none text-gray-700">
            <p className="text-sm text-center text-gray-500">Last Updated: August 4, 2024</p>

            <h2 className="font-semibold text-xl text-gray-800 mt-8">1. Introduction</h2>
            <p>
              urltiny.cc ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, 
              and safeguard your information when you use our website urltiny.cc (the "Service"). Please read this policy carefully.
            </p>

            <h2 className="font-semibold text-xl text-gray-800 mt-8">2. Information We Collect</h2>
            <p>We may collect information about you in a variety of ways. The information we may collect on the Service includes:</p>
            <ul>
              <li>
                <strong>URL Data:</strong> We collect the original URLs you submit to our service to be shortened. 
                For unregistered users, we store a history of your shortened URLs locally in your browser's Local Storage. 
                We do not transmit this history to our servers.
              </li>
              <li>
                <strong>Usage Data:</strong> We may automatically collect information when you access and use the Service. 
                This information may include your IP address, browser type, operating system, access times, and the pages you have viewed directly before and after accessing the site.
              </li>
              <li>
                <strong>Tracking & Cookies Data:</strong> We use cookies and similar tracking technologies to track the activity on our Service and hold certain information. 
                For more details, please see our <Link href="/cookies">Cookie Policy</Link>.
              </li>
            </ul>

            <h2 className="font-semibold text-xl text-gray-800 mt-8">3. How We Use Your Information</h2>
            <p>Having accurate information permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Service to:</p>
            <ul>
              <li>Provide, operate, and maintain our Service.</li>
              <li>Generate the shortened URL as requested.</li>
              <li>Improve, personalize, and expand our Service.</li>
              <li>Monitor and analyze usage and trends to improve your experience.</li>
              <li>Protect our Service from misuse, such as preventing spam and fraudulent links.</li>
            </ul>
            
            <h2 className="font-semibold text-xl text-gray-800 mt-8">4. Advertising and Third-Party Cookies</h2>
            <p>
              We use third-party advertising companies, such as Google AdSense, to serve ads when you visit the Service. These companies may use information (not including your name, address, email address, or telephone number) about your visits to this and other websites in order to provide advertisements about goods and services of interest to you.
            </p>
            <ul>
                <li>Google, as a third-party vendor, uses cookies to serve ads on our Service.</li>
                <li>Google's use of the advertising cookie enables it and its partners to serve ads to our users based on their visit to our Service and/or other sites on the Internet.</li>
                <li>Users may opt out of personalized advertising by visiting the <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">Google Ad Settings</a> page.</li>
            </ul>
            
            <h2 className="font-semibold text-xl text-gray-800 mt-8">5. Data Security</h2>
            <p>
              We use administrative, technical, and physical security measures to help protect your information. While we have taken reasonable steps to secure the information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable.
            </p>

            <h2 className="font-semibold text-xl text-gray-800 mt-8">6. Contact Us</h2>
            <p>
              If you have questions or comments about this Privacy Policy, please contact us at: <a href="mailto:support@urltiny.cc">support@urltiny.cc</a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
