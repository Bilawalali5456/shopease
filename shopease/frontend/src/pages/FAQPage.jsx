const FAQPage = () => {
  const faqs = [
    {
      question: "How long does shipping take?",
      answer: "Standard shipping takes 3-5 business days within the continental US. International shipping can take 7-14 business days depending on the destination."
    },
    {
      question: "Do you ship internationally?",
      answer: "Yes, we ship to over 100 countries worldwide. Shipping costs and delivery times vary by location."
    },
    {
      question: "How can I track my order?",
      answer: "Once your order ships, you will receive an email with a tracking number. You can use this number to track your package on our carrier's website."
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day return window for all unused items in their original packaging. Please see our Return Policy page for more details."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 min-h-[60vh]">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 gradient-text">Frequently Asked Questions</h1>
      
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-dark-800 p-6 rounded-2xl border border-dark-400/30">
            <h3 className="text-lg font-semibold text-white mb-2">{faq.question}</h3>
            <p className="text-dark-200">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQPage;
