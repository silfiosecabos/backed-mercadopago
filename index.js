const express = require("express");
const cors = require("cors");
const mercadopago = require("mercadopago");

const app = express();
app.use(express.json());
app.use(cors());

mercadopago.configure({
  access_token: "APP_USR-2181260243825078-052018-35e89b97ca5bed0b6d37c19cea60d37b-2433205748"
});

app.post("/criar-preferencia", async (req, res) => {
  const { valor, titulo } = req.body;

  try {
    const preference = await mercadopago.preferences.create({
      items: [
        {
          title: titulo || "Pedido Online",
          quantity: 1,
          unit_price: parseFloat(valor),
          currency_id: "BRL"
        }
      ],
      auto_return: "approved",
      back_urls: {
        success: "https://seusite.com/sucesso",
        failure: "https://seusite.com/erro",
        pending: "https://seusite.com/pendente"
      }
    });

    res.json({ preferenceId: preference.body.id });
  } catch (e) {
    console.error("Erro:", e);
    res.status(500).json({ erro: "Falha ao criar preferência" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));