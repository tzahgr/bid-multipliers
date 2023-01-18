/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npx wrangler dev src/index.js` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npx wrangler publish src/index.js --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
	async fetch(request, env, ctx) {
		const url = new URL(request.url);
		const newUrl = url.search.substring(1);
		const origin = request.headers.get('Origin');

		request = new Request(newUrl, request);
		request.headers.set('Origin', new URL(newUrl).origin);
		
		let response = await fetch(request);

		// Recreate the response so you can modify the headers
		response = new Response(response.body, response);

		// Set CORS headers
		response.headers.set('Access-Control-Allow-Origin', origin);

		// Append to/Add Vary header so browser will cache response correctly
		response.headers.append('Vary', 'Origin');

		return response;
	},
};
