const PrivacyPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 min-h-[60vh]">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 gradient-text">Privacy Policy</h1>
      
      <div className="bg-dark-800 p-8 rounded-2xl border border-dark-400/30 text-dark-200 space-y-6">
        <section>
          <h2 className="text-xl font-semibold text-white mb-3">1. Information We Collect</h2>
          <p>We collect information that you provide directly to us when you create an account, make a purchase, subscribe to our newsletter, or contact our customer support. This information may include your name, email address, phone number, shipping address, and payment information.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">2. How We Use Your Information</h2>
          <p>We use the information we collect to provide, maintain, and improve our services, process your transactions, send you technical notices and support messages, and communicate with you about products, services, and offers.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">3. Information Sharing</h2>
          <p>We do not share your personal information with third parties except as described in this privacy policy or with your consent. We may share information with service providers who need access to such information to carry out work on our behalf.</p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPage;
