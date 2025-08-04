// src/app/[locale]/cookies/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from 'react';
import Link from 'next/link';

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center text-gray-800">Cookie Policy</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-lg max-w-none text-gray-700">
            <p className="text-sm text-center text-gray-500">Last Updated: August 4, 2024</p>

            <h2 className="font-semibold text-xl text-gray-800 mt-8">1. What Are Cookies?</h2>
            <p>
              Cookies are small text files that are placed on your computer or mobile device when you visit a website. 
              They are widely used to make websites work, or work more efficiently, as well as to provide information to the owners of the site.
            </p>

            <h2 className="font-semibold text-xl text-gray-800 mt-8">2. How We Use Cookies</h2>
            <p>We use cookies for a few essential purposes:</p>
            <ul>
              <li>
                <strong>Essential Cookies:</strong> These cookies are necessary for the website to function and cannot be switched off in our systems. For example, we use a cookie to manage your consent to this cookie policy itself.
              </li>
              <li>
                <strong>Functionality Cookies (Local Storage):</strong> We use your browser's Local Storage, which functions similarly to cookies, to save your URL shortening history on your device for your convenience. This data is not sent to our servers.
              </li>
              <li>
                <strong>Advertising Cookies:</strong> We partner with third-party advertising networks, like Google AdSense, to display advertising on our website. These companies use cookies to collect information about your visits to this and other websites to provide you with relevant advertisements.
              </li>
            </ul>

            <h2 className="font-semibold text-xl text-gray-800 mt-8">3. Google AdSense & DoubleClick DART Cookie</h2>
            <p>
              Google, as a third-party advertisement vendor, uses cookies to serve ads on our Service. The use of DART cookies by Google enables them to serve ads to users based on their visits to our Service and other sites on the Internet. 
              To opt out of the use of DART cookies, you can visit the Google Ad and Content Network privacy policy.
            </p>
            
            <h2 className="font-semibold text-xl text-gray-800 mt-8">4. Your Choices Regarding Cookies</h2>
            <p>
              You have the right to decide whether to accept or reject cookies. You can exercise your cookie preferences by setting or amending your web browser controls. If you choose to reject cookies, you may still use our website though your access to some functionality may be restricted.
              For more information on how to manage and opt out of cookies, you can visit <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">aboutads.info/choices</a> or <a href="https://www.youronlinechoices.com/" target="_blank" rel="noopener noreferrer">youronlinechoices.com</a>.
            </p>
            
            <h2 className="font-semibold text-xl text-gray-800 mt-8">5. Changes to This Policy</h2>
            <p>
              We may update this Cookie Policy from time to time. We will notify you of any changes by posting the new policy on this page.
              For more information about our privacy practices, please review our <Link href="/privacy">Privacy Policy</Link>.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
