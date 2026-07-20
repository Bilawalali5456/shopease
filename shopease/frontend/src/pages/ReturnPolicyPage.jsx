const ReturnPolicyPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 min-h-[60vh]">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 gradient-text">Return & Refund Policy</h1>
      
      <div className="bg-dark-800 p-8 rounded-2xl border border-dark-400/30 text-dark-200 space-y-6">
        <section>
          <h2 className="text-xl font-semibold text-white mb-3">1. Returns</h2>
          <p>You have 30 calendar days to return an item from the date you received it. To be eligible for a return, your item must be unused and in the same condition that you received it. Your item must be in the original packaging.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">2. Refunds</h2>
          <p>Once we receive your item, we will inspect it and notify you that we have received your returned item. We will immediately notify you on the status of your refund after inspecting the item. If your return is approved, we will initiate a refund to your credit card (or original method of payment).</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">3. Shipping Returns</h2>
          <p>You will be responsible for paying for your own shipping costs for returning your item. Shipping costs are non-refundable. If you receive a refund, the cost of return shipping will be deducted from your refund.</p>
        </section>
      </div>
    </div>
  );
};

export default ReturnPolicyPage;
