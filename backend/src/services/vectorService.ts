import { CloudClient, Collection } from 'chromadb';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Initialize ChromaDB Cloud client only if configured
let chromaClient: CloudClient | null = null;

if (process.env.CHROMA_API_KEY && process.env.CHROMA_TENANT && process.env.CHROMA_DATABASE) {
  chromaClient = new CloudClient({
    apiKey: process.env.CHROMA_API_KEY,
    tenant: process.env.CHROMA_TENANT,
    database: process.env.CHROMA_DATABASE
  });
}

interface VectorDocument {
  id: string;
  content: string;
  metadata: {
    type: 'text' | 'image' | 'file';
    timestamp: string;
    userId?: string;
    filename?: string;
    category?: string;
  };
}

class VectorService {
  private collection: Collection | null = null;
  private collectionName = 'agricultural_knowledge';

  /**
   * Initialize vector database collection
   */
  async initialize(): Promise<void> {
    // Check if ChromaDB Cloud is configured
    if (!chromaClient) {
      console.log('ℹ️  ChromaDB Cloud not configured - using fallback RAG system');
      return;
    }

    try {
      // Get or create collection
      this.collection = await chromaClient.getOrCreateCollection({
        name: this.collectionName,
        metadata: { description: 'Agricultural knowledge base with embeddings' }
      });
      
      console.log('✅ Vector database (ChromaDB Cloud) initialized successfully');
      
      // Seed initial knowledge if collection is empty
      const count = await this.collection.count();
      if (count === 0) {
        console.log('📝 Seeding agricultural knowledge base...');
        await this.seedKnowledge();
      } else {
        console.log(`📚 Found ${count} existing documents in knowledge base`);
      }
    } catch (error) {
      console.error('❌ Failed to initialize ChromaDB Cloud:', error);
      console.log('ℹ️  Continuing with fallback RAG system');
      // Continue without vector DB - fallback to basic RAG
    }
  }

