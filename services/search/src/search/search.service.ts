import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  async indexEntity(data: {
    entityType: string;
    entityId: string;
    title: string;
    description?: string;
    content: string;
    metadata?: any;
    tags?: string[];
    category?: string;
  }) {
    return this.prisma.searchIndex.upsert({
      where: {
        entityType_entityId: {
          entityType: data.entityType,
          entityId: data.entityId,
        },
      },
      update: {
        title: data.title,
        description: data.description,
        content: data.content,
        metadata: data.metadata || {},
        tags: data.tags || [],
        category: data.category,
      },
      create: {
        ...data,
        metadata: data.metadata || {},
        tags: data.tags || [],
      },
    });
  }

  async search(query: string, filters?: any, userId?: string) {
    const searchTerms = query.toLowerCase().split(' ');
    
    const results = await this.prisma.searchIndex.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { content: { contains: query, mode: 'insensitive' } },
        ],
        ...(filters?.entityType && { entityType: filters.entityType }),
        ...(filters?.category && { category: filters.category }),
        ...(filters?.tags && { tags: { hasSome: filters.tags } }),
      },
      take: 50,
    });

    await this.prisma.searchQuery.create({
      data: {
        userId,
        query,
        filters,
        results: results.length,
      },
    });

    return results;
  }

  async getPopularSearches(limit = 10) {
    const queries = await this.prisma.searchQuery.groupBy({
      by: ['query'],
      _count: { query: true },
      orderBy: { _count: { query: 'desc' } },
      take: limit,
    });

    return queries.map(q => ({ query: q.query, count: q._count.query }));
  }

  async deleteIndex(entityType: string, entityId: string) {
    return this.prisma.searchIndex.delete({
      where: {
        entityType_entityId: {
          entityType,
          entityId,
        },
      },
    });
  }
}
