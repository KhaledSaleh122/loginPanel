const err_msg = document.getElementById("error-msg");
$('#username').on('input', isUserNameValid);
$("#email").on('input', isEmailValid);
$("#password").on('input', isPasswordValid)
$("#confirm-password").on('input', isPasswordValid)

function isUserNameValid(){
  if(!checkUserName()){
    err_msg.innerText = 'Username must start with letter , and it\'s must contain only letters and digits';
    return false;
  }else{
    err_msg.innerText = '';
    return true;
  }
}
function checkUserName(){
  const text = document.getElementById('username').value;
  const hasNonAlphaNumericChars = /[^A-Za-z0-9]/g.test(text);
  const isValid = /^[A-Za-z]+[0-9]*[A-Za-z0-9]*$/.test(text);
  if (hasNonAlphaNumericChars || !isValid) {
    return false;
  } else {
    return true;
  }
}

function isEmailValid(){
  if(!checkEmail()){
    err_msg.innerText = 'Email format is not Valid';
    return false;
  }else{
    err_msg.innerText = '';
    return true;
  }
}
function checkEmail(){
  const email = document.getElementById("email").value;
  const isEmailValid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
  if(!isEmailValid){
    return false;
  }else{
    return true
  }
}

function isPasswordValid(){
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirm-password").value;  
  if(!checkPasswordsLength(password)){
    err_msg.innerText = 'password Must be More than 6 characters';
    return false;
  }else{
    err_msg.innerText = '';
    if(!checkPasswordsEqual(password,confirmPassword)){
      err_msg.innerText = 'Password don\'t matching!';
      return false;
    }else{
      err_msg.innerText = '';
      return true;
    }
  }
}


function checkPasswordsLength(password) {
    if (password.length >= 6) {
        return true
    } else {
      return false
    }
}
function checkPasswordsEqual(password,confirmPassword) {
  if (password === confirmPassword) {
    return true;
  } else {
    return false;
  }
}
const register_form = document.getElementById("register-form");

register_form.addEventListener("submit", checkEmpty);

function checkEmpty(e){
  if($('#username').val() && $('#email').val() && $('#password').val() && $('#confirm-password').val()){
    if(isUserNameValid()){
      if(isEmailValid()){
        if(isPasswordValid()){
          const formData = {
            name: $("#username").val(),
            email: $("#email").val(),
            password: $("#password").val(),
            confirm_password :$("#confirm-password").val()
          };
          $.ajax({
            type: "POST",
            url: "/register",
            data: formData,
            dataType: "json",
            encode: true,
          }).done(function (data) {
            err_msg.innerText = data[0].err;
            console.log(!data[0].err)
            if(!data[0].err){
              window.location.href = '/home'
            }else if(data[0].pass){
              window.location.href = '/'
            }
          });
        }
      }
    }
  }else{
    err_msg.innerText = 'All fields required!';
  }
  if(e){
    e.preventDefault();
  }
}