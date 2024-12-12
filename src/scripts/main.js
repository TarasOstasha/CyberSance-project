//**-native javascript-**//
// var btnHeader = document.querySelector('.navbar__btn');
// btnHeader.addEventListener('click', function () {
//   var menu = document.querySelector('.navbar__menuHeader');
//   menu.classList.toggle('open__menuHeader');
//   this.classList.toggle('navbar__btnOpen');
// });
//**-realize on jQuery-**//
$(document).ready(function () {
  //**btn scroll up fade in on scroll**//
  $('body').prepend('<a href="#" class="back-to-top">Back to Top</a>');
  $(window).scroll(function () {
    if ($(window).scrollTop() > 300) {
      $('a.back-to-top').fadeIn('slow');
    } else {
      $('a.back-to-top').fadeOut('slow');
    }
  });
  // btn scroll up
  $('a.back-to-top').click(function () {
    console.log('works');
    $('html, body').animate(
      {
        scrollTop: 0,
      },
      1000,
    );
    return false;
  });

  // **scroll menu**//
  $('a:not(.left, .right, .back-to-top)[href^="#"]').click(function () {
    var el = $(this).attr('href'); // Get the target element's ID or anchor
    var target = $(el); // Select the target element

    if (target.length) {
      // Check if the target exists
      $('html, body').animate(
        {
          scrollTop: target.offset().top, // Scroll to the target's position
        },
        2000,
      );
    } else {
      console.warn(`Target element not found for href: ${el}`);
    }

    return false;
  });

  // ** CONTACT FORM ** //
  $('#form-site').submit(function (e) {
    console.log(e);
    e.preventDefault();
    //validation -> make a function
    var name = $('[name="name"]').val();
    var phone = $('[name="phone"]').val();
    var email = $('[name="email"]').val();
    var nameReg = /^[a-zA-Z ]{2,30}$/;
    var phoneReg =
      /^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/;
    var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    var nameFormat = nameReg.test(name);
    var numberFormat = phoneReg.test(phone);
    var emailFormat = emailReg.test(email);
    if (!emailFormat) {
      toastr.error('Please Fill Out Email');
      return;
    } else if (!numberFormat) {
      toastr.error('Please Fill Out Correct Phone Number');
      return;
    } else if (!nameFormat) {
      toastr.error('Please Fill Out Correct Name');
      return;
    } else {
      $.ajax({
        type: 'POST',
        url: 'http://localhost:8000/email',
        data: $(this).serialize(),
      })
        .done(function () {
          toastr.success(
            'Thanks for your email. \n I will contact you as soon as possible',
            'Notification',
          );
          $('#form-site').get(0).reset();
          $('#myModal').modal('hide');
        })
        .fail(function () {
          toastr.error('ERROR');
        });
      return false;
    }
  });
});
