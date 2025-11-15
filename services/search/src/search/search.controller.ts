import { Controller, Get, Post, Delete, Body, Query, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SearchService } from './search.service';
import { IndexEntityDto } from './dto';

@ApiTags('search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Post('index')
  @ApiOperation({ summary: 'Index entity for search' })
  indexEntity(@Body() data: IndexEntityDto) {
    return this.searchService.indexEntity(data);
  }

  @Get()
  @ApiOperation({ summary: 'Search across all entities' })
  search(
    @Query('q') query: string,
    @Query('type') type?: string,
    @Query('category') category?: string,
    @Query('userId') userId?: string,
  ) {
    return this.searchService.search(query, { entityType: type, category }, userId);
  }

  @Get('popular')
  @ApiOperation({ summary: 'Get popular searches' })
  getPopularSearches(@Query('limit') limit?: number) {
    return this.searchService.getPopularSearches(limit ? parseInt(limit.toString()) : undefined);
  }

  @Delete(':entityType/:entityId')
  @ApiOperation({ summary: 'Delete from search index' })
  deleteIndex(
    @Param('entityType') entityType: string,
    @Param('entityId') entityId: string,
  ) {
    return this.searchService.deleteIndex(entityType, entityId);
  }
}
