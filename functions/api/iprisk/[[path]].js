export async function onRequest(context) {
  const url = new URL(context.request.url);
  const ip = url.pathname.replace(/.*\/api\/iprisk\//, '').split('/')[0];

  try {
    const r = await fetch(`https://api.ipapi.is/?q=${ip}`, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      signal: AbortSignal.timeout(10000),
    });
    const d = await r.json();
    const asn_info = d.asn || {};
    const company = d.company || {};
    const loc = d.location || {};
    const datacenter = d.datacenter || {};
    let score_num = 0;
    try { score_num = parseFloat((company.abuser_score || '0').split(' ')[0]); } catch {}

    const res = {
      ip,
      asn: asn_info.asn || 0,
      asOrganization: asn_info.org || company.name || '',
      country: loc.country || '',
      countryCode: (loc.country_code || '').toLowerCase(),
      region: loc.state || '',
      city: loc.city || '',
      isResidential: !d.is_datacenter,
      isBroadcast: null,
      is_datacenter: d.is_datacenter || false,
      is_vpn: d.is_vpn || false,
      is_proxy: d.is_proxy || false,
      is_tor: d.is_tor || false,
      is_crawler: d.is_crawler || false,
      is_abuser: d.is_abuser || false,
      is_mobile: d.is_mobile || false,
      company_type: company.type || '',
      company_name: company.name || '',
      abuser_score: String(score_num),
      datacenter_name: datacenter.datacenter || asn_info.descr || '',
    };
    return Response.json(res, { headers: { 'Access-Control-Allow-Origin': '*' } });
  } catch {}

  return new Response('{}', { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
}
