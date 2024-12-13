
$(document).ready(function () {
    // Function to animate the counter
  function animateCounters() {
    $('.counter-value').each(function () {
      const $this = $(this);
      const countTo = $this.attr('data-count');

      $({ countNum: 0 }).animate(
        { countNum: countTo },
        {
          duration: 2000, // Animation duration in ms
          easing: 'linear', // Easing function
          step: function () {
            $this.text(Math.floor(this.countNum) + '%');
          },
          complete: function () {
            $this.text(this.countNum + '%'); // Ensure the final value is set
          },
        }
      );
    });
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounters();
        }
      });
    },
    {
      threshold: 0.5, // Trigger when 50% of the section is visible
    }
  );

  // Observe the insights section
  const insightsSection = document.getElementById('insights');
  if (insightsSection) {
    observer.observe(insightsSection);
  }


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

  const $animatedElements = $(".animate");

  function handleScrollAnimation() {
    $animatedElements.each(function () {
      const $el = $(this);
      const offset = $el.offset().top;
      const windowBottom = $(window).scrollTop() + $(window).height();

      if (offset <= windowBottom - 100) {
        $el.addClass("in-view");
      } else {
        $el.removeClass("in-view");
      }
    });
  }

  // Attach scroll event
  $(window).on("scroll", handleScrollAnimation);

  // Trigger on page load
  handleScrollAnimation();
});
