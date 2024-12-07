const BackButton = document.getElementById('backward');
const useridInput = document.getElementById('userid');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const usertypeselect = document.getElementsByName('usertype');
const mod1 = document.getElementById('modify1');
const pass1 = document.getElementById('pass1');
let err = 0;

setTimeout(function () {
    const info = document.cookie.split('=')[1];
    const username = info.split('&')[0];
    const password = info.split('&')[1];
    const usertype = info.split('&')[2];
    useridInput.value = usertype;
    usernameInput.value = username;
    passwordInput.value = password;

    if (usertype.charAt(0) == 'B')
        usertypeselect[0].checked = true;
    else if (usertype.charAt(0) == 'C')
        usertypeselect[1].checked = true;
    usertypeselect[0].disabled = true;
    usertypeselect[1].disabled = true;
    passwordInput.disabled = true;
    useridInput.disabled = true;
}, 100);

//表单出现异常时向用户发出警告
function warning(obj, id, warnstmt) {

    obj.style.outline = "solid 2px rgb(213, 82, 118)";
    obj.style.boxShadow = "0 0 0 0.2rem rgba(241, 167, 181, 0.5)";
    document.getElementById(id).textContent = warnstmt;
}

//解除警告的操作
usernameInput.addEventListener('keypress', function (w) {
    w.preventDefault();
    this.style.outline = "solid 2px rgb(170, 212, 248)";
    this.style.boxShadow = "none";
    if (document.getElementById("f1").textContent != '')
        document.getElementById("f1").textContent = '';
    if (w.key == 'Enter')
        submitprocess();
    else
        this.value += w.key;
});

mod1.addEventListener('submit', function (e) {
    e.preventDefault();
    err = 0;
    pass1.textContent = '';
    const username = usernameInput.value;
    // 检查用户名是否为空
    if (username === '') {
        warning(usernameInput, "f1", '用户名不能为空');
        err = 1;
    }

    // 检查用户名
    if (username.length < 4 || username.length > 20) {
        warning(usernameInput, "f1", '用户名长度不符合要求');
        err = 2;
    }

    if (/[\u4e00-\u9fff]+/.test(username)) {
        warning(usernameInput, "f1", '用户名不能包含中文字符');
        err = 2;
    }

    if (/\s/.test(username)) {
        warning(usernameInput, "f1", '用户名不能包含空白字符');
        err = 2;
    }

    if (err)
        return;

    else {
        // 如果验证通过，可以进行表单提交或其他操作
        mod1.submit();
        //核对提交信息
        setTimeout(function () {
            var data = document.cookie.split('=')[1];
            if (data == 'username_is_exist')
                warning(usernameInput, "f1", '该用户名已被注册');
            else if (data == 'succeed')
                pass1.textContent = '     ✅用户名修改成功！';
        }, 100);
    }
});


BackButton.addEventListener('click', function (event) {
    event.preventDefault;
    history.back();
});

