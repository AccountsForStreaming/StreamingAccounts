import React from 'react';
import { Shield, Clock, Award, Users, Zap, HeartHandshake } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About StreamingAccounts</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your trusted source for premium Shahid VIP subscriptions and digital streaming services. 
            We provide instant access to unlimited Arabic entertainment with verified accounts and reliable service.
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              To make premium Arabic entertainment accessible to everyone by providing reliable, 
              verified Shahid VIP subscriptions with exceptional customer service.
            </p>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Verified Accounts</h3>
            <p className="text-gray-600">
              All accounts are thoroughly tested and verified before delivery to ensure 100% functionality.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <Clock className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Instant Delivery</h3>
            <p className="text-gray-600">
              Get your account credentials within 5-15 minutes after successful payment confirmation.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <Award className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Quality Guarantee</h3>
            <p className="text-gray-600">
              We stand behind our products with account replacement for technical issues within 24 hours.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">24/7 Support</h3>
            <p className="text-gray-600">
              Our dedicated support team is available around the clock to assist with any questions.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <Zap className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure Payments</h3>
            <p className="text-gray-600">
              Multiple payment options including PayPal, credit cards, and digital wallets for your convenience.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <HeartHandshake className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Customer First</h3>
            <p className="text-gray-600">
              Your satisfaction is our priority. We're committed to providing the best streaming experience.
            </p>
          </div>
        </div>

        {/* Our Story */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Our Story</h2>
            <div className="prose prose-lg max-w-none text-gray-600">
              <p className="mb-4">
                StreamingAccounts was founded with a simple vision: to make premium Arabic entertainment 
                accessible to viewers around the world. We recognized the growing demand for reliable 
                Shahid VIP subscriptions and the challenges customers faced with unreliable providers.
              </p>
              <p className="mb-4">
                Our team consists of technology enthusiasts and customer service professionals who are 
                passionate about delivering exceptional streaming experiences. We've built robust systems 
                to ensure instant delivery, account verification, and reliable customer support.
              </p>
              <p>
                Today, we serve thousands of satisfied customers worldwide, providing them with verified 
                Shahid VIP accounts and expanding our services to include upcoming IPTV offerings. 
                We're committed to growing while maintaining our core values of reliability, security, and customer satisfaction.
              </p>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="bg-blue-600 text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Have Questions?</h2>
          <p className="text-lg mb-6">
            Our support team is ready to help you with any questions about our services.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:tikmohsh@gmail.com"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Email Support
            </a>
            <a
              href="tel:+353899564106"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Call Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
