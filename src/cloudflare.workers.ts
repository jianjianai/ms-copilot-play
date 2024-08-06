import { bingPorxyWorker } from './proxy/bingPorxyWorker';

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		return bingPorxyWorker(request, env);
	}
};