  /**
   * Generate embeddings using Gemini
   */
  private async generateEmbeddings(texts: string[]): Promise<number[][]> {
    try {
      const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });
      const embeddings = await Promise.all(
        texts.map(async (text) => {
          const result = await model.embedContent(text);
          return result.embedding.values;
        })
      );
      return embeddings;
    } catch (error) {
      console.error('Error generating embeddings:', error);
      // Return zero vectors as fallback
      return texts.map(() => new Array(768).fill(0));
    }
  }

  /**
   * Seed initial agricultural knowledge
   */
  private async seedKnowledge(): Promise<void> {
    if (!this.collection) return;

    const knowledgeBase = [
      // Crops
      {
        id: 'crop_wheat',
        content: 'Wheat cultivation requires well-drained loamy soil with pH 6.0-7.5. Optimal temperature is 15-25°C. Needs 450-650mm rainfall. Common diseases include rust, smut, and leaf blight. Pests: aphids, armyworms, stem borers.',
        metadata: { type: 'text' as const, category: 'crops', timestamp: new Date().toISOString() }
      },
      {
        id: 'crop_rice',
        content: 'Rice grows best in clay or clay loam soil with pH 5.5-6.5. Requires warm humid climate 20-35°C. High water needs with flooding. Diseases: blast, bacterial blight, sheath blight. Pests: stem borers, leaf folders, brown plant hopper.',
        metadata: { type: 'text' as const, category: 'crops', timestamp: new Date().toISOString() }
      },
      {
        id: 'crop_corn',
        content: 'Corn needs well-drained fertile soil pH 5.8-7.0. Warm season crop 18-32°C. Moderate to high water 500-800mm. Diseases: corn smut, leaf blight, rust. Pests: corn borers, armyworms, rootworms.',
        metadata: { type: 'text' as const, category: 'crops', timestamp: new Date().toISOString() }
      },
      // Diseases
      {
        id: 'disease_leaf_blight',
        content: 'Leaf blight symptoms: brown spots on leaves, yellowing, wilting. Caused by fungal infection, high humidity, poor air circulation. Treatment: remove infected leaves, apply fungicide, improve drainage. Prevention: crop rotation, resistant varieties.',
        metadata: { type: 'text' as const, category: 'diseases', timestamp: new Date().toISOString() }
      },
      {
        id: 'disease_powdery_mildew',
        content: 'Powdery mildew appears as white powdery coating on leaves and stems. Fungal infection from warm days and cool nights. Treatment: sulfur-based fungicides, neem oil spray. Prevention: good air circulation, avoid overhead watering.',
        metadata: { type: 'text' as const, category: 'diseases', timestamp: new Date().toISOString() }
      },
      {
        id: 'disease_root_rot',
        content: 'Root rot symptoms: wilting, yellowing, stunted growth, dark roots. Causes: overwatering, poor drainage, soil-borne pathogens. Treatment: improve drainage, reduce watering, apply fungicide. Prevention: well-draining soil.',
        metadata: { type: 'text' as const, category: 'diseases', timestamp: new Date().toISOString() }
      },
      // Soil nutrients
      {
        id: 'nutrient_nitrogen',
        content: 'Nitrogen promotes leaf growth and green color. Deficiency: yellowing of older leaves, stunted growth. Excess: excessive vegetative growth, delayed maturity. Sources: urea, ammonium nitrate, compost, legumes.',
        metadata: { type: 'text' as const, category: 'soil', timestamp: new Date().toISOString() }
      },
      {
        id: 'nutrient_phosphorus',
        content: 'Phosphorus essential for root development, flowering, fruiting. Deficiency: purple leaves, poor root growth, delayed maturity. Excess: reduced micronutrient availability. Sources: rock phosphate, bone meal, superphosphate.',
        metadata: { type: 'text' as const, category: 'soil', timestamp: new Date().toISOString() }
      },
      {
        id: 'nutrient_potassium',
        content: 'Potassium improves disease resistance, water regulation, fruit quality. Deficiency: brown leaf edges, weak stems, poor fruit. Excess: reduced calcium and magnesium uptake. Sources: potash, wood ash, kelp meal.',
        metadata: { type: 'text' as const, category: 'soil', timestamp: new Date().toISOString() }
      },
      // Pests
      {
        id: 'pest_aphids',
        content: 'Aphids are small soft-bodied insects, green or black. Damage: suck plant sap, transmit viruses, honeydew secretion. Control: neem oil, insecticidal soap, ladybugs, lacewings. Prevention: companion planting, reflective mulches.',
        metadata: { type: 'text' as const, category: 'pests', timestamp: new Date().toISOString() }
      },
      {
        id: 'pest_stem_borers',
        content: 'Stem borers larvae bore into stems causing dead hearts. Damage: wilting, stem breakage, reduced yield. Control: remove and destroy infested plants, pheromone traps. Prevention: early planting, resistant varieties, crop rotation.',
        metadata: { type: 'text' as const, category: 'pests', timestamp: new Date().toISOString() }
      },
      // Weather and irrigation
      {
        id: 'irrigation_practices',
        content: 'Irrigation best practices: water early morning or evening to reduce evaporation. Use drip irrigation for water efficiency. Monitor soil moisture before watering. Adjust frequency based on weather and crop stage. Ensure proper drainage to prevent waterlogging.',
        metadata: { type: 'text' as const, category: 'irrigation', timestamp: new Date().toISOString() }
      },
      {
        id: 'organic_farming',
        content: 'Organic farming uses natural methods: compost for soil fertility, crop rotation to prevent pests, companion planting for pest control, mulching for moisture retention, biological pest control with beneficial insects, green manure for nitrogen.',
        metadata: { type: 'text' as const, category: 'organic', timestamp: new Date().toISOString() }
      }
    ];

    // Add documents to collection with embeddings
    const ids = knowledgeBase.map(doc => doc.id);
    const documents = knowledgeBase.map(doc => doc.content);
    const metadatas = knowledgeBase.map(doc => doc.metadata);
    
    // Generate embeddings for all documents
    console.log('🔄 Generating embeddings...');
    const embeddings = await this.generateEmbeddings(documents);

    await this.collection.add({
      ids,
      documents,
      metadatas,
      embeddings
    });

    console.log(`✅ Seeded ${knowledgeBase.length} knowledge documents`);
  }



  /**
   * Store image vector in database
   */
  async storeImageVector(
    imageId: string,
    imageDescription: string,
    imagePath: string,
    userId?: string
  ): Promise<void> {
    if (!this.collection) return;

    try {
      const embeddings = await this.generateEmbeddings([imageDescription]);
      
      await this.collection.add({
        ids: [imageId],
        documents: [imageDescription],
        embeddings: embeddings,
        metadatas: [{
          type: 'image',
          timestamp: new Date().toISOString(),
          userId: userId || 'anonymous',
          filename: path.basename(imagePath),
          category: 'user_upload'
        }]
      });

      console.log(`✅ Stored image vector: ${imageId}`);
    } catch (error) {
      console.error('Error storing image vector:', error);
    }
  }

  /**
   * Store file vector in database
   */
  async storeFileVector(
    fileId: string,
    fileContent: string,
    filename: string,
    userId?: string
  ): Promise<void> {
    if (!this.collection) return;

    try {
      const embeddings = await this.generateEmbeddings([fileContent]);
      
      await this.collection.add({
        ids: [fileId],
        documents: [fileContent],
        embeddings: embeddings,
        metadatas: [{
          type: 'file',
          timestamp: new Date().toISOString(),
          userId: userId || 'anonymous',
          filename: filename,
          category: 'user_upload'
        }]
      });

      console.log(`✅ Stored file vector: ${fileId}`);
    } catch (error) {
      console.error('Error storing file vector:', error);
    }
  }

  /**
   * Query similar documents from vector database
   */
  async querySimilar(query: string, limit: number = 5): Promise<string[]> {
    if (!this.collection) return [];

    try {
      // Generate embedding for query
      const queryEmbeddings = await this.generateEmbeddings([query]);
      
      const results = await this.collection.query({
        queryEmbeddings: queryEmbeddings,
        nResults: limit
      });

      if (results.documents && results.documents[0]) {
        return results.documents[0].filter((doc): doc is string => doc !== null);
      }

      return [];
    } catch (error) {
      console.error('Error querying similar documents:', error);
      return [];
    }
  }

  /**
   * Get relevant context for query
   */
  async getRelevantContext(query: string): Promise<string> {
    const similarDocs = await this.querySimilar(query, 3);
    
    if (similarDocs.length === 0) {
      return '';
    }

    return `\n\n**Relevant Knowledge from Database:**\n${similarDocs.map((doc, i) => `${i + 1}. ${doc}`).join('\n\n')}`;
  }
}

// Export singleton instance
export const vectorService = new VectorService();
