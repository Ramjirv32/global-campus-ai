const SERP_API_KEY = 'b00f765aac12f9ca8de9e619170acee8a5a298c69c372ea64fa22f6646643667';
const SERP_API_BASE = 'https://serpapi.com/search.json';

export interface SerpSearchResult {
  position: number;
  title: string;
  link: string;
  snippet: string;
  source?: string;
}

export interface SerpOrganicResult {
  position: number;
  title: string;
  link: string;
  snippet: string;
  displayed_link?: string;
}

export const searchWithSerpApi = async (query: string): Promise<SerpOrganicResult[]> => {
  try {
    const params = new URLSearchParams({
      q: query,
      api_key: SERP_API_KEY,
      engine: 'google',
      num: '10',
      hl: 'en',
      gl: 'us'
    });

    const response = await fetch(`${SERP_API_BASE}?${params}`);
    
    if (!response.ok) {
      console.error('SERP API error:', response.status);
      return [];
    }
    
    const data = await response.json();
    
    if (data.error) {
      console.error('SERP API error:', data.error);
      return [];
    }
    
    // Return organic results from Google search
    return data.organic_results || [];
  } catch (error) {
    console.error('Error calling SERP API:', error);
    return [];
  }
};

export const extractUniversitiesFromSerp = (results: SerpOrganicResult[]): Array<{
  name: string;
  website: string;
  description: string;
}> => {
  return results.map(result => {
    // Extract university name from title (remove common suffixes)
    let name = result.title
      .replace(/ - Official.*$/i, '')
      .replace(/ \| Home$/i, '')
      .replace(/ - Home$/i, '')
      .replace(/ Website$/i, '')
      .trim();
    
    return {
      name: name || 'Unknown Institution',
      website: result.link,
      description: result.snippet || ''
    };
  }).filter(uni => uni.website && uni.name !== 'Unknown Institution');
};