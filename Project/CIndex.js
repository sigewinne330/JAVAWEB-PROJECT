//初始化
const tabMenu = document.querySelector('#nav_1');//抓取导航栏的按钮
const tabList = document.getElementsByClassName('div_1');
const content_list = document.getElementById('div_101');
const search = document.getElementById('search');
const searchtext = document.getElementById('searchtext');
content_list.style.display = "block";
let formid = '';
let orderid = '';
let cartitem = 0;
let total = 0;

// 监听页面加载事件
window.addEventListener('load', function () {
    // 如果浏览器支持会话历史
    if (window.history && window.history.pushState) {
        // 阻止后退操作的默认刷新行为
        window.addEventListener('popstate', function (event) {
            event.preventDefault();
        });
    }
});

/** 
 * 控制导航栏和各分页的显示
 */
tabMenu.addEventListener('click', function (e) {
    e.preventDefault();
    var target = e.target;//抓取标签
    if (target.tagName.toLowerCase() === 'button') {
        var id = '1';
        target = document.getElementById(id + target.id);
    }//归一到链接处
    if (target.tagName.toLowerCase() === 'a') {
        var href = target.getAttribute('href');
        for (var i = 0; i < tabList.length; ++i) {

            var div_tar = document.getElementById('div_' + (101 + i));
            var bt_tar = document.getElementById(101 + i);

            if (tabList[i].id != href) {
                div_tar.style.display = "none";
                bt_tar.style.backgroundColor = "rgb(241, 167, 181)";
            }
            else {
                div_tar.style.display = "block";
                bt_tar.style.backgroundColor = "rgb(213, 82, 118)";
            }
        }
    }
});
//默认展示商品的页面
document.getElementById('101').click();

//向服务器传输数据
function getData(formtype, parent) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', './Test2', true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var data = JSON.parse(xhr.responseText);
            while (parent.firstChild) {
                parent.removeChild(parent.firstChild);
            }
            //添加新商品
            for (var i = 0; i < data.length; ++i) {
                const newgood = document.createElement('div');
                newgood.className = "div_1_1";
                newgood.id = "div_1_1_" + data[i].id;
                const goodimg = document.createElement('img');
                if (data[i].image != null)
                    goodimg.src = data[i].image;
                else
                    goodimg.src = "./Image/default.jpg";
                newgood.appendChild(goodimg);
                const goodname = document.createElement('p');
                goodname.className = "glabel";
                goodname.textContent = data[i].name;
                newgood.appendChild(goodname);
                const goodprice = document.createElement('label');
                goodprice.className = "gprice";
                goodprice.textContent = '￥' + data[i].price;
                newgood.appendChild(goodprice);
                const detailform = document.createElement('form');
                detailform.action = "./Test2";
                detailform.method = "post";
                const btnformtype = document.createElement('input');
                btnformtype.type = "hidden";
                btnformtype.name = "formtype"
                btnformtype.value = "getdetails";
                detailform.appendChild(btnformtype);
                const btnid = document.createElement('input');
                btnid.type = "hidden";
                btnid.name = "goodid"
                btnid.value = data[i].id;
                detailform.appendChild(btnid);
                const lookout = document.createElement('input');
                lookout.className = "glook";
                lookout.type = "submit";
                lookout.value = "详情";
                detailform.appendChild(lookout);
                newgood.appendChild(detailform);
                parent.appendChild(newgood);
            }

        }
    };
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    var formdata = formtype;
    xhr.send(formdata);
}
getData('formtype=cindex_list', content_list);


//搜索框
search.addEventListener('submit', function (e) {
    e.preventDefault();
    while (content_list.firstChild) {
        content_list.removeChild(content_list.firstChild);
    }
    var text = searchtext.value;
    var formdata = 'text=' + text + '&formtype=searchgoods';
    getData(formdata, content_list);
});

