// 获取表单元素
const form = document.querySelector('form');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const usertype = document.getElementsByName('usertype');
const verify = document.getElementById("verify");
const submitbtn = document.getElementById("submitbtn");
const pass = document.getElementById("pass");
let err = 0;

//提交处理过程
function submitprocess() {
    err = 0;
    pass.textContent = '';
    // 检查用户名是否为空
    if (usernameInput.value === '') {
        warning(usernameInput, "f1", '用户名不能为空');
        err = 1;
    }

    // 检查密码是否为空
    if (passwordInput.value === '') {
        warning(passwordInput, "f2", '密码不能为空');
        err = 1;
    }

    if (verify.value === '') {
        warning(verify, "f3", '请确认密码');
        err = 1;
    }

    const username = usernameInput.value;
    const password = passwordInput.value;
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

    // 检查密码强度
    if (password.length < 8 || password.length > 32) {
        warning(passwordInput, "f2", '密码长度不符合要求');
        err = 2;
    }

    if (/\s/.test(password)) {
        warning(passwordInput, "f2", '密码不能包含空白字符');
        err = 2;
    }

    if (!/[A-Z]/.test(password)) {
        warning(passwordInput, "f2", '密码至少包含一个大写字母');
        err = 2;
    }

    if (!/[a-z]/.test(password)) {
        warning(passwordInput, "f2", '密码至少包含一个小写字母');
        err = 2;
    }

    if (!/\d/.test(password)) {
        warning(passwordInput, "f2", '密码至少包含一个数字');
        err = 2;
    }

    //确认密码
    if (password != verify.value) {
        warning(verify, "f3", '确认的密码与设定的密码不一致');
        err = 2;
    }

    if (err)
        return;

    else {
        // 如果验证通过，可以进行表单提交或其他操作
        form.submit();
        //核对提交信息
        setTimeout(function () {
            var data = document.cookie.split('=')[1];
            if (data == 'username_is_exist')
                warning(usernameInput, "f1", '该用户名已被注册');
            else if (data == 'succeed') {
                pass.textContent = '     ✅用户注册成功！';
                usernameInput.disabled = true;
                passwordInput.disabled = true;
                verify.disabled = true;
                submitbtn.disabled = true;
                for (var i = 0; i < usertype.length; ++i) {
                    usertype[i].disabled = true;
                }
            }
        }, 100);
    }
}

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


passwordInput.addEventListener('keypress', function (w) {
    w.preventDefault();
    this.style.outline = "solid 2px rgb(170, 212, 248)";
    this.style.boxShadow = "none";
    if (document.getElementById("f2").textContent != '')
        document.getElementById("f2").textContent = '';
    if (w.key == 'Enter')
        submitprocess();
    else
        this.value += w.key;
});

verify.addEventListener('keypress', function (w) {
    w.preventDefault();
    this.style.outline = "solid 2px rgb(170, 212, 248)";
    this.style.boxShadow = "none";
    if (document.getElementById("f3").textContent != '')
        document.getElementById("f3").textContent = '';
    if (w.key == 'Enter')
        submitprocess();
    else
        this.value += w.key;
});


//控制表单提交
form.addEventListener('submit', function (event) {
    // 阻止表单默认提交行为
    event.preventDefault();
    submitprocess();
});
