export async function onRequest(context) {
  const ip = context.request.headers.get('CF-Connecting-IP')
    || context.request.headers.get('X-Forwarded-For')?.split(',')[0].trim()
    || '';
  return Response.json({ ip, source: 'Cloudflare' }, { headers: { 'Access-Control-Allow-Origin': '*' } });
}
