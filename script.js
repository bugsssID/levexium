// Crypto Market Table Logic
async function fetchMarketData() {
  const status = document.getElementById("marketStatus");
  status.textContent = "Loading market data...";
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false"
    );
    const data = await res.json();
    status.textContent = "";
    return data;
  } catch (e) {
    status.textContent = "Failed to load market data.";
    return [];
  }
}

function renderTable(data) {
  const tbody = document.getElementById("marketBody");
  tbody.innerHTML = "";
  data.forEach((coin, idx) => {
    const row = document.createElement("tr");
    row.className = idx % 2 === 0 ? "bg-gray-900" : "bg-gray-800";
    row.innerHTML = `
      <td class="py-2 px-4">${idx + 1}</td>
      <td class="py-2 px-4 flex items-center gap-2">
        <img src="${coin.image}" alt="${
      coin.name
    }" class="w-6 h-6 rounded-full" />
        ${coin.name}
      </td>
      <td class="py-2 px-4 uppercase">${coin.symbol}</td>
      <td class="py-2 px-4 text-right">$${coin.current_price.toLocaleString()}</td>
      <td class="py-2 px-4 text-right ${
        coin.price_change_percentage_24h >= 0
          ? "text-green-400"
          : "text-red-400"
      }">
        ${
          coin.price_change_percentage_24h
            ? coin.price_change_percentage_24h.toFixed(2)
            : "0.00"
        }%
      </td>
      <td class="py-2 px-4 text-right">$${coin.market_cap.toLocaleString()}</td>
    `;
    tbody.appendChild(row);
  });
}

let allMarketData = [];
fetchMarketData().then((data) => {
  allMarketData = data;
  renderTable(data);
});

document.getElementById("searchInput").addEventListener("input", function (e) {
  const val = e.target.value.toLowerCase();
  const filtered = allMarketData.filter(
    (coin) =>
      coin.name.toLowerCase().includes(val) ||
      coin.symbol.toLowerCase().includes(val)
  );
  renderTable(filtered);
});

// Airdrop Table Logic (Realtime from API)
async function fetchAirdropData() {
  const status = document.getElementById("airdropStatus");
  if (status) status.textContent = "Loading airdrop data...";
  try {
    // Ganti URL API berikut dengan endpoint API airdrop yang valid
    const res = await fetch("https://api.llama.fi/airdrop/eligible");
    const data = await res.json();
    if (status) status.textContent = "";
    return data.protocols || [];
  } catch (e) {
    if (status) status.textContent = "Failed to load airdrop data.";
    return [];
  }
}

function renderAirdropTable(data) {
  const tbody = document.getElementById("airdropBody");
  tbody.innerHTML = "";
  data.forEach((item, idx) => {
    const row = document.createElement("tr");
    row.className = idx % 2 === 0 ? "bg-gray-900" : "bg-gray-800";
    row.innerHTML = `
      <td class="py-2 px-4">${idx + 1}</td>
      <td class="py-2 px-4">${item.name || "-"}</td>
      <td class="py-2 px-4">${item.category || "-"}</td>
      <td class="py-2 px-4 text-right">${
        item.tvl ? "$" + item.tvl.toLocaleString() : "-"
      }</td>
      <td class="py-2 px-4 text-right">${item.raised || "-"}</td>
      <td class="py-2 px-4 text-right">${item.listed || "-"}</td>
      <td class="py-2 px-4 text-right">${
        item.change1d !== undefined ? item.change1d + "%" : "-"
      }</td>
      <td class="py-2 px-4 text-right">${
        item.change7d !== undefined ? item.change7d + "%" : "-"
      }</td>
      <td class="py-2 px-4 text-right">${
        item.change1m !== undefined ? item.change1m + "%" : "-"
      }</td>
    `;
    tbody.appendChild(row);
  });
}

// Tambahkan elemen status untuk airdrop
const airdropStatusSpan = document.createElement("span");
airdropStatusSpan.id = "airdropStatus";
airdropStatusSpan.className = "text-sm text-gray-400";
const airdropInput = document.getElementById("airdropSearchInput");
if (airdropInput && airdropInput.parentNode) {
  airdropInput.parentNode.appendChild(airdropStatusSpan);
}

let allAirdropData = [];
fetchAirdropData().then((data) => {
  allAirdropData = data;
  renderAirdropTable(data);
});

document
  .getElementById("airdropSearchInput")
  .addEventListener("input", function (e) {
    const val = e.target.value.toLowerCase();
    const filtered = allAirdropData.filter(
      (item) =>
        (item.name || "").toLowerCase().includes(val) ||
        (item.category || "").toLowerCase().includes(val)
    );
    renderAirdropTable(filtered);
  });
