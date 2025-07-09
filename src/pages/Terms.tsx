import React from 'react';

const Terms: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 mb-4">
                By accessing and using our Shahid VIP subscription service, you accept and agree to be bound by the terms and provision of this agreement.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Service Description</h2>
              <p className="text-gray-700 mb-4">
                We provide premium Shahid VIP subscription accounts with various duration options (3 months, 6 months, 1 year). Our service includes instant delivery of account credentials and 24/7 customer support.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Account Usage</h2>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Accounts are for personal use only</li>
                <li>Do not share account credentials with others</li>
                <li>Do not change account passwords or email addresses</li>
                <li>Report any issues immediately to our support team</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Payment Terms</h2>
              <p className="text-gray-700 mb-4">
                All payments are processed securely through Stripe and PayPal. Prices are displayed in EUR. Payment is required before account delivery.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. No Refund Policy</h2>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-red-800 font-semibold">
                  <strong>IMPORTANT:</strong> All sales are final. We do not offer refunds for any purchases.
                </p>
              </div>
              <p className="text-gray-700 mb-4">
                Due to the digital nature of our products and instant delivery of account credentials, we maintain a strict no-refund policy. By completing your purchase, you acknowledge and agree that:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>All sales are final and non-refundable</li>
                <li>No refunds will be issued for any reason, including but not limited to:
                  <ul className="list-disc pl-6 mt-2">
                    <li>Change of mind</li>
                    <li>Duplicate purchases</li>
                    <li>Account sharing violations</li>
                    <li>Service interruptions from the streaming platform</li>
                  </ul>
                </li>
                <li>We will provide technical support and account replacement only in cases of technical failures on our end</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Account Replacement Policy</h2>
              <p className="text-gray-700 mb-4">
                While we do not offer refunds, we may provide account replacement in the following circumstances:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Account credentials are invalid upon delivery</li>
                <li>Technical issues on our service delivery system</li>
                <li>Account suspension due to provider-side issues (within 24 hours of delivery)</li>
              </ul>
              <p className="text-gray-700 mb-4">
                Replacement requests must be submitted within 24 hours of purchase with proper documentation of the issue.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Prohibited Uses</h2>
              <p className="text-gray-700 mb-4">
                You may not use our service for any illegal or unauthorized purpose. You must not violate any laws in your jurisdiction.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Limitation of Liability</h2>
              <p className="text-gray-700 mb-4">
                We shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Contact Information</h2>
              <p className="text-gray-700 mb-4">
                For questions about these Terms of Service, please contact us:
              </p>
              <ul className="list-none text-gray-700 mb-4">
                <li><strong>Email:</strong> tikmohsh@gmail.com</li>
                <li><strong>Phone:</strong> +353899564106</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Changes to Terms</h2>
              <p className="text-gray-700 mb-4">
                We reserve the right to modify these terms at any time. Updated terms will be posted on this page with a new effective date.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