//购物车
function cartinfo() {
    const cart = document.getElementById('div_102_b');
    while (cart.firstChild) {
        cart.removeChild(cart.firstChild);
    }
    var xhr = new XMLHttpRequest();
    xhr.open('POST', './Test2', true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var data = JSON.parse(xhr.responseText);
            cartitem = 0;
            total = 0;

            //添加新商品
            for (var i = 0; i < data.length; ++i) {
                const newgood = document.createElement('div');
                newgood.className = "div_1_2";
                newgood.id = "div_1_2_" + data[i].id;
                const goodname = document.createElement('p');
                goodname.className = "cglabel";
                goodname.textContent = data[i].name;
                newgood.appendChild(goodname);
                const goodnum = document.createElement('label');
                goodnum.className = "cgnum";
                goodnum.textContent = '×' + data[i].quantity;
                cartitem += parseInt(data[i].quantity);
                newgood.appendChild(goodnum);
                const goodprice = document.createElement('label');
                goodprice.className = "cgprice";
                goodprice.textContent = '￥' + data[i].price;
                total += parseFloat(data[i].price);
                newgood.appendChild(goodprice);
                const goodtimestamp = document.createElement('label');
                goodtimestamp.className = "cgtime";
                goodtimestamp.textContent = '订单创建时间：' + data[i].timestamp;
                newgood.appendChild(goodtimestamp);
                const detailform = document.createElement('form');
                detailform.action = "./Test2";
                detailform.method = "post";
                const btnformtype = document.createElement('input');
                btnformtype.type = "hidden";
                btnformtype.name = "formtype"
                btnformtype.value = "getdetails";
                detailform.appendChild(btnformtype);
                const btnid = document.createElement('input');
                btnid.type = "hidden";
                btnid.name = "goodid"
                btnid.value = data[i].id;
                detailform.appendChild(btnid);
                const lookout = document.createElement('input');
                lookout.className = "cglook";
                lookout.type = "submit";
                lookout.value = "详情";
                detailform.appendChild(lookout);
                newgood.appendChild(detailform);
                const removeform = document.createElement('form');
                removeform.action = "./Test2";
                removeform.method = "post";
                removeform.className = "rm";
                removeform.id = data[i].id;
                const btnformtype2 = document.createElement('input');
                btnformtype2.type = "hidden";
                btnformtype2.name = "formtype"
                btnformtype2.value = "rmcart";
                removeform.appendChild(btnformtype2);
                const btnid2 = document.createElement('input');
                btnid2.type = "hidden";
                btnid2.name = "rmgoodid";
                btnid2.value = data[i].id;
                removeform.appendChild(btnid2);
                const remove = document.createElement('input');
                remove.className = "cgdel";
                remove.type = "submit";
                remove.value = "删除";
                removeform.appendChild(remove);
                newgood.appendChild(removeform);
                cart.appendChild(newgood);
            }

            document.getElementById('cartnum').textContent = cartitem;
            total = total.toFixed(2);
            if (cartitem == 0) {
                document.getElementById('gpay').disabled = true;
                document.getElementById('empty').disabled = true;
            }
            else {
                document.getElementById('gpay').disabled = false;
                document.getElementById('empty').disabled = false;
            }

            rmset = document.querySelectorAll('.rm');
            for (var i = 0; i < rmset.length; ++i) {
                rmset[i].addEventListener('submit', function (e) {
                    e.preventDefault();
                    document.getElementById('rmdialog').showModal();
                    formid = this.id;
                });
            }

        }
    };
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    var formdata = 'formtype=cartinfo';
    xhr.send(formdata);
}
cartinfo();

//删除购物车的商品
document.getElementById('rm_t').addEventListener('click', function (e) {
    e.preventDefault();
    document.getElementById(formid).submit();
    document.getElementById('rmdialog').close();
    setTimeout(function () {
        cartinfo();
    }, 100);
});
document.getElementById('rm_f').addEventListener('click', function (e) {
    e.preventDefault();
    document.getElementById('rmdialog').close();
});


