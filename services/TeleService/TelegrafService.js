exports.handleFormatMessage = async (ctx) => {
  await ctx.telegram.sendMessage(
    ctx.chat.id,
    `==== Selamat Datang ====\n**Daftar Format Untuk Aksi**\n\n1.Tambah Stok\n/tambah#Nama#Jenis#Kondisi#Jumlah\n2.Edit Stok\n/edit#Kode#Nama#Jenis#Kondisi#Jumlah\n3.Hapus Barang\n/hapus#Kode\n4.Total Update\n/jumlah#Kode#Jumlah Barang Sekarang`
  );
};

exports.handleAddStok = async (ctx, axios) => {
  const photoId = ctx.message.photo[ctx.message.photo.length - 1].file_id;
  const msg = ctx.message.caption;
  const [, nama, jenis, kondisi, jumlah] = msg.split("#");
  const sendData = await axios.post("http://192.168.1.101:8000/api/stok", {
    nama_barang: nama,
    jenis,
    kondisi,
    total: jumlah,
    file_id: photoId,
  });
  return sendData;
};

exports.handleEditStok = async (ctx, axios) => {
  return false;
};

exports.handleDeleteStok = async (ctx, axios) => {
  const msg = ctx.message.text;
  const [, kodeBarang] = msg.split("#");
  const sendData = await axios.delete(
    `http://192.168.1.101:8000/api/stok/${kodeBarang}`
  );
  return sendData;
};

exports.handleTotalStok = async (ctx, axios) => {
  return false;
};
