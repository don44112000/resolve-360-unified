import * as fs from 'fs';
import * as path from 'path';

const SQL_RELATIVE_PATH = 'src/modules/posts/helpers/sql';

export class PostsQueryRepository {
  public addPaginationToRawQuery(rawQuery: string, page?: number, limit?: number) {
    if (!page) page = 1;
    let paginateQuery = ' ';
    if (limit) {
      const OFFSET = (page - 1) * limit;
      const LIMIT = limit;
      paginateQuery += ` LIMIT ${LIMIT} OFFSET ${OFFSET}`;
    } else {
      paginateQuery += ` LIMIT 1000 OFFSET 0`;
    }
    return rawQuery + paginateQuery;
  }

  public getAllPostsRawQuery = (): string => {
    return fs
      .readFileSync(
        path.join(process.cwd(), SQL_RELATIVE_PATH) + '/get_all_posts.query.sql',
        'utf8',
      )
      .toString();
  };
}
