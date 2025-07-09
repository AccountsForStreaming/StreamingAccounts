import React from 'react';
import { AlertTriangle, Clock, Shield, Mail, Phone } from 'lucide-react';

const Refund: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Refund Policy</h1>
          
          {/* Important Notice */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <div className="flex items-center mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600 mr-2" />
              <h2 className="text-xl font-bold text-red-800">IMPORTANT: No Refund Policy</h2>
            </div>
            <p className="text-red-800 font-semibold text-lg">
              All sales are final. StreamingAccounts maintains a strict no-refund policy for all purchases.
            </p>
          </div>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. No Refunds Policy</h2>
              <p className="text-gray-700 mb-4">
                Due to the digital nature of our Shahid VIP subscription services and the instant delivery of account credentials, 
                we maintain a strict no-refund policy. By completing your purchase, you acknowledge and agree that:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>All sales are final and non-refundable</li>
                <li>No refunds will be issued under any circumstances</li>
                <li>This policy applies to all products and services offered by StreamingAccounts</li>
                <li>Payment confirmation constitutes acceptance of this no-refund policy</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Reasons We Cannot Offer Refunds</h2>
              <p className="text-gray-700 mb-4">
                No refunds will be issued for any reason, including but not limited to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Change of mind after purchase</li>
                <li>Duplicate or accidental purchases</li>
                <li>Dissatisfaction with the service</li>
                <li>Account sharing violations by the customer</li>
                <li>Service interruptions from Shahid VIP platform</li>
                <li>Regional availability changes</li>
                <li>Device compatibility issues</li>
                <li>Customer's failure to use the account</li>
                <li>Customer's violation of Shahid VIP's terms of service</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Account Replacement Policy</h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-center mb-2">
                  <Shield className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="font-semibold text-blue-800">Limited Account Replacement</span>
                </div>
                <p className="text-blue-800">
                  While we do not offer refunds, we may provide account replacement in specific technical circumstances.
                </p>
              </div>
              
              <p className="text-gray-700 mb-4">
                Account replacement may be considered only in the following limited circumstances:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Account credentials are completely invalid upon delivery (not working at all)</li>
                <li>Technical issues on our service delivery system that prevent account delivery</li>
                <li>Account suspension due to provider-side technical issues within 24 hours of delivery</li>
              </ul>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <div className="flex items-center mb-2">
                  <Clock className="w-5 h-5 text-yellow-600 mr-2" />
                  <span className="font-semibold text-yellow-800">Time Limit for Replacement Requests</span>
                </div>
                <p className="text-yellow-800">
                  Replacement requests must be submitted within 24 hours of purchase with proper documentation of the technical issue.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. What Does NOT Qualify for Replacement</h2>
              <p className="text-gray-700 mb-4">
                The following situations do NOT qualify for account replacement:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Customer sharing account credentials with others</li>
                <li>Customer changing account password or email</li>
                <li>Account working initially but stopped working due to customer actions</li>
                <li>Shahid VIP platform maintenance or temporary service interruptions</li>
                <li>Customer's internet connection or device issues</li>
                <li>Regional restrictions or content availability changes</li>
                <li>Customer dissatisfaction with content library</li>
                <li>Requests made after 24 hours of delivery</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. How to Request Account Replacement</h2>
              <p className="text-gray-700 mb-4">
                If you believe you qualify for account replacement under our limited policy:
              </p>
              <ol className="list-decimal pl-6 text-gray-700 mb-4">
                <li>Contact us within 24 hours of purchase</li>
                <li>Provide your order confirmation number</li>
                <li>Include detailed documentation of the technical issue</li>
                <li>Provide screenshots or evidence of the problem</li>
                <li>Allow our technical team to verify the issue</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Prevention Tips</h2>
              <p className="text-gray-700 mb-4">
                To avoid issues with your purchase:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Double-check your cart before completing payment</li>
                <li>Ensure you understand the subscription duration you're purchasing</li>
                <li>Do not share your account credentials with anyone</li>
                <li>Do not change the account password or email address</li>
                <li>Test your account immediately upon delivery</li>
                <li>Contact support immediately if you encounter any issues</li>
                <li>Read and understand our Terms of Service</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Customer Responsibility</h2>
              <p className="text-gray-700 mb-4">
                By making a purchase, you acknowledge that:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>You have read and understood this refund policy</li>
                <li>You accept that all sales are final</li>
                <li>You understand the digital nature of our products</li>
                <li>You agree to use accounts according to our terms and Shahid VIP's terms</li>
                <li>You will not attempt chargebacks or payment disputes</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Contact Information</h2>
              <p className="text-gray-700 mb-4">
                For questions about this refund policy or to report technical issues:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-blue-600 mr-3" />
                  <div>
                    <p className="font-semibold text-gray-900">Email Support</p>
                    <a href="mailto:tikmohsh@gmail.com" className="text-blue-600 hover:underline">
                      tikmohsh@gmail.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Phone className="w-5 h-5 text-blue-600 mr-3" />
                  <div>
                    <p className="font-semibold text-gray-900">Phone Support</p>
                    <a href="tel:+353899564106" className="text-blue-600 hover:underline">
                      +353899564106
                    </a>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm">
                Available 24/7 for technical support and account replacement requests
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Policy Updates</h2>
              <p className="text-gray-700 mb-4">
                We reserve the right to update this refund policy at any time. Any changes will be posted on this page 
                with an updated effective date. Your continued use of our services after any changes constitutes 
                acceptance of the new policy.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Refund;
