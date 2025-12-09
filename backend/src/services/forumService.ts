import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class ForumService {
  // ==================== CATEGORIES ====================
  
  async getCategories() {
    return await prisma.forumCategory.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      include: {
        _count: {
          select: { threads: true }
        }
      }
    });
  }

  async createCategory(data: any) {
    return await prisma.forumCategory.create({
      data
    });
  }

  // ==================== THREADS ====================
  
  async getThreads(filters?: any) {
    const where: any = {};
    
    if (filters?.categoryId) {
      where.categoryId = filters.categoryId;
    }
    if (filters?.authorId) {
      where.authorId = filters.authorId;
    }
    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { content: { contains: filters.search, mode: 'insensitive' } }
      ];
    }
    if (filters?.tags) {
      where.tags = { hasSome: Array.isArray(filters.tags) ? filters.tags : [filters.tags] };
    }
    if (filters?.location) {
      where.location = { contains: filters.location, mode: 'insensitive' };
    }

    const orderBy: any = {};
    if (filters?.sortBy === 'popular') {
      orderBy.viewCount = 'desc';
    } else if (filters?.sortBy === 'likes') {
      orderBy.likeCount = 'desc';
    } else {
      orderBy.createdAt = 'desc';
    }

    return await prisma.forumThread.findMany({
      where,
      orderBy: [
        { isPinned: 'desc' },
        orderBy
      ],
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            role: true
          }
        },
        category: true,
        _count: {
          select: { replies: true, likes: true }
        }
      },
      take: filters?.limit || 20,
      skip: filters?.skip || 0
    });
  }

  async getThreadBySlug(slug: string, userId?: string) {
    // Increment view count
    await prisma.forumThread.update({
      where: { slug },
      data: { viewCount: { increment: 1 } }
    });

    const thread = await prisma.forumThread.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            role: true
          }
        },
        category: true,
        replies: {
          include: {
            author: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true,
                role: true
              }
            },
            _count: {
              select: { likes: true }
            }
          },
          orderBy: [
            { isBestAnswer: 'desc' },
            { createdAt: 'asc' }
          ]
        },
        _count: {
          select: { replies: true, likes: true }
        }
      }
    });

    if (thread && userId) {
      const userLike = await prisma.forumLike.findUnique({
        where: {
          userId_threadId: {
            userId,
            threadId: thread.id
          }
        }
      });
      return { ...thread, userHasLiked: !!userLike };
    }

    return thread;
  }

  async createThread(userId: string, data: any) {
    const slug = this.generateSlug(data.title);
    
    const thread = await prisma.forumThread.create({
      data: {
        ...data,
        slug,
        authorId: userId
      },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            role: true
          }
        },
        category: true
      }
    });

    // Update user reputation
    await this.updateReputation(userId, 'thread_created');

    return thread;
  }

  async updateThread(threadId: string, userId: string, data: any) {
    // Verify ownership
    const thread = await prisma.forumThread.findUnique({
      where: { id: threadId }
    });

    if (!thread || thread.authorId !== userId) {
      throw new Error('Unauthorized');
    }

    return await prisma.forumThread.update({
      where: { id: threadId },
      data
    });
  }

  async deleteThread(threadId: string, userId: string) {
    const thread = await prisma.forumThread.findUnique({
      where: { id: threadId }
    });

    if (!thread || thread.authorId !== userId) {
      throw new Error('Unauthorized');
    }

    return await prisma.forumThread.delete({
      where: { id: threadId }
    });
  }

  // ==================== REPLIES ====================
  
  async createReply(userId: string, data: any) {
    const reply = await prisma.forumReply.create({
      data: {
        ...data,
        authorId: userId
      },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            role: true
          }
        }
      }
    });

    // Update user reputation
    await this.updateReputation(userId, 'reply_posted');

    return reply;
  }

  async markBestAnswer(replyId: string, threadAuthorId: string) {
    // Verify the user is the thread author
    const reply = await prisma.forumReply.findUnique({
      where: { id: replyId },
      include: { thread: true }
    });

    if (!reply || reply.thread.authorId !== threadAuthorId) {
      throw new Error('Unauthorized');
    }

    // Remove previous best answer
    await prisma.forumReply.updateMany({
      where: {
        threadId: reply.threadId,
        isBestAnswer: true
      },
      data: { isBestAnswer: false }
    });

    // Mark new best answer
    const updated = await prisma.forumReply.update({
      where: { id: replyId },
      data: { isBestAnswer: true }
    });

    // Update reply author's reputation
    await this.updateReputation(reply.authorId, 'best_answer');

    return updated;
  }

  // ==================== LIKES ====================
  
  async toggleLike(userId: string, data: { threadId?: string; replyId?: string }) {
    const where: any = { userId };
    if (data.threadId) where.threadId = data.threadId;
    if (data.replyId) where.replyId = data.replyId;

    const existing = await prisma.forumLike.findFirst({ where });

    if (existing) {
      // Unlike
      await prisma.forumLike.delete({ where: { id: existing.id } });
      
      // Decrement count
      if (data.threadId) {
        await prisma.forumThread.update({
          where: { id: data.threadId },
          data: { likeCount: { decrement: 1 } }
        });
      } else if (data.replyId) {
        await prisma.forumReply.update({
          where: { id: data.replyId },
          data: { likeCount: { decrement: 1 } }
        });
      }
      
      return { liked: false };
    } else {
      // Like
      await prisma.forumLike.create({ data: { userId, ...data } });
      
      // Increment count
      if (data.threadId) {
        await prisma.forumThread.update({
          where: { id: data.threadId },
          data: { likeCount: { increment: 1 } }
        });
      } else if (data.replyId) {
        await prisma.forumReply.update({
          where: { id: data.replyId },
          data: { likeCount: { increment: 1 } }
        });
      }
      
      return { liked: true };
    }
  }

  // ==================== MARKETPLACE ====================
  
  async getMarketplaceListings(filters?: any) {
    const where: any = { status: 'AVAILABLE' };
    
    if (filters?.category) {
      where.category = filters.category;
    }
    if (filters?.location) {
      where.location = { contains: filters.location, mode: 'insensitive' };
    }
    if (filters?.minPrice) {
      where.price = { ...where.price, gte: parseFloat(filters.minPrice) };
    }
    if (filters?.maxPrice) {
      where.price = { ...where.price, lte: parseFloat(filters.maxPrice) };
    }
    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } }
      ];
    }

    return await prisma.forumMarketplace.findMany({
      where,
      include: {
        seller: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            phone: true
          }
        },
        _count: {
          select: { reviews: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: filters?.limit || 20,
      skip: filters?.skip || 0
    });
  }

  async createMarketplaceListing(userId: string, data: any) {
    return await prisma.forumMarketplace.create({
      data: {
        ...data,
        sellerId: userId
      }
    });
  }

  async updateMarketplaceListing(listingId: string, userId: string, data: any) {
    const listing = await prisma.forumMarketplace.findUnique({
      where: { id: listingId }
    });

    if (!listing || listing.sellerId !== userId) {
      throw new Error('Unauthorized');
    }

    return await prisma.forumMarketplace.update({
      where: { id: listingId },
      data
    });
  }

  // ==================== KNOWLEDGE ARTICLES ====================
  
  async getKnowledgeArticles(filters?: any) {
    const where: any = { isPublished: true };
    
    if (filters?.category) {
      where.category = filters.category;
    }
    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { content: { contains: filters.search, mode: 'insensitive' } }
      ];
    }

    return await prisma.knowledgeArticle.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            role: true
          }
        }
      },
      orderBy: [
        { isFeatured: 'desc' },
        { publishedAt: 'desc' }
      ],
      take: filters?.limit || 20
    });
  }

  async getArticleBySlug(slug: string) {
    await prisma.knowledgeArticle.update({
      where: { slug },
      data: { viewCount: { increment: 1 } }
    });

    return await prisma.knowledgeArticle.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            role: true
          }
        }
      }
    });
  }

  // ==================== EXPERT SESSIONS ====================
  
  async getExpertSessions(filters?: any) {
    const where: any = {};
    
    if (filters?.upcoming) {
      where.scheduledAt = { gte: new Date() };
      where.status = 'SCHEDULED';
    }

    return await prisma.expertSession.findMany({
      where,
      include: {
        expert: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            role: true
          }
        },
        _count: {
          select: { participants: true }
        }
      },
      orderBy: { scheduledAt: 'asc' }
    });
  }

  async registerForSession(sessionId: string, userId: string) {
    return await prisma.sessionParticipant.create({
      data: {
        sessionId,
        userId,
        status: 'REGISTERED'
      }
    });
  }

  // ==================== REPUTATION ====================
  
  async getUserReputation(userId: string) {
    let reputation = await prisma.userReputation.findUnique({
      where: { userId }
    });

    if (!reputation) {
      reputation = await prisma.userReputation.create({
        data: { userId }
      });
    }

    return reputation;
  }

  private async updateReputation(userId: string, action: string) {
    const points: any = {
      thread_created: 10,
      reply_posted: 5,
      best_answer: 50,
      helpful_vote: 2
    };

    const increment = points[action] || 0;

    await prisma.userReputation.upsert({
      where: { userId },
      create: {
        userId,
        points: increment,
        threadsCreated: action === 'thread_created' ? 1 : 0,
        repliesPosted: action === 'reply_posted' ? 1 : 0,
        bestAnswers: action === 'best_answer' ? 1 : 0
      },
      update: {
        points: { increment },
        threadsCreated: action === 'thread_created' ? { increment: 1 } : undefined,
        repliesPosted: action === 'reply_posted' ? { increment: 1 } : undefined,
        bestAnswers: action === 'best_answer' ? { increment: 1 } : undefined
      }
    });
  }

  // ==================== UTILITIES ====================
  
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      + '-' + Date.now();
  }

  async getForumStats() {
    const [totalThreads, totalReplies, totalUsers, activeToday] = await Promise.all([
      prisma.forumThread.count(),
      prisma.forumReply.count(),
      prisma.user.count(),
      prisma.forumThread.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0))
          }
        }
      })
    ]);

    return {
      totalThreads,
      totalReplies,
      totalUsers,
      activeToday
    };
  }
}

export default new ForumService();
