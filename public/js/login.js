const err_msg = document.getElementById("error-msg");


$('#login-form').on("submit", checkEmpty);

function checkEmpty(e){
  if($('#username').val()  && $('#password').val()){
    const formData = {
      name: $("#username").val(),
      password: $("#password").val(),
    };
    $.ajax({
      type: "POST",
      url: "/",
      data: formData,
      dataType: "json",
      encode: true,
    }).done(function (data) {
      err_msg.innerText = data[0].err;
      if(!data[0].err){
        window.location.href = '/home'
      }
    });
  }else{
    err_msg.innerText = 'All fields required!';
  }
  if(e){
    e.preventDefault();
  }
}