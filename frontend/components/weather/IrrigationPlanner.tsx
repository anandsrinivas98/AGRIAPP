'use client';
import { motion } from 'framer-motion';
import { 
  BeakerIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  SparklesIcon
} from '@heroicons/react/24/solid';

interface IrrigationData {
  dailyNeed: string;
  waterAmount: string;
  soilMoisture: number;
  evapotranspiration: number;
  rainfall: number;
  temperature: number;
  humidity: number;
  skipIrrigation: boolean;
  skipReason: string;
  waterSavingTips: string[];
  cropSchedule: {
    crop: string;
    timing: string;
    amount: string;
    method: string;
  }[];
}

interface Props {
  data: IrrigationData;
}

export default function IrrigationPlanner({ data }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl shadow-xl p-8 border-2 border-gray-100"
    >
      <div className="flex items-center space-x-3 mb-6">
        <span className="text-4xl">💧</span>
        <h2 className="text-3xl font-bold text-gray-900">Irrigation Planner</h2>
      </div>

      {/* Skip Irrigation Alert */}
      {data.skipIrrigation ? (
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className="bg-green-50 border-2 border-green-400 rounded-2xl p-6 mb-6"
        >
          <div className="flex items-start space-x-4">
            <CheckCircleIcon className="w-8 h-8 text-green-600 flex-shrink-0" />
            <div>
              <h3 className="text-xl font-bold text-green-900 mb-2">Skip Irrigation Today</h3>
              <p className="text-green-700">{data.skipReason}</p>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className="bg-blue-50 border-2 border-blue-400 rounded-2xl p-6 mb-6"
        >
          <div className="flex items-start space-x-4">
            <BeakerIcon className="w-8 h-8 text-blue-600 flex-shrink-0" />
            <div>
              <h3 className="text-xl font-bold text-blue-900 mb-2">Irrigation Recommended</h3>
              <p className="text-blue-700 mb-3">{data.dailyNeed}</p>
              <div className="flex items-center space-x-4">
                <div className="bg-white rounded-lg px-4 py-2 border border-blue-300">
                  <span className="text-sm text-blue-600 font-semibold">Amount Needed:</span>
                  <span className="text-lg font-bold text-blue-900 ml-2">{data.waterAmount}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Current Conditions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200">
          <div className="text-xs text-blue-600 font-semibold mb-1">Soil Moisture</div>
          <div className="text-2xl font-bold text-blue-900">{Math.round(data.soilMoisture)}%</div>
          <div className="mt-2 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all"
              style={{ width: `${data.soilMoisture}%` }}
            />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-4 border border-orange-200">
          <div className="text-xs text-orange-600 font-semibold mb-1">ET₀ Rate</div>
          <div className="text-2xl font-bold text-orange-900">{data.evapotranspiration.toFixed(1)} mm</div>
          <div className="text-xs text-orange-600 mt-1">Water loss/day</div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
          <div className="text-xs text-purple-600 font-semibold mb-1">Rainfall</div>
          <div className="text-2xl font-bold text-purple-900">{data.rainfall.toFixed(1)} mm</div>
          <div className="text-xs text-purple-600 mt-1">Last 24 hours</div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
          <div className="text-xs text-green-600 font-semibold mb-1">Humidity</div>
          <div className="text-2xl font-bold text-green-900">{Math.round(data.humidity)}%</div>
          <div className="text-xs text-green-600 mt-1">Current level</div>
        </div>
      </div>

      {/* Water-Saving Recommendations */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 mb-6 border-2 border-green-200">
        <div className="flex items-center space-x-2 mb-4">
          <SparklesIcon className="w-6 h-6 text-green-600" />
          <h3 className="text-lg font-bold text-green-900">Water-Saving Tips</h3>
        </div>
        <ul className="space-y-2">
          {data.waterSavingTips.map((tip, index) => (
            <li key={index} className="flex items-start space-x-3 text-sm text-green-800">
              <CheckCircleIcon className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Crop-Wise Irrigation Schedule */}
      <div className="bg-gray-50 rounded-2xl p-6 border-2 border-gray-200">
        <div className="flex items-center space-x-2 mb-4">
          <ClockIcon className="w-6 h-6 text-gray-700" />
          <h3 className="text-lg font-bold text-gray-900">Crop-Wise Schedule</h3>
        </div>
        
        <div className="space-y-3">
          {data.cropSchedule.map((schedule, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              className="bg-white rounded-xl p-4 border border-gray-300 hover:border-blue-400 hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🌾</span>
                  <h4 className="font-bold text-gray-900">{schedule.crop}</h4>
                </div>
                <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold">
                  {schedule.method}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Timing:</span>
                  <span className="ml-2 font-semibold text-gray-900">{schedule.timing}</span>
                </div>
                <div>
                  <span className="text-gray-500">Amount:</span>
                  <span className="ml-2 font-semibold text-gray-900">{schedule.amount}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
          <div className="text-3xl mb-2">💧</div>
          <div className="text-sm text-blue-600 font-semibold mb-1">Daily Water Need</div>
          <div className="text-xl font-bold text-blue-900">{data.waterAmount}</div>
        </div>
        
        <div className="bg-orange-50 rounded-xl p-4 text-center border border-orange-200">
          <div className="text-3xl mb-2">🌡️</div>
          <div className="text-sm text-orange-600 font-semibold mb-1">Temperature</div>
          <div className="text-xl font-bold text-orange-900">{Math.round(data.temperature)}°C</div>
        </div>
        
        <div className="bg-green-50 rounded-xl p-4 text-center border border-green-200">
          <div className="text-3xl mb-2">💨</div>
          <div className="text-sm text-green-600 font-semibold mb-1">ET₀ Loss</div>
          <div className="text-xl font-bold text-green-900">{data.evapotranspiration.toFixed(1)} mm/day</div>
        </div>
      </div>
    </motion.div>
  );
}
