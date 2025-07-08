import { motion } from 'framer-motion';

const Loading = ({ type = 'default' }) => {
  if (type === 'kanban') {
    return (
      <div className="flex gap-6 p-6">
        {[1, 2, 3].map((column) => (
          <div key={column} className="flex-1 bg-white rounded-lg shadow-card p-4">
            <div className="shimmer h-6 w-24 rounded mb-4"></div>
            <div className="space-y-3">
              {[1, 2, 3].map((card) => (
                <div key={card} className="bg-gray-50 rounded-lg p-3">
                  <div className="shimmer h-4 w-full rounded mb-2"></div>
                  <div className="shimmer h-3 w-2/3 rounded mb-3"></div>
                  <div className="flex items-center justify-between">
                    <div className="shimmer h-6 w-6 rounded-full"></div>
                    <div className="shimmer h-5 w-16 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'projects') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div key={item} className="bg-white rounded-lg shadow-card p-6">
            <div className="shimmer h-6 w-3/4 rounded mb-3"></div>
            <div className="shimmer h-4 w-full rounded mb-4"></div>
            <div className="shimmer h-2 w-full rounded mb-4"></div>
            <div className="flex items-center justify-between">
              <div className="avatar-stack">
                <div className="shimmer h-8 w-8 rounded-full"></div>
                <div className="shimmer h-8 w-8 rounded-full"></div>
                <div className="shimmer h-8 w-8 rounded-full"></div>
              </div>
              <div className="shimmer h-5 w-12 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full"
      />
    </div>
  );
};

export default Loading;