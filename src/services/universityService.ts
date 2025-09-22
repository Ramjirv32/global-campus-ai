const UNIVERSITIES_API_BASE = 'https://universities.hipolabs.com/search';

export interface University {
  name: string;
  country: string;
  website: string;
}

export interface ChatResponse {
  reply: string;
  colleges?: University[];
}

export const searchUniversities = async (query: string): Promise<ChatResponse> => {
  const lowerQuery = query.toLowerCase();
  
  // Check if query is related to colleges/universities
  const collegeKeywords = ['college', 'university', 'universities', 'institute', 'school', 'academy', 'campus'];
  const isCollegeQuery = collegeKeywords.some(keyword => lowerQuery.includes(keyword));
  
  if (!isCollegeQuery) {
    return {
      reply: "Sorry, I can only provide college/university details. Try asking about universities in a specific country or region!"
    };
  }
  
  // Extract country or search term from query
  let searchParams = '';
  
  // Common country patterns
  const countryPatterns = [
    { pattern: /(?:in|from|of)\s+([a-zA-Z\s]+)$/i, group: 1 },
    { pattern: /^([a-zA-Z\s]+)\s+(?:universities|colleges|schools)/i, group: 1 },
    { pattern: /universities\s+(?:in|of)\s+([a-zA-Z\s]+)/i, group: 1 },
    { pattern: /top\s+(?:universities|colleges)\s+(?:in|of)\s+([a-zA-Z\s]+)/i, group: 1 }
  ];
  
  let country = '';
  for (const { pattern, group } of countryPatterns) {
    const match = query.match(pattern);
    if (match && match[group]) {
      country = match[group].trim();
      break;
    }
  }
  
  // If we found a country, search by country
  if (country) {
    searchParams = `?country=${encodeURIComponent(country)}`;
  } else {
    // Otherwise, try to extract a university name
    const nameMatch = query.match(/(?:find|search|show|tell me about)\s+([a-zA-Z\s]+?)(?:\s+university|\s+college)?/i);
    if (nameMatch && nameMatch[1]) {
      searchParams = `?name=${encodeURIComponent(nameMatch[1])}`;
    } else {
      // Default to searching for "university" keyword
      searchParams = '?name=university';
    }
  }
  
  try {
    const response = await fetch(`${UNIVERSITIES_API_BASE}${searchParams}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch universities');
    }
    
    const data = await response.json();
    
    if (!Array.isArray(data) || data.length === 0) {
      return {
        reply: `I couldn't find any universities matching your query. Try asking about universities in a specific country like "universities in Japan" or "top colleges in USA".`
      };
    }
    
    // Limit to first 10 results for better UX
    const universities: University[] = data.slice(0, 10).map((uni: any) => ({
      name: uni.name,
      country: uni.country,
      website: uni.web_pages?.[0] || uni.domains?.[0] ? `http://${uni.domains[0]}` : ''
    }));
    
    const replyPrefix = country 
      ? `Here are some universities in ${country}:`
      : `Here are some universities matching your search:`;
    
    return {
      reply: replyPrefix,
      colleges: universities
    };
  } catch (error) {
    console.error('Error fetching universities:', error);
    return {
      reply: "I'm having trouble fetching university information right now. Please try again later."
    };
  }
};
