import {
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
  HiOutlineInformationCircle,
  HiOutlineXCircle,
} from 'react-icons/hi';

const variants = {
  success: {
    bg: 'bg-green-900/30',
    border: 'border-green-700/50',
    text: 'text-green-300',
    icon: HiOutlineCheckCircle,
  },
  error: {
    bg: 'bg-red-900/30',
    border: 'border-red-700/50',
    text: 'text-red-300',
    icon: HiOutlineXCircle,
  },
  warning: {
    bg: 'bg-yellow-900/30',
    border: 'border-yellow-700/50',
    text: 'text-yellow-300',
    icon: HiOutlineExclamationCircle,
  },
  info: {
    bg: 'bg-blue-900/30',
    border: 'border-blue-700/50',
    text: 'text-blue-300',
    icon: HiOutlineInformationCircle,
  },
};

/**
 * Message component for displaying alerts/notifications
 * @param {string} variant - 'success' | 'error' | 'warning' | 'info'
 * @param {string} children - Message text
 */
const Message = ({ variant = 'info', children }) => {
  const style = variants[variant] || variants.info;
  const Icon = style.icon;

  return (
    <div
      className={`flex items-center space-x-3 px-4 py-3 rounded-xl border ${style.bg} ${style.border} animate-fade-in`}
      role="alert"
      id="message-alert"
    >
      <Icon className={`w-5 h-5 flex-shrink-0 ${style.text}`} />
      <span className={`text-sm font-medium ${style.text}`}>{children}</span>
    </div>
  );
};

export default Message;
