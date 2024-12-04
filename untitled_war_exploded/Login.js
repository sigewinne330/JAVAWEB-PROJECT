// 获取表单元素
const form = document.querySelector('form');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const formtype = document.getElementById('formtype')
let err = 0;

//提交处理过程
function submitprocess() {
    err = 0;
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

    if (err)
        return;
    else {
        // 如果验证通过，表单提交
        form.submit();
        //核对提交信息
        setTimeout(function () {
            var data = document.cookie.split('=')[1];
            if (data == 'username_not_exist')
                warning(usernameInput, "f1", '用户名不存在');
            else if (data == 'password_incorrect')
                warning(passwordInput, "f2", '密码错误');
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

//控制表单提交
form.addEventListener('submit', function (event) {
    // 阻止表单默认提交行为
    event.preventDefault();
    submitprocess();
});