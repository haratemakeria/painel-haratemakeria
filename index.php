<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Painel de Pedidos - Hara Temakeria</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <h1>Painel de Pedidos - Hara Temakeria</h1>
  <main class="painel">
    <div class="coluna" id="analise">
      <h2>Análise</h2>
    </div>
    <div class="coluna" id="producao">
      <h2>Produção</h2>
    </div>
    <div class="coluna" id="entrega">
      <h2>Entrega</h2>
    </div>
  </main>
  <div class="rodape">
    <button onclick="zerarPedidos()">Zerar Pedidos do Dia</button>
  </div>
  <script src="painel.js"></script>
</body>
</html>
