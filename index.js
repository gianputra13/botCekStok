const { Telegraf } = require("telegraf");
const bot = new Telegraf("5612770737:AAFDms1SXbRGVrcOULn6oMDyJvumKdKrpLE");
const axios = require("axios");
const TeleMsgService = require("./services/TeleService/TelegrafService");

async function doGetRequest(ctx) {
  let res = await axios.get("http://192.168.1.101:8000/api/stok?search=" + ctx);
  let data = res.data.data;
  console.log(data);
  // if (data.le) {
  //   return "Data belum ada";
  // } else {
  return data;
  // }
}

bot.on("text", async (ctx) => {
  const q = ctx.message.text;

  if (q === "FORMAT") {
    await TeleMsgService.handleFormatMessage(ctx);
  } else if (q.includes("/hapus")) {
    const deletedStok = await TeleMsgService.handleDeleteStok(ctx, axios);
    deletedStok?.status === 200
      ? ctx.telegram.sendMessage(ctx.chat.id, "Berhasil hapus data")
      : ctx.telegram.sendMessage(ctx.chat.id, "Gagal hapus data");
  } else {
    const results = await doGetRequest(q);
    if (results === "Data belum ada") {
      ctx.telegram.sendMessage(ctx.chat.id, "Data belum ada");
    } else {
      for (const result of results) {
        console.log(result.file_id);
        await ctx.replyWithPhoto(result.file_id, {
          caption:
            "Kode: " +
            result.code +
            "\nNama : " +
            result.namaBarang +
            "\nKondisi : " +
            result.kondisi +
            "\nJenis : " +
            result.jenis +
            "\nTotal : " +
            result.total,
        });
      }
    }
  }
});

bot.use(async (ctx) => {
  const q = ctx.message.text;
  if (
    ctx.message?.caption !== undefined &&
    ctx.message?.caption?.includes("/tambah")
  ) {
    const addedStok = await TeleMsgService.handleAddStok(ctx, axios);
    addedStok?.status === 200
      ? ctx.telegram.sendMessage(ctx.chat.id, "Berhasil menyimpan data")
      : ctx.telegram.sendMessage(ctx.chat.id, "Gagal menyimpan data");
  } else if (q.includes("/edit") || ctx.message?.caption.includes("/edit")) {
    const editedStok = await TeleMsgService.handleEditStok(ctx, axios);
    editedStok?.status === 200
      ? ctx.telegram.sendMessage(ctx.chat.id, "Berhasil edit data")
      : ctx.telegram.sendMessage(ctx.chat.id, "Gagal edit data");
  } else if (q.includes("/jumlah")) {
    const totalStok = await TeleMsgService.handleTotalStok(ctx, axios);
    totalStok?.status === 200
      ? ctx.telegram.sendMessage(ctx.chat.id, "Berhasil ubah total data")
      : ctx.telegram.sendMessage(ctx.chat.id, "Gagal ubah total data");
  } else {
    console.log(ctx.message.text);
  }
});

bot.launch();
