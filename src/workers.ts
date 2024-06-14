import { porxyWorker } from './proxy/porxyWorker';

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		return porxyWorker(request, env);
	}
};

