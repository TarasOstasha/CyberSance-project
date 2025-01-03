
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

  // forma data
  $("#contactForm").on("submit", function (event) {
    event.preventDefault(); // Prevent form from submitting and refreshing the page

    // Basic Validation
    let isValid = true;
    $("#contactForm input, #contactForm textarea").each(function () {
      if (!$(this).val().trim()) {
        $(this).addClass("is-invalid"); // Add Bootstrap 'is-invalid' class
        toastr.error("Please fill out all required fields."); // Show toastr error
        isValid = false;
        return false; // Break the loop
      } else {
        $(this).removeClass("is-invalid"); // Remove 'is-invalid' if corrected
      }
    });

    // If the form is valid, send data via AJAX
    if (isValid) {
      const formData = {
        name: $("#companyName").val().trim(),
        email: $("#email").val().trim(),
        phone: $("#phone").val().trim(),
        message: $("#message").val().trim(),
      };

      // AJAX request to send form data to the server
      $.ajax({
        url: "send_form.php", // Path to PHP script
        type: "POST",
        data: formData,
        success: function (response) {
          console.log("Server Response:", response);

          // Clear form fields after successful submission
          $("#contactForm")[0].reset();

          // Close the modal (Bootstrap)
          const modal = bootstrap.Modal.getInstance(document.getElementById("contactModal"));
          modal.hide();
          $(".contact-us .nav-link").focus();

          // Show toastr success message
          toastr.success("Thank you for contacting us! We will get back to you soon.");
        },
        error: function (xhr) {
          console.error("Error:", xhr.responseText);

          // Show toastr error message
          toastr.error("Failed to send your message. Please try again.");
        },
      });
    }
  });

  // Remove validation error on input change
  $("#contactForm input, #contactForm textarea").on("input", function () {
    if ($(this).val().trim()) {
      $(this).removeClass("is-invalid");
    }
  });


  // Remove validation error on input change
  $("#contactForm input, #contactForm textarea").on("input", function () {
    if ($(this).val().trim()) {
      $(this).removeClass("is-invalid");
    }
  });

  // load header and footer
  function loadComponent(selector, url) {
    $.get(url)
      .done(function (data) {
        $(selector).html(data);
        console.log(`${url} loaded successfully.`);
      })
      .fail(function (xhr, status, error) {
        console.error(`Error loading ${url}:`, status, error);
      });
  }

  loadComponent('header', '../components/header.html');
  loadComponent('footer', '../components/footer.html');

  // parallax why choose us
  $(window).on("scroll", function () {
    const scrollPosition = $(window).scrollTop();
    $(".call-to-action").css({
      "background-position": `center ${scrollPosition * 0.5}px`, // Parallax speed
    });
  });
  $(document).on('click', '.footer a', function (e) {
    e.preventDefault();
    console.log('Footer link clicked');
    const hash = $(this).attr('href');
    window.location.href = `/${hash}`;
  });

});


