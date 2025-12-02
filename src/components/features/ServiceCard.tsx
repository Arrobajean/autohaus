import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import type { ServiceItem } from "@/data/servicesData";

type Props = {
  service: ServiceItem;
  delay?: number;
};

const ServiceCard = ({ service, delay = 0 }: Props) => {
  const Icon = service.icon;
  return (
    <motion.div
      className="glass-card rounded-2xl p-8 hover:shadow-glass-lg transition-all duration-300 h-full group"
      whileHover={{ scale: 1.05, y: -5 }}
      transition={{ duration: 0.2, delay }}
    >
      <div className="mb-6 text-center">
        <motion.div
          className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto group-hover:bg-gray-800 transition-colors duration-300"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
          aria-hidden="true"
        >
          <Icon className="w-8 h-8 text-white" />
        </motion.div>
      </div>
      <h3 className="text-xl font-semibold text-black mb-4 text-center">
        {service.title}
      </h3>
      <p className="text-gray-600 leading-relaxed mb-6">
        {service.description}
      </p>
      <ul className="space-y-2 mb-6">
        {service.features.map((feature, idx) => (
          <li key={idx} className="flex items-start space-x-2">
            <CheckCircle
              className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <span className="text-sm text-gray-600">{feature}</span>
          </li>
        ))}
      </ul>
      <div className="text-center" />
    </motion.div>
  );
};

export default ServiceCard;
