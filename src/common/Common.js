export const terbilang = (angka) => {
    var huruf = ["", "SATU", "DUA", "TIGA", "EMPAT", "LIMA", "ENAM", "TUJUH", "DELAPAN", "SEMBILAN", "SEPULUH", "SEBELAS"];
    var hasil = "";

    if (angka < 12) {
        hasil = huruf[angka];
    } else if (angka < 20) {
        hasil = terbilang(angka - 10) + " BELAS";
    } else if (angka < 100) {
        hasil = terbilang(Math.floor(angka / 10)) + " PULUH " + terbilang(angka % 10);
    } else if (angka < 200) {
        hasil = "SERATUS " + terbilang(angka - 100);
    } else if (angka < 1000) {
        hasil = terbilang(Math.floor(angka / 100)) + " RATUS " + terbilang(angka % 100);
    } else if (angka < 2000) {
        hasil = "SERIBU " + terbilang(angka - 1000);
    } else if (angka < 1000000) {
        hasil = terbilang(Math.floor(angka / 1000)) + " RIBU " + terbilang(angka % 1000);
    } else if (angka < 1000000000) {
        hasil = terbilang(Math.floor(angka / 1000000)) + " JUTA " + terbilang(angka % 1000000);
    } else if (angka < 1000000000000) {
        hasil = terbilang(Math.floor(angka / 1000000000)) + " MILYAR " + terbilang(angka % 1000000000);
    } else if (angka < 1000000000000000) {
        hasil = terbilang(Math.floor(angka / 1000000000000)) + " TRILIUN " + terbilang(angka % 1000000000000);
    } else {
        hasil = "ANGKA TERLALU BESAR";
    }
    return hasil;
}