<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Painel de Pedidos - Hara Temakeria</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <h1>Painel de Pedidos - Hara Temakeria</h1>
  <button onclick="zerarPedidos()" id="zerarBtn">Zerar pedidos do dia</button>
  <div class="painel">
    <div class="coluna" id="analise"><h2>Análise</h2></div>
    <div class="coluna" id="producao"><h2>Produção</h2></div>
    <div class="coluna" id="entrega"><h2>Entrega</h2></div>
  </div>
  <script src="painel.js"></script>
</body>
</html>
