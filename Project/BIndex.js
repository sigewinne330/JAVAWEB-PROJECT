//初始化
var tabMenu = document.querySelector('#nav_2');//抓取导航栏的按钮
var tabList = document.getElementsByClassName('div_2');
document.getElementById('div_201').style.display = "block";
var today = new Date().toISOString().split('T')[0];
document.getElementById('BSdate').value = today;
document.getElementById('BEdate').value = today;
const table_201 = document.getElementById('body_201');
const table_202 = document.getElementById('body_202');
const table_203 = document.getElementById('body_203');
var status1 = 2;
var status2 = '全部';

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
        var id = '2';
        target = document.getElementById(id + target.id);
    }//归一到链接处
    if (target.tagName.toLowerCase() === 'a') {
        var href = target.getAttribute('href');
        for (var i = 0; i < tabList.length; ++i) {

            var div_tar = document.getElementById('div_' + (201 + i));
            var bt_tar = document.getElementById(201 + i);

            if (tabList[i].id != href) {
                div_tar.style.display = "none";
                bt_tar.style.backgroundColor = "rgb(170, 212, 248)";
            }
            else {
                div_tar.style.display = "block";
                bt_tar.style.backgroundColor = "rgb(81, 132, 178)";
            }
        }
    }
});

document.getElementById('201').click();

document.getElementById('goodstatus').addEventListener('change', function () {
    status1 = this.value;
})

var delMenu_1 = document.querySelector('.del_201');
var addMenu_1 = document.querySelector('.add_201');

//初始化商品管理列表
function search_201() {
    var gno = document.getElementById('gno').value;
    var gname = document.getElementById('gname').value;
    var xhr = new XMLHttpRequest();
    xhr.open('POST', './Test2', false);//同步数据
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var data = JSON.parse(xhr.responseText);
            //刷新
            while (table_201.firstChild) {
                table_201.removeChild(table_201.firstChild);
            }
            //返回查询结果
            for (var i = 0; i < data.length; ++i) {
                const gid = data[i].goodid;
                const name = data[i].goodname;
                const price = data[i].goodprice;
                const num = data[i].goodquantity;
                const status = data[i].goodstatus;
                const tr = document.createElement('tr');
                const c1_1 = document.createElement('td');
                c1_1.textContent = gid;
                tr.appendChild(c1_1);
                const c1_2 = document.createElement('td');
                c1_2.textContent = name;
                c1_2.id = 'name' + gid;
                tr.appendChild(c1_2);
                const c1_3 = document.createElement('td');
                c1_3.textContent = price;
                c1_3.id = 'price' + gid;
                tr.appendChild(c1_3);
                const c1_4 = document.createElement('td');
                c1_4.textContent = num;
                tr.appendChild(c1_4);
                const c1_5 = document.createElement('td');
                if (status == 1)
                    c1_5.textContent = '销售中';
                else {
                    c1_5.textContent = '已下架';
                    c1_1.style.color = "grey";
                    c1_2.style.color = "grey";
                    c1_3.style.color = "grey";
                    c1_4.style.color = "grey";
                    c1_5.style.color = "grey";
                }
                tr.appendChild(c1_5);
                const c1_6 = document.createElement('td');
                const add = document.createElement('button');
                add.className = "add_201";
                add.id = gid;
                add.textContent = '添加';
                c1_6.appendChild(add);
                const mod = document.createElement('button');
                mod.className = "mod_201";
                mod.id = gid;
                mod.textContent = "修改";
                c1_6.appendChild(mod);
                const del = document.createElement('button');
                del.id = gid;
                del.name = status;
                if (status == 1) {
                    del.className = "del_201";
                    del.textContent = "下架";
                }
                else {
                    del.className = "open_201";
                    del.textContent = "上架";
                    if (num <= 0)
                        del.disabled = true;
                    else
                        del.disabled = false;
                }
                c1_6.appendChild(del);
                tr.appendChild(c1_6);
                table_201.appendChild(tr);
            }
        }
    }
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    var formdata = "gno=" + gno + "&gname=" + gname + "&goodstatus=" + status1 + "&formtype=bindex_man";
    xhr.send(formdata);
}

//初始化按钮组合
function buttons_201() {
    var add = document.querySelectorAll('.add_201');
    for (var i = 0; i < add.length; ++i) {
        add[i].addEventListener('click', function () {
            document.getElementById('add_201').showModal();
            var gname = document.getElementById('name' + this.id).textContent;
            document.getElementById('addgnamelbl').textContent = gname;
            document.getElementById('addgname').value = gname;
        });
    }

    var mod = document.querySelectorAll('.mod_201');
    for (var i = 0; i < mod.length; ++i) {
        mod[i].addEventListener('click', function () {
            document.getElementById('modgimage').value = '';
            document.getElementById('mod_201').showModal();
            document.getElementById('modgoodid').value = this.id;
            document.getElementById('modgname').value = document.getElementById('name' + this.id).textContent;
            document.getElementById('modgprice').value = document.getElementById('price' + this.id).textContent;
        });
    }

    var del = document.querySelectorAll('.del_201');
    for (var i = 0; i < del.length; ++i)
        del[i].addEventListener('click', function () {
            document.getElementById('del_201').showModal();
            document.getElementById('delgid').value = this.id;
            document.getElementById('delstatus').value = this.name;
        });

    var open = document.querySelectorAll('.open_201');
    for (var i = 0; i < open.length; ++i)
        open[i].addEventListener('click', function () {
            document.getElementById('open_201').showModal();
            document.getElementById('delgid').value = this.id;
            document.getElementById('delstatus').value = this.name;
        });
}

search_201();
buttons_201();

document.getElementById('sub_201').addEventListener('click', function (e) {
    e.preventDefault();
    search_201();
    buttons_201();
});

//向数据库中添加商品
document.getElementById('tb_201_add').addEventListener('click', function () {
    document.getElementById('Gimage').value = '';
    document.getElementById('dialog_201_add').showModal();
});
const input = document.getElementById('Gname');
input.addEventListener('keypress', function (w) {
    w.preventDefault();
    if (w.key != 'enter') {
        input.style = "background-color:white";
        input.value += w.key;
    }
});
document.getElementById('d201_add_t').addEventListener('click', function () {
    if (input.value == '' || input.value.length > 150) {
        input.style = "background-color:rgb(241, 167, 181)";
    }
    else {
        document.getElementById('newgood').submit();
        document.getElementById('dialog_201_add').close();
        setTimeout(function () {
            search_201();
            buttons_201();
        }, 100);
    }
});
document.getElementById('d201_add_f').addEventListener('click', function () {
    document.getElementById('dialog_201_add').close();
});

//查询商品汇总结果
document.getElementById('tb_201_sum').addEventListener('click', function () {
    document.getElementById('countgood').submit();
    setTimeout(function () {
        var data = document.cookie.split('=')[1];
        const classsum = data.split('&')[0];
        const valuesum = data.split('&')[1];
        const numsum = data.split('&')[2];
        document.getElementById('classsum').textContent = "商品种类：" + classsum;
        document.getElementById('valuesum').textContent = "总价：" + valuesum + "元";
        document.getElementById('numsum').textContent = "总件数：" + numsum + "件";
        document.getElementById('dialog_201_sum').showModal();
    }, 100);
});
document.getElementById('d201_sum_f').addEventListener('click', function () {
    document.getElementById('dialog_201_sum').close();
});

//添加商品数量
document.getElementById('add_201_t').addEventListener('click', function () {
    document.getElementById('addgoodnum').submit();
    document.getElementById('add_201').close();
    setTimeout(function () {
        search_201();
        buttons_201();
    }, 100);
});
document.getElementById('add_201_f').addEventListener('click', function () {
    document.getElementById('add_201').close();
});

//修改商品信息
const modinput = document.getElementById('modgname');
modinput.addEventListener('keypress', function (w) {
    w.preventDefault();
    if (w.key != 'enter') {
        modinput.style = "background-color:white";
        modinput.value += w.key;
    }
});
document.getElementById('mod_201_t').addEventListener('click', function () {
    if (modinput.value == '' || modinput.value.length > 150) {
        modinput.style = "background-color:rgb(241, 167, 181)";
    }
    else {
        document.getElementById('modgoodnum').submit();
        document.getElementById('mod_201').close();
        setTimeout(function () {
            search_201();
            buttons_201();
        }, 100);
    }
});
document.getElementById('mod_201_f').addEventListener('click', function () {
    document.getElementById('mod_201').close();
});

//上架/下架商品
document.getElementById('del_201_t').addEventListener('click', function () {
    document.getElementById('delgoodnum').submit();
    document.getElementById('del_201').close();
    setTimeout(function () {
        search_201();
        buttons_201();
    }, 100);
});
document.getElementById('open_201_t').addEventListener('click', function () {
    document.getElementById('delgoodnum').submit();
    document.getElementById('open_201').close();
    setTimeout(function () {
        search_201();
        buttons_201();
    }, 100);
});
document.getElementById('del_201_f').addEventListener('click', function () {
    document.getElementById('del_201').close();
});
document.getElementById('open_201_f').addEventListener('click', function () {
    document.getElementById('open_201').close();
});
document.getElementById('orderstatus').addEventListener('change', function () {
    status2 = this.value;
})

//初始化订单列表
function search_202() {
    var endtime = (document.getElementById('BEdate').value + ' ' + document.getElementById('BEtime').value);
    var starttime = (document.getElementById('BSdate').value + ' ' + document.getElementById('BStime').value);
    var orderno = document.getElementById('orderno').value;
    var goodno = document.getElementById('goodno').value;
    var userno = document.getElementById('userno').value;

    var xhr = new XMLHttpRequest();
    xhr.open('POST', './Test2', false);//同步数据
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var data = JSON.parse(xhr.responseText);
            //刷新
            while (table_202.firstChild) {
                table_202.removeChild(table_202.firstChild);
            }
            //返回查询结果
            for (var i = 0; i < data.length; ++i) {
                const cid = data[i].cid;
                const gname = data[i].gname;
                const cgnum = data[i].cgnum;
                const price = data[i].price;
                const cuser = data[i].user;
                const status = data[i].status;
                const tr = document.createElement('tr');
                const c2_0 = document.createElement('td');
                c2_0.textContent = cid;
                c2_0.id = 'orderid_' + cid;
                tr.appendChild(c2_0);
                const c2_1 = document.createElement('td');
                c2_1.textContent = gname;
                c2_1.id = 'ordergname_' + cid;
                tr.appendChild(c2_1);
                const c2_2 = document.createElement('td');
                c2_2.textContent = cgnum;
                tr.appendChild(c2_2);
                const c2_3 = document.createElement('td');
                c2_3.textContent = price;
                tr.appendChild(c2_3);
                const c2_4 = document.createElement('td');
                c2_4.textContent = cuser;
                c2_4.id = 'orderuserid_' + cid;
                tr.appendChild(c2_4);
                const c2_5 = document.createElement('td');
                c2_5.textContent = status;
                tr.appendChild(c2_5);
                const c2_6 = document.createElement('td');
                const info = document.createElement('button');
                info.className = "info_202";
                info.id = cid;
                info.textContent = '详细信息';
                c2_6.appendChild(info);
                const sent = document.createElement('button');
                sent.className = "sent_202";
                sent.id = cid;
                sent.textContent = "确认发货";
                if (status != '已支付')
                    sent.disabled = true;
                else
                    sent.disabled = false;
                c2_6.appendChild(sent);
                tr.appendChild(c2_6);
                table_202.appendChild(tr);
            }
        }
    }
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    var formdata = "cid=" + orderno + "&gno=" + goodno + "&userid=" + userno + "&from=" + starttime + "&to=" + endtime + "&orderstatus=" + status2 + "&formtype=bindex_order";
    xhr.send(formdata);
}

//初始化按钮组合
function buttons_202() {
    var add = document.querySelectorAll('.info_202');
    for (var i = 0; i < add.length; ++i) {
        add[i].addEventListener('click', function () {
            var user = document.getElementById('orderuserid_' + this.id).textContent;
            var ordername = document.getElementById('ordergname_' + this.id).textContent;
            document.getElementById('orderid').textContent = this.id;
            document.getElementById('ordername').textContent = ordername;
            document.getElementById('orderuserid').textContent = user;
            document.getElementById('orderidinput').value = this.id;
            document.getElementById('orderdetail').submit();
            setTimeout(function () {
                var timedata = document.cookie;
                document.getElementById('time1info').textContent = timedata.split('&')[0].split('=')[1];
                document.getElementById('time2info').textContent = timedata.split('&')[1].split('=')[1];
                document.getElementById('time3info').textContent = timedata.split('&')[2].split('=')[1];
                document.getElementById('time4info').textContent = timedata.split('&')[3].split('=')[1];
                document.getElementById('info_202').showModal();
            }, 100);
        });
    }

    var mod = document.querySelectorAll('.sent_202');
    for (var i = 0; i < mod.length; ++i) {
        mod[i].addEventListener('click', function () {
            document.getElementById('deliverinput').value = this.id;
            document.getElementById('sent_202').showModal();
        });
    }
}

search_202();
buttons_202();

document.getElementById('ordersearch').addEventListener('click', function (e) {
    e.preventDefault();
    search_202();
    buttons_202();
});

document.getElementById('info_202_f').addEventListener('click', function () {
    document.getElementById('info_202').close();
});

document.getElementById('sent_202_t').addEventListener('click', function () {
    document.getElementById('deliver').submit();
    setTimeout(function () {
        document.getElementById('sent_202').close();
        search_202();
        buttons_202();
    }, 100);
});
document.getElementById('sent_202_f').addEventListener('click', function () {
    document.getElementById('sent_202').close();
});

const now = new Date();
const year = now.getFullYear();
const month = String(now.getMonth() + 1);
const day = String(now.getDate());
var days;
for (var i = 0; i < 100; ++i) {
    var op = document.createElement('option');
    op.value = i + 2000;
    op.text = (i + 2000).toString();
    op.id = 'y_' + (i + 2000).toString();
    document.getElementById('year_203').appendChild(op);
}
document.getElementById('y_' + year).selected = true;
for (var i = 0; i < 12; ++i) {
    var op = document.createElement('option');
    op.value = i + 1;
    op.text = (i + 1).toString();
    op.id = 'm_' + (i + 1).toString();
    document.getElementById('month_203').appendChild(op);
}
document.getElementById('m_' + month).selected = true;

function setdays() {
    var M = document.getElementById('month_203').value;
    if (M == 4 || M == 6 || M == 9 || M == 11)
        days = 30;
    else if (M == 2) {
        var Y = document.getElementById('year_203').value;
        if (Y % 4 == 0 || (Y % 100 && Y % 400 == 0))
            days = 29;
        else
            days = 28;
    }
    else
        days = 31;
    while (document.getElementById('day_203').firstChild)
        document.getElementById('day_203').removeChild(document.getElementById('day_203').firstChild);
    for (var i = 0; i < days; ++i) {
        var op = document.createElement('option');
        op.value = i + 1;
        op.text = (i + 1).toString();
        op.id = 'd_' + (i + 1).toString();
        document.getElementById('day_203').appendChild(op);
    }
}

setdays();
document.getElementById('d_' + day).selected = true;

function rangemode(m) {
    if (m == 0) {
        fromtime = `${document.getElementById('year_203').value}-01-01 00:00:00`;
        totime = `${document.getElementById('year_203').value}-12-31 23:59:59`;
    }
    else if (m == 1) {
        fromtime = `${document.getElementById('year_203').value}-${document.getElementById('month_203').value.padStart(2, '0')}-01 00:00:00`;
        totime = `${document.getElementById('year_203').value}-${document.getElementById('month_203').value.padStart(2, '0')}-${days} 23:59:59`;
    }
    else {
        fromtime = `${document.getElementById('year_203').value}-${document.getElementById('month_203').value.padStart(2, '0')}-${document.getElementById('day_203').value.padStart(2, '0')} 00:00:00`;
        totime = `${document.getElementById('year_203').value}-${document.getElementById('month_203').value.padStart(2, '0')}-${document.getElementById('day_203').value.padStart(2, '0')} 23:59:59`;
    }
}
rangemode(datemode);



document.getElementById('year_203').addEventListener('change', function () {
    setdays();
    rangemode(datemode);

})

document.getElementById('month_203').addEventListener('change', function () {
    setdays();
    rangemode(datemode);

})

document.getElementById('day_203').addEventListener('change', function () {
    rangemode(datemode);

})

var fromtime;
var totime;
var datemode = 2;

const modeset = document.querySelectorAll('.mode');
modeset[0].addEventListener('click', function () {
    document.getElementById('mode_0').style.display = 'inline';
    document.getElementById('mode_1').style.display = 'none';
    document.getElementById('mode_2').style.display = 'none';
    datemode = 0;
    rangemode(datemode);

})
modeset[1].addEventListener('click', function () {
    document.getElementById('mode_0').style.display = 'inline';
    document.getElementById('mode_1').style.display = 'inline';
    document.getElementById('mode_2').style.display = 'none';
    datemode = 1;
    rangemode(datemode);

})
modeset[2].addEventListener('click', function () {
    document.getElementById('mode_0').style.display = 'inline';
    document.getElementById('mode_1').style.display = 'inline';
    document.getElementById('mode_2').style.display = 'inline';
    datemode = 2;
    rangemode(datemode);

})

//查询报表
function search_203() {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', './Test2', false);//同步数据
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var data = JSON.parse(xhr.responseText);
            //刷新
            while (table_203.firstChild) {
                table_203.removeChild(table_203.firstChild);
            }
            //返回查询结果
            for (var i = 0; i < data.length; ++i) {
                const gid = data[i].gid;
                const gname = data[i].gname;
                const gnum = data[i].gnum;
                const price = data[i].price;
                const tr = document.createElement('tr');
                const c3_1 = document.createElement('td');
                c3_1.textContent = gid;
                tr.appendChild(c3_1);
                const c3_2 = document.createElement('td');
                c3_2.textContent = gname;
                tr.appendChild(c3_2);
                const c3_3 = document.createElement('td');
                c3_3.textContent = gnum;
                tr.appendChild(c3_3);
                const c3_4 = document.createElement('td');
                c3_4.textContent = parseFloat(price).toFixed(2);
                tr.appendChild(c3_4);
                if (i == 0) {
                    c3_1.style.color = "rgb(81,132,178)";
                    c3_1.style.fontWeight = "bold";
                    c3_3.style.color = "rgb(81,132,178)";
                    c3_3.style.fontWeight = "bold";
                    c3_4.style.color = "rgb(81,132,178)";
                    c3_4.style.fontWeight = "bold";
                }
                table_203.appendChild(tr);
            }
        }
    }
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    var formdata = "from=" + fromtime + "&to=" + totime + "&formtype=getlog";
    xhr.send(formdata);
}
search_203();

document.getElementById('logsearch').addEventListener('click', function (e) {
    e.preventDefault();
    search_203();
})