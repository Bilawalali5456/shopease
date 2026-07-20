const ShippingPolicyPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 min-h-[60vh]">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 gradient-text">Shipping Policy</h1>
      
      <div className="bg-dark-800 p-8 rounded-2xl border border-dark-400/30 text-dark-200 space-y-6">
        <section>
          <h2 className="text-xl font-semibold text-white mb-3">1. Order Processing Time</h2>
          <p>All orders are processed within 1-3 business days. Orders are not shipped or delivered on weekends or holidays. If we are experiencing a high volume of orders, shipments may be delayed by a few days.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">2. Shipping Rates & Delivery Estimates</h2>
          <p>Shipping charges for your order will be calculated and displayed at checkout.</p>
          <ul className="list-disc pl-5 mt-2 space-y-2">
            <li>Standard Shipping (3-5 business days)</li>
            <li>Expedited Shipping (2-3 business days)</li>
            <li>Overnight Shipping (1-2 business days)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">3. Shipment Confirmation & Order Tracking</h2>
          <p>You will receive a Shipment Confirmation email once your order has shipped containing your tracking number(s). The tracking number will be active within 24 hours.</p>
        </section>
      </div>
    </div>
  );
};

export default ShippingPolicyPage;
