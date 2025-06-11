import React from "react";

const MethodTag = ({ verb }) => (
  <span
    className="inline-block rounded bg-blue-600 px-2 py-0.5 text-xs font-mono font-semibold uppercase tracking-wide text-white"
  >
    {verb}
  </span>
);

const Endpoint = ({ verb, path, children, auth }) => (
  <div className="space-y-2 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
    <div className="flex items-center space-x-3">
      <MethodTag verb={verb} />
      <code className="text-sm font-medium">{path}</code>
      {auth && <span title="Authentication required">🔒</span>}
    </div>
    {children && <div className="ml-8 text-sm text-gray-700">{children}</div>}
  </div>
);

const ApiDocs = () => (
  <main className="prose max-w-none px-6 py-8 md:px-12 lg:px-24">
    <header className="mb-12 space-y-3">
      <h1 className="text-4xl font-extrabold tracking-tight">CryptoTrends API</h1>
      <p className="text-gray-600">Version 1.0 — June 2025</p>
    </header>

    {/* Quick Start */}
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">Quick Start</h2>
      <pre className="rounded-xl bg-gray-100 p-4 text-sm lg:text-base">
        <code>{`# Obtain a token
curl -X POST https://yourdomain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"alice","password":"secret"}'

# Fetch Bitcoin prices (May 1–10, 2025)
curl https://yourdomain.com/api/prices/BTC?from=2025-05-01&to=2025-05-10`}</code>
      </pre>
    </section>

    {/* Authentication */}
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold">Authentication</h2>

      <Endpoint verb="POST" path="/auth/register">
        <p>Create a new user.</p>
        <ul className="list-disc pl-5">
          <li>
            Body — <code>{`{ "username": "alice", "password": "secret" }`}</code>
          </li>
          <li>Returns a JWT token valid for 24 h.</li>
        </ul>
      </Endpoint>

      <Endpoint verb="POST" path="/auth/login">
        <p>Retrieve a JWT token for an existing user.</p>
      </Endpoint>
    </section>

    {/* Cryptocurrencies */}
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold">Cryptocurrencies</h2>

      <Endpoint verb="GET" path="/cryptos">
        <p>List all supported assets.</p>
        <p>
          Returns <code>[{`{ id, symbol, name }`}, …]</code>
        </p>
      </Endpoint>
    </section>

    {/* Prices */}
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold">Prices</h2>

      <Endpoint verb="POST" path="/prices/refresh" auth>
        <p>Trigger an on‑demand price crawl. 🔒 Admin‑only.</p>
      </Endpoint>

      <Endpoint verb="GET" path="/prices/:symbol">
        <p>
          Historical price series for the given symbol.
          Optional query params: <code>from</code>, <code>to</code>
        </p>
        <p>
          Example:&nbsp;
          <code>/prices/BTC?from=2025-05-01&to=2025-05-10</code>
        </p>
      </Endpoint>
    </section>

    {/* Events */}
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold">Events</h2>

      <Endpoint verb="POST" path="/events/refresh" auth>
        <p>Fetch the latest pop‑culture &amp; economic events. 🔒 Admin‑only.</p>
      </Endpoint>

      <Endpoint verb="GET" path="/events">
        <p>Query events.</p>
        <p className="font-medium">Query Parameters</p>
        <ul className="list-disc pl-5">
          <li>
            <code>category</code> — e.g. <code>Economy</code>
          </li>
          <li>
            <code>symbol</code> — crypto symbol, e.g. <code>ETH</code>
          </li>
          <li><code>from</code> / <code>to</code> — date range</li>
        </ul>
      </Endpoint>
    </section>

    {/* Analysis */}
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold">Impact Analysis</h2>

      <Endpoint verb="GET" path="/analysis/event/:id">
        <p>
          Calculate price impact around a single event.
          Optional <code>interval</code> (hours, default 24).
        </p>
        <p>
          Returns <code>{`{ series, avgBefore, avgAfter, delta }`}</code>
          where <code>delta</code> is the % change.
        </p>
      </Endpoint>

      <Endpoint verb="GET" path="/analysis/category">
        <p>
          Aggregate impact for an entire category.
          Required <code>category</code>; optional <code>interval</code>.
        </p>
        <p>
          Returns <code>{`{ avgDelta, events: [...] }`}</code>
        </p>
      </Endpoint>
    </section>

    <footer className="mt-16 text-center text-sm text-gray-400">
      Updated June 10, 2025
    </footer>
  </main>
);

export default ApiDocs;
