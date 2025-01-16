import { Router, Request, Response } from 'express';
import axios from 'axios';
import * as cheerio from 'cheerio';

const router = Router();

/**
 * 解析 TMDB 搜索页面并提取结果
 * @param keyword 搜索关键字
 * @returns 搜索结果数组
 */
async function fetchSearchResults(
  keyword: string
): Promise<{ title: string; url: string; image?: string }[]> {
  const searchUrl = `https://www.themoviedb.org/search?query=${encodeURIComponent(
    keyword
  )}`;
  try {
    const { data: html } = await axios.get(searchUrl);
    const $ = cheerio.load(html);

    const results: {
      id: string;
      title: string;
      url: string;
      image?: string;
    }[] = [];
    $('.card').each((_, element) => {
      const id = $(element).attr('id') || '';
      const title = $(element).find('.title').find('h2').text().trim();
      const relativeUrl = $(element).find('a').attr('href');
      const url = relativeUrl ? `https://www.themoviedb.org${relativeUrl}` : '';
      const image = $(element).find('a').find('img').attr('src') || ''; // Lazy-loaded image src
      if (title && url) {
        results.push({
          id,
          title,
          url,
          image: image.replace('/w94_and_h141_bestv2/', '/original/'),
        });
      }
    });

    return results;
  } catch (error) {
    console.error('Error fetching or parsing TMDB search results:', error);
    return [];
  }
}

/**
 * 搜索接口
 */
router.get('/search', async (req: Request, res: Response) => {
  const keyword = req.query.keyword as string;

  if (!keyword) {
    res.status(400).json({ error: 'Keyword is required' });
    return;
  }

  try {
    const results = await fetchSearchResults(keyword);
    res.json({ keyword, results });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch search results' });
  }
});

export default router;