//清空购物车
document.getElementById('empty').addEventListener('click', function (e) {
    e.preventDefault();
    document.getElementById('rmalldialog').showModal();
});
document.getElementById('empty_t').addEventListener('click', function (e) {
    e.preventDefault();
    document.getElementById('rmcartall').submit();
    document.getElementById('rmalldialog').close();
    setTimeout(function () {
        cartinfo();
    }, 100);
});
document.getElementById('empty_f').addEventListener('click', function (e) {
    e.preventDefault();
    document.getElementById('rmalldialog').close();
});

//支付
document.getElementById('gpay').addEventListener('click', function (e) {
    e.preventDefault();
    document.getElementById('paynumval').textContent = cartitem;
    document.getElementById('paypriceval').textContent = '￥' + total;
    document.getElementById('paydialog').showModal();
});
document.getElementById('pay_t').addEventListener('click', function (e) {
    e.preventDefault();
    document.getElementById('paydialog').close();
    document.getElementById('transferdialog').showModal();
});
document.getElementById('pay_f').addEventListener('click', function (e) {
    e.preventDefault();
    document.getElementById('paydialog').close();
});
document.getElementById('finish_t').addEventListener('click', function (e) {
    e.preventDefault();
    document.getElementById('pay').submit();
    document.getElementById('transferdialog').close();
    setTimeout(function () {
        cartinfo();
        orderinfo();
        getData('formtype=cindex_list', content_list);
    }, 100);
});
document.getElementById('finish_f').addEventListener('click', function (e) {
    e.preventDefault();
    document.getElementById('transferdialog').close();
});

//查看订单
function defaultorderlist() {
    const rootelem = document.getElementById('div_103_b');
    const defaulttext = document.createElement('h4');
    defaulttext.textContent = '您目前暂时没有订单。'
    rootelem.appendChild(defaulttext);
}

function getCurrentTimeFormatted() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function orderinfo() {
    const cart = document.getElementById('div_103_b');
    const timelabel = document.getElementById('renewtime');
    while (cart.firstChild) {
        cart.removeChild(cart.firstChild);
    }
    var xhr = new XMLHttpRequest();
    xhr.open('POST', './Test2', true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var data = JSON.parse(xhr.responseText);

            if (data.length == 0)
                defaultorderlist();
            else {
                //添加新商品

                for (var i = 0; i < data.length; ++i) {
                    const newgood = document.createElement('div');
                    newgood.className = "div_1_3b";
                    newgood.id = "div_1_3_" + data[i].id;
                    const goodname = document.createElement('p');
                    goodname.className = "cglabel";
                    goodname.textContent = data[i].name;
                    newgood.appendChild(goodname);
                    const goodnum = document.createElement('label');
                    goodnum.className = "cgnum";
                    goodnum.textContent = '×' + data[i].quantity;
                    newgood.appendChild(goodnum);
                    const goodprice = document.createElement('label');
                    goodprice.className = "cgprice";
                    goodprice.textContent = '￥' + data[i].price;
                    newgood.appendChild(goodprice);
                    const goodstatus = document.createElement('label');
                    goodstatus.className = "cgstatus";
                    goodstatus.textContent = data[i].status;
                    newgood.appendChild(goodstatus);
                    const goodtimestamp = document.createElement('label');
                    goodtimestamp.className = "cgtime";
                    goodtimestamp.textContent = '订单支付时间：' + data[i].timestamp;
                    newgood.appendChild(goodtimestamp);
                    const lookout = document.createElement('input');
                    lookout.className = "recv";
                    lookout.type = "button";
                    lookout.value = "确认收货";
                    lookout.id = data[i].id;
                    if (data[i].status != '已派送')
                        lookout.disabled = true;
                    newgood.appendChild(lookout);
                    cart.appendChild(newgood);
                }


                recvset = document.querySelectorAll('.recv');
                for (var i = 0; i < recvset.length; ++i) {
                    recvset[i].addEventListener('click', function (e) {
                        e.preventDefault();
                        document.getElementById('recvdialog').showModal();
                        orderid = this.id;
                    });
                }
            }
            timelabel.textContent = getCurrentTimeFormatted();
        }
    };
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    var formdata = 'formtype=orderinfo';
    xhr.send(formdata);
}

