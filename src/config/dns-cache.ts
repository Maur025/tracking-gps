import http from 'http';
import https from 'https';
import CacheableLookup from 'cacheable-lookup';

const cacheableLookup = new CacheableLookup();
let isInstalled = false;

export const installCache = (): void => {
	if (isInstalled) {
		return;
	}

	cacheableLookup.install(http.globalAgent);
	cacheableLookup.install(https.globalAgent);
	isInstalled = true;
};

export const getAgentByUrl = (url: string): http.Agent | https.Agent => {
	const parsedUrl = new URL(url);

	return parsedUrl.protocol === 'https:' ? https.globalAgent : http.globalAgent;
};
