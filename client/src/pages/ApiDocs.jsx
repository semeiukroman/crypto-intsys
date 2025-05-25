const ApiDocs = () => (
    <main style={{ padding: '1rem' }}>
      <h1>API & SOAP Documentation</h1>
  
      <h2>REST Endpoints</h2>
      <ul>
        <li>GET /api/prices/:symbol</li>
        <li>GET /api/events?category=PopCulture</li>
        <li>GET /api/impact-analysis/:symbol</li>
      </ul>
  
      <h2>SOAP Method</h2>
      <code>getEventImpact(symbol, category)</code>
    </main>
  );
  
  export default ApiDocs;
  