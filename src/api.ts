import * as mediawiki from 'mediawiki';
mediawiki.Bot();

const FFX_FANDOM_API_URL = 'https://finalfantasyx.fandom.com/fr/api.php';
const FF_FANDOM_API_URL = 'https://finalfantasy.fandom.com/fr/api.php';

// Paramètres de la requête
const DEFAULT_PARAMS: any = {
  action: 'query',
  prop: 'revisions',
  format: 'json',
};

export async function getBestiaryFromFandom(): Promise<String> {
  const params = {
    ...DEFAULT_PARAMS,
    titles: 'Liste_des_ennemis_de_Final_Fantasy_X',
    rvprop: 'content',
  };

  const urlWithParams = FF_FANDOM_API_URL + '?' + new URLSearchParams(params);

  const reponse = await fetch(urlWithParams);
  const { query } = await reponse.json();
  const keys = Object.keys(query.pages);
  return query.pages[keys[0]].revisions[0]['*'];
}

export async function getMonsterFromContent(monsterTitle: string): Promise<String> {
  const { query } = await fetchFandom('revisions', monsterTitle, { rvprop: 'content' });
  const keys = Object.keys(query.pages);
  const firstRev = query.pages[keys[0]].revisions[0];

  try {
    if (firstRev) {
      return firstRev['*'];
    } else {
      const { query } = await fetchFandom('revisions', monsterTitle + '/Final Fantasy X', { rvprop: 'content' });
      const keys = Object.keys(query.pages);
      return query.pages[keys[0]].revisions[0]['*'];
    }
  } catch (e) {
    throw new Error(`No image found for '${monsterTitle}'`);
  }
}

export async function getMonsterImage(monsterTitle: string): Promise<string> {
  const { query } = await fetchFandom('pageimages', monsterTitle, { pithumbsize: 1024 });
  const keys = Object.keys(query.pages);
  const firstThumbnail = query.pages[keys[0]].thumbnail;
  try {
    if (firstThumbnail) {
      return firstThumbnail.source;
    } else {
      const { query } = await fetchFandom('pageimages', monsterTitle + '/Final Fantasy X', { pithumbsize: 1024 });
      const keys = Object.keys(query.pages);
      return query.pages[keys[0]].thumbnail.source;
    }
  } catch (e) {
    throw new Error(`No image found for '${monsterTitle}'`);
  }
}

async function fetchFandom(prop: string, titles: string, additionnalParams: Object): Promise<{ query: any }> {
  const params = {
    ...DEFAULT_PARAMS,
    prop,
    titles,
    ...additionnalParams,
  };

  const urlWithParams = FF_FANDOM_API_URL + '?' + new URLSearchParams(params);
  console.log('urlWithParams ->', urlWithParams);
  const response = await fetch(urlWithParams);
  return response.json();
}