orderinfo();

//刷新订单列表
document.getElementById('orderrenew').addEventListener('click', function (e) {
    e.preventDefault();
    orderinfo();
});

//确认收货
document.getElementById('recv_t').addEventListener('click', function (e) {
    e.preventDefault();
    document.getElementById('recvorderid').value = orderid;
    document.getElementById('goodrecv').submit();
    document.getElementById('recvdialog').close();
    setTimeout(function () {
        orderinfo();
        loginfo();
    }, 100);
});

document.getElementById('recv_f').addEventListener('click', function (e) {
    e.preventDefault();
    document.getElementById('recvdialog').close();
});

//历史记录
function defaultloglist() {
    const rootelem = document.getElementById('div_104_b');
    const defaulttext = document.createElement('h4');
    defaulttext.textContent = '您当前暂无历史购物记录。'
    rootelem.appendChild(defaulttext);
    document.getElementById('logempty').disabled = true;
}

function loginfo() {
    const cart = document.getElementById('div_104_b');
    while (cart.firstChild) {
        cart.removeChild(cart.firstChild);
    }
    var xhr = new XMLHttpRequest();
    xhr.open('POST', './Test2', true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var data = JSON.parse(xhr.responseText);

            if (data.length == 0)
                defaultloglist();
            else {
                //加载历史记录数据
                document.getElementById('logempty').disabled = false;
                for (var i = 0; i < data.length; ++i) {
                    const newgood = document.createElement('div');
                    newgood.className = "div_1_4b";
                    newgood.id = "div_1_4_" + data[i].id;
                    const goodname = document.createElement('p');
                    goodname.className = "cglabel";
                    goodname.textContent = data[i].name;
                    newgood.appendChild(goodname);
                    const goodnum = document.createElement('label');
                    goodnum.className = "cgnum";
                    goodnum.textContent = '×' + data[i].quantity;
                    newgood.appendChild(goodnum);
                    const goodprice = document.createElement('label');
                    goodprice.className = "cgprice";
                    goodprice.textContent = '￥' + data[i].price;
                    newgood.appendChild(goodprice);
                    const goodcarttime = document.createElement('label');
                    goodcarttime.className = "time1";
                    goodcarttime.textContent = '订单创建时间：' + data[i].carttime;
                    newgood.appendChild(goodcarttime);
                    const goodpaytime = document.createElement('label');
                    goodpaytime.className = "time2";
                    goodpaytime.textContent = '订单支付时间：' + data[i].paytime;
                    newgood.appendChild(goodpaytime);
                    const goodrecetime = document.createElement('label');
                    goodrecetime.className = "time3";
                    goodrecetime.textContent = '订单签收时间：' + data[i].recetime;
                    newgood.appendChild(goodrecetime);
                    cart.appendChild(newgood);

                }
            }
        }
    };
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    var formdata = 'formtype=cartloginfo';
    xhr.send(formdata);
}

loginfo();

document.getElementById('logempty').addEventListener('click', function (e) {
    e.preventDefault();
    document.getElementById('rmlogdialog').showModal();
});

document.getElementById('rmlog_t').addEventListener('click', function (e) {
    e.preventDefault();
    document.getElementById('delcartlog').submit();
    document.getElementById('rmlogdialog').close();
    setTimeout(function () {
        loginfo();
    }, 100);
});

document.getElementById('rmlog_f').addEventListener('click', function (e) {
    e.preventDefault();
    document.getElementById('rmlogdialog').close();
});