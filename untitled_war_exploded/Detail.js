const back = document.getElementById("back");
const submitbtn = document.getElementById("submitbtn");
const image = document.getElementById("image");
const gname = document.getElementById("gname");
const price = document.getElementById("price");
const provider = document.getElementById("provider");
const num = document.getElementById("num");
var priceval = '';
const selectnum = document.getElementById('selectnum');
const purchase = document.getElementById('purchase');
const form = document.getElementById('buy');
submitbtn.disabled = true;

setTimeout(function () {
    var info = document.cookie.split('=')[1];
    const goodname = info.split('&')[0];
    gname.textContent = goodname;
    const goodprice = info.split('&')[1];
    price.textContent = '￥' + goodprice;
    priceval = goodprice;
    const goodquantity = info.split('&')[2];
    num.textContent += goodquantity;
    const goodimage = info.split('&')[3];
    image.src = goodimage;
    const goodprovider = info.split('&')[4];
    provider.textContent += goodprovider;
    document.getElementById('good').value = info.split('&')[5];
    selectnum.value = info.split('&')[6];
}, 100);

selectnum.addEventListener('input', function (w) {
    w.preventDefault();
    if (this.value > 0)
        submitbtn.disabled = false;
    else
        submitbtn.disabled = true;
});

submitbtn.addEventListener('click', function (e) {
    e.preventDefault();
    if (selectnum.value > 0) {
        document.getElementById('goodprice').value = (selectnum.value * parseFloat(priceval)).toFixed(2);
        form.submit();
        setTimeout(function () { purchase.showModal(); }, 100);
    }
});

back.addEventListener('click', function (e) {
    e.preventDefault();
    history.back();
});

document.getElementById('buybtn').addEventListener('click', function (e) {
    e.preventDefault();
    purchase.close();
    window.location.href = "CIndex.html";
})
