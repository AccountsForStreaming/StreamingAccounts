import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Mail, Phone, Clock, AlertCircle } from 'lucide-react';

const Help: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      question: "How quickly will I receive my Shahid VIP account?",
      answer: "Account credentials are typically delivered within 5-15 minutes after successful payment confirmation. You'll receive an email with your login details and instructions."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept PayPal, all major credit cards (Visa, Mastercard, American Express), and various digital wallets. All payments are processed securely through Stripe."
    },
    {
      question: "Do you offer refunds?",
      answer: "No, we maintain a strict no-refund policy due to the digital nature of our products. All sales are final. However, we do provide account replacement for technical issues within 24 hours of delivery."
    },
    {
      question: "What if my account doesn't work?",
      answer: "If you experience technical issues with your account, contact us immediately at tikmohsh@gmail.com with your order details. We provide account replacement for verified technical problems within 24 hours of delivery."
    },
    {
      question: "Can I share my account with family or friends?",
      answer: "No, accounts are for personal use only. Sharing credentials may result in account suspension without replacement. Each account is intended for individual use according to Shahid VIP's terms of service."
    },
    {
      question: "How long are the subscriptions valid?",
      answer: "We offer 3 month, 6 month, and 1 year Shahid VIP subscriptions. The duration starts from the activation date and cannot be paused or extended."
    },
    {
      question: "What devices can I use with my Shahid VIP account?",
      answer: "Shahid VIP accounts work on smartphones, tablets, computers, smart TVs, and streaming devices. You can typically use multiple devices but check Shahid VIP's official device limit policy."
    },
    {
      question: "Do you provide customer support?",
      answer: "Yes! We offer 24/7 customer support via email (tikmohsh@gmail.com) and phone (+353899564106). Our team is always ready to assist with any questions or issues."
    },
    {
      question: "Is it safe to purchase from StreamingAccounts?",
      answer: "Absolutely! We use secure payment processing through Stripe and PayPal. We never store your payment information, and all transactions are encrypted and protected."
    },
    {
      question: "What happens if I accidentally purchase the same subscription twice?",
      answer: "Due to our no-refund policy, we cannot process refunds for duplicate purchases. Please double-check your cart before completing payment. If you need assistance, contact our support team."
    },
    {
      question: "Can I change my account password?",
      answer: "No, do not change the account password or email address. This may result in account suspension. Use the account exactly as provided to ensure continued access."
    },
    {
      question: "Do you offer IPTV services?",
      answer: "IPTV services are coming soon! We're expanding our offerings to include live TV channels and bundle deals. Stay tuned for updates on our website."
    }
  ];

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Help Center</h1>
          <p className="text-xl text-gray-600">
            Find answers to common questions about our Shahid VIP services
          </p>
        </div>

        {/* Quick Contact */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <div className="flex items-center mb-4">
            <AlertCircle className="w-6 h-6 text-blue-600 mr-2" />
            <h2 className="text-lg font-semibold text-blue-900">Need Immediate Help?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <Mail className="w-4 h-4 text-blue-600 mr-2" />
              <span className="text-blue-800">
                Email: <a href="mailto:tikmohsh@gmail.com" className="hover:underline">tikmohsh@gmail.com</a>
              </span>
            </div>
            <div className="flex items-center">
              <Phone className="w-4 h-4 text-blue-600 mr-2" />
              <span className="text-blue-800">
                Phone: <a href="tel:+353899564106" className="hover:underline">+353899564106</a>
              </span>
            </div>
            <div className="flex items-center md:col-span-2">
              <Clock className="w-4 h-4 text-blue-600 mr-2" />
              <span className="text-blue-800">Available 24/7 for urgent matters</span>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-lg shadow-lg">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {faqs.map((faq, index) => (
              <div key={index} className="p-6">
                <button
                  onClick={() => toggleFaq(index)}
                  className="flex items-center justify-between w-full text-left"
                >
                  <h3 className="text-lg font-medium text-gray-900 pr-4">
                    {faq.question}
                  </h3>
                  {openFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  )}
                </button>
                
                {openFaq === index && (
                  <div className="mt-4 pr-8">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Additional Help */}
        <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Still Need Help?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="text-center">
              <Mail className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Support</h3>
              <p className="text-gray-600 mb-4">
                Send us a detailed message and we'll respond within 24 hours
              </p>
              <a
                href="mailto:tikmohsh@gmail.com"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-block"
              >
                Send Email
              </a>
            </div>

            <div className="text-center">
              <Phone className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Phone Support</h3>
              <p className="text-gray-600 mb-4">
                Call us directly for urgent matters and immediate assistance
              </p>
              <a
                href="tel:+353899564106"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-block"
              >
                Call Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
