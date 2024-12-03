// 获取表单元素
const form = document.querySelector('form');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const verify = document.getElementById("verify");
const submitbtn = document.getElementById("submitbtn");
const pass = document.getElementById("pass");
const back = document.getElementById("back");
let err = 0;
let userstatus = 0;

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

setTimeout(function () {
    const info = document.cookie.split('=')[1];
    if (info != null) {
        usernameInput.value = info;
        usernameInput.disabled = true;
        userstatus = 1;
    }
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

function submitprocess() {
    err = 0;
    pass.textContent = '';
    usernameInput.disabled = false;
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

    const password = passwordInput.value;

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
        // 如果验证通过，进行表单提交
        form.submit();
        if (userstatus == 1)
            usernameInput.disabled = true;
        //核对提交信息
        setTimeout(function () {
            var data = document.cookie.split('=')[1];
            if (data == 'username_not_exist')
                warning(usernameInput, "f1", '用户名不存在');
            else if (data == 'succeed') {
                pass.textContent = '     ✅密码修改成功！';
                usernameInput.disabled = true;
                passwordInput.disabled = true;
                verify.disabled = true;
                submitbtn.disabled = true;
            }
        }, 100);
    }

}

//控制表单提交
form.addEventListener('submit', function (event) {
    // 阻止表单默认提交行为
    event.preventDefault();
    submitprocess();
});

back.addEventListener('click', function (e) {
    e.preventDefault();
    history.back();
})
