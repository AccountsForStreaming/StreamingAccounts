import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Zap, Users, Star } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Premium Shahid VIP Subscriptions
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
              Unlock unlimited Arabic entertainment with verified Shahid VIP accounts. 
              Choose from 3 months, 6 months, or 1 year plans with instant delivery.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/products"
                className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center"
              >
                Browse Products
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                to="/register"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors duration-200"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose Shahid VIP Services?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We provide secure, instant access to premium streaming services with unmatched reliability and support.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Instant Delivery</h3>
            <p className="text-gray-600">
              Get your Shahid VIP account details within 24 hours after successful payment. Fast and reliable service.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Verified Accounts</h3>
            <p className="text-gray-600">
              All Shahid VIP accounts are tested and verified before delivery. We guarantee functionality and quality.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
            <p className="text-gray-600">
              Get help whenever you need it. Our support team is here to assist with your Shahid VIP subscription.
            </p>
          </div>
        </div>
      </section>

      {/* Popular Services */}
      <section className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Shahid VIP Subscription Plans
            </h2>
            <p className="text-xl text-gray-600">
              Choose the perfect plan for your Arabic entertainment needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Shahid VIP - 3 Months', logo: '📺', price: '€9.99', duration: '90 days of unlimited access' },
              { name: 'Shahid VIP - 6 Months', logo: '🎬', price: '€18.99', duration: '180 days of unlimited access', popular: true },
              { name: 'Shahid VIP - 1 Year', logo: '⭐', price: '€32.99', duration: '365 days of unlimited access' },
            ].map((service) => (
              <div key={service.name} className={`bg-white p-6 rounded-lg shadow-sm text-center hover:shadow-md transition-shadow duration-200 ${service.popular ? 'ring-2 ring-primary-500 relative' : ''}`}>
                {service.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-semibold">Most Popular</span>
                  </div>
                )}
                <div className="text-4xl mb-3">{service.logo}</div>
                <h3 className="font-semibold mb-2">{service.name}</h3>
                <p className="text-primary-600 font-bold text-2xl mb-2">{service.price}</p>
                <p className="text-gray-600 text-sm">{service.duration}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">More services coming soon: IPTV, Live TV Channels, and Bundle Deals!</p>
            <Link
              to="/products"
              className="btn-primary"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Our Customers Say
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: 'Sarah Johnson',
              rating: 5,
              comment: 'Amazing service! Got my Netflix account instantly and it works perfectly. Great prices too!',
            },
            {
              name: 'Omar Khalil',
              rating: 5,
              comment: 'Been using Shahid VIP Services for months. Never had any issues with my subscription and the support team is fantastic.',
            },
            {
              name: 'Layla Mansour',
              rating: 5,
              comment: 'Best place to get Shahid VIP accounts. Reliable, fast delivery, and great Arabic content selection. Highly recommended!',
            },
          ].map((testimonial, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">"{testimonial.comment}"</p>
              <div className="font-semibold text-gray-900">{testimonial.name}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Start Your Shahid VIP Journey Today
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of satisfied customers enjoying unlimited Arabic entertainment with our verified Shahid VIP accounts.
          </p>
          <Link
            to="/register"
            className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 inline-flex items-center"
          >
            Create Account
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
