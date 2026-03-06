export class CropGuideService {
  async generateGuide(data: any) {
    // Implementation will be moved from existing service
    throw new Error('Service implementation pending');
  }

  async quickGenerate(cropName: string, region?: string) {
    // Implementation will be moved from existing service
    throw new Error('Service implementation pending');
  }

  async getPopularCrops() {
    return [
      'Rice', 'Wheat', 'Maize', 'Tomato', 'Potato', 'Onion', 'Cotton',
      'Sugarcane', 'Soybean', 'Groundnut', 'Sunflower', 'Mustard'
    ];
  }
}