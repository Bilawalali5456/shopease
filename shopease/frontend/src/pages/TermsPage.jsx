const TermsPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 min-h-[60vh]">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 gradient-text">Terms & Conditions</h1>
      
      <div className="bg-dark-800 p-8 rounded-2xl border border-dark-400/30 text-dark-200 space-y-6">
        <section>
          <h2 className="text-xl font-semibold text-white mb-3">1. Agreement to Terms</h2>
          <p>By accessing our website, you agree to be bound by these Terms and Conditions and agree that you are responsible for the agreement with any applicable local laws. If you disagree with any of these terms, you are prohibited from accessing this site.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">2. Use License</h2>
          <p>Permission is granted to temporarily download one copy of the materials on ShopEase's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">3. Disclaimer</h2>
          <p>The materials on ShopEase's website are provided on an 'as is' basis. ShopEase makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
        </section>
      </div>
    </div>
  );
};

export default TermsPage;
