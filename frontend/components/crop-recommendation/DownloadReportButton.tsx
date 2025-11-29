'use client';

import { motion } from 'framer-motion';
import { DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface DownloadReportButtonProps {
  recommendations: any[];
  inputData: any;
  soilData: any;
}

export default function DownloadReportButton({ recommendations, inputData, soilData }: DownloadReportButtonProps) {
  const generateReport = () => {
    try {
      // Create report content
      const reportContent = `
CROP RECOMMENDATION REPORT
Generated on: ${new Date().toLocaleDateString()}

===========================================
INPUT DATA
===========================================
Nitrogen (N): ${inputData.N || soilData.N}
Phosphorus (P): ${inputData.P || soilData.P}
Potassium (K): ${inputData.K || soilData.K}
pH Level: ${inputData.pH || soilData.pH}
Temperature: ${inputData.temperature}°C
Humidity: ${inputData.humidity}%
Rainfall: ${inputData.rainfall}mm
Location: ${inputData.location}

===========================================
RECOMMENDED CROPS
===========================================
${recommendations.map((crop, index) => `
${index + 1}. ${crop.crop || crop.name}
   Confidence: ${crop.confidence || crop.probability}%
   Expected Yield: ${crop.yield || 'N/A'}
   Profit Potential: ${crop.profit || 'Medium'}
`).join('\n')}

===========================================
SOIL ANALYSIS
===========================================
NPK Balance: ${((inputData.N + inputData.P + inputData.K) / 3).toFixed(1)}
pH Status: ${inputData.pH < 6 ? 'Acidic' : inputData.pH > 7.5 ? 'Alkaline' : 'Neutral'}

Recommendations:
- Monitor soil nutrient levels regularly
- Maintain optimal pH range (6.0-7.5)
- Apply organic matter to improve soil health
- Consider soil testing every season

===========================================
WEATHER CONSIDERATIONS
===========================================
Temperature: ${inputData.temperature < 20 ? 'Cool' : inputData.temperature > 30 ? 'Hot' : 'Moderate'}
Humidity: ${inputData.humidity < 50 ? 'Low' : inputData.humidity > 80 ? 'High' : 'Moderate'}
Rainfall: ${inputData.rainfall < 100 ? 'Low - Irrigation needed' : inputData.rainfall > 250 ? 'High - Ensure drainage' : 'Adequate'}

===========================================
NEXT STEPS
===========================================
1. Prepare soil according to crop requirements
2. Source quality seeds from certified dealers
3. Plan irrigation schedule based on crop needs
4. Set up pest and disease monitoring system
5. Apply for relevant government subsidies
6. Connect with local markets for selling

===========================================
DISCLAIMER
===========================================
This report is generated based on AI analysis and should be used as a guide.
Please consult with local agricultural experts for specific recommendations.

For more information, visit your nearest agriculture extension office.
      `;

      // Create blob and download
      const blob = new Blob([reportContent], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `crop-recommendation-report-${new Date().getTime()}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('Report downloaded successfully!');
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report');
    }
  };

  return (
    <motion.button
      onClick={generateReport}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
    >
      <DocumentArrowDownIcon className="w-5 h-5" />
      <span>Download Report</span>
    </motion.button>
  );
}
