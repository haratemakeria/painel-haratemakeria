const SUPABASE_URL = "https://ktkpdacxvqyautkfplly.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0a3BkYWN4dnF5YXV0a2ZwbGx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3NTY1ODIsImV4cCI6MjA2NTMzMjU4Mn0.TRkSYcCX158bDLFb7lHD0ZNWKHgTBalFzdpb9uET2gk";
const TABELA = "pedidos_2025_06_12"; // Tabela atual do dia
const SENHA_PADRAO = "123";

async function fetchPedidos() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${TABELA}?select=*`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`
    }
  });
  const pedidos = await res.json();
  renderPedidos(pedidos);
}

function renderPedidos(pedidos) {
  ["analise", "producao", "entrega"].forEach(status => {
    const col = document.getElementById(status);
    col.innerHTML = `<h2>${status.charAt(0).toUpperCase() + status.slice(1)}</h2>`;
  });

  pedidos.forEach(p => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <div style="display: flex; justify-content: space-between;">
        <strong>#${p.numero} - ${p.cliente}</strong>
        ${p.status !== "analise" ? `<span class="cancel-icon" onclick="pedirSenhaECancelar('${p.id}')">✖</span>` : ""}
      </div>
      <p>${p.descricao}</p>
    `;

    if (p.status === "analise") {
      div.innerHTML += `<button onclick="mudarStatus('${p.id}', 'producao')">Aceitar</button>`;
    } else if (p.status === "producao") {
      div.innerHTML += `<button onclick="mudarStatus('${p.id}', 'entrega')">➡️</button>`;
    }

    document.getElementById(p.status).appendChild(div);
  });

  verificarBotaoZerar(pedidos);
}

function verificarBotaoZerar(pedidos) {
  const existeAnaliseOuProducao = pedidos.some(p => p.status === "analise" || p.status === "producao");
  const btnZerar = document.getElementById("zerarBtn");
  btnZerar.disabled = existeAnaliseOuProducao;
}

async function mudarStatus(id, novoStatus) {
  await fetch(`${SUPABASE_URL}/rest/v1/${TABELA}?id=eq.${id}`, {
    method: "PATCH",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ status: novoStatus })
  });
  fetchPedidos();
}

function pedirSenhaECancelar(id) {
  const senha = prompt("Digite a senha para cancelar:");
  if (senha === SENHA_PADRAO) {
    cancelar(id);
  } else {
    alert("Senha incorreta!");
  }
}

async function cancelar(id) {
  await fetch(`${SUPABASE_URL}/rest/v1/${TABELA}?id=eq.${id}`, {
    method: "DELETE",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`
    }
  });
  fetchPedidos();
}

async function zerarPedidosEntregues() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${TABELA}?status=eq.entrega`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`
    }
  });
  const entregues = await res.json();

  for (const pedido of entregues) {
    await fetch(`${SUPABASE_URL}/rest/v1/${TABELA}?id=eq.${pedido.id}`, {
      method: "DELETE",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`
      }
    });
  }

  fetchPedidos();
}

document.getElementById("zerarBtn").addEventListener("click", zerarPedidosEntregues);

setInterval(fetchPedidos, 5000);
fetchPedidos();
