import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { HiOutlineMap, HiOutlineLocationMarker, HiOutlineHashtag, HiOutlineGlobe } from 'react-icons/hi';

const ShippingPage = () => {
  const { shippingAddress, saveShippingAddress } = useCart();
  const navigate = useNavigate();

  const [address, setAddress] = useState(shippingAddress.address || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
  const [country, setCountry] = useState(shippingAddress.country || '');

  const submitHandler = (e) => {
    e.preventDefault();
    saveShippingAddress({ address, city, postalCode, country });
    navigate('/placeorder');
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-12 animate-fade-in" id="shipping-page">
      <div className="glass rounded-2xl p-8 shadow-xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center shadow-lg shadow-primary-900/30">
            <HiOutlineMap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Shipping Details</h1>
          <p className="text-dark-200">Please enter your delivery address</p>
        </div>

        <form onSubmit={submitHandler} className="space-y-5">
          {/* Address */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-dark-100 mb-2">
              Full Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <HiOutlineLocationMarker className="w-5 h-5 text-dark-300" />
              </div>
              <input
                type="text"
                id="address"
                placeholder="123 Main Street, Apt 4B"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                className="w-full pl-11 pr-4 py-3 bg-dark-700/50 border border-dark-400/50 rounded-xl text-white placeholder-dark-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-5">
            {/* City */}
            <div className="flex-1">
              <label htmlFor="city" className="block text-sm font-medium text-dark-100 mb-2">
                City
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-dark-300 font-medium ml-1">🏙️</span>
                </div>
                <input
                  type="text"
                  id="city"
                  placeholder="Lahore"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3 bg-dark-700/50 border border-dark-400/50 rounded-xl text-white placeholder-dark-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Postal Code */}
            <div className="flex-1">
              <label htmlFor="postalCode" className="block text-sm font-medium text-dark-100 mb-2">
                Postal Code
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <HiOutlineHashtag className="w-5 h-5 text-dark-300" />
                </div>
                <input
                  type="text"
                  id="postalCode"
                  placeholder="54000"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3 bg-dark-700/50 border border-dark-400/50 rounded-xl text-white placeholder-dark-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>

          {/* Country */}
          <div>
            <label htmlFor="country" className="block text-sm font-medium text-dark-100 mb-2">
              Country
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <HiOutlineGlobe className="w-5 h-5 text-dark-300" />
              </div>
              <input
                type="text"
                id="country"
                placeholder="Pakistan"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
                className="w-full pl-11 pr-4 py-3 bg-dark-700/50 border border-dark-400/50 rounded-xl text-white placeholder-dark-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 mt-8 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 text-white font-semibold shadow-lg shadow-primary-900/30 transition-all transform hover:scale-[1.02]"
            id="shipping-submit"
          >
            Continue to Place Order
          </button>
        </form>
      </div>
    </div>
  );
};

export default ShippingPage;
