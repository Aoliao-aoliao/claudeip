export async function onRequest(context) {
  const url = new URL(context.request.url);
  const ip = url.pathname.replace(/.*\/api\/geoip\//, '').split('/')[0];

  try {
    const r = await fetch(`https://ipwho.is/${ip}`, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      signal: AbortSignal.timeout(8000),
    });
    const d = await r.json();
    if (d.success && d.country) {
      const cn = d.connection || {};
      const res = {
        country: d.country || '',
        region: d.region || '',
        city: d.city || '',
        isp: cn.isp || cn.org || '',
        country_code: (d.country_code || '').toLowerCase(),
        asn: cn.asn ? 'AS' + cn.asn : '',
        asOrganization: cn.isp || cn.org || '',
      };
      return Response.json(res, { headers: { 'Access-Control-Allow-Origin': '*' } });
    }
  } catch {}

  return new Response('{}', { status: 404, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
}
