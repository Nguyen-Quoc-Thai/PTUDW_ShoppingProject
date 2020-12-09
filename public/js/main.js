(function ($) {
  "use strict";

  // Dropdown on mouse hover
  $(document).ready(function () {
    function toggleNavbarMethod() {
      if ($(window).width() > 768) {
        $(".navbar .dropdown")
          .on("mouseover", function () {
            $(".dropdown-toggle", this).trigger("click");
          })
          .on("mouseout", function () {
            $(".dropdown-toggle", this).trigger("click").blur();
          });
      } else {
        $(".navbar .dropdown").off("mouseover").off("mouseout");
      }
    }
    toggleNavbarMethod();
    $(window).resize(toggleNavbarMethod);
  });

  // Back to top button
  $(window).scroll(function () {
    if ($(this).scrollTop() > 100) {
      $(".back-to-top").fadeIn("slow");
      $(".nav").addClass("nav-scroll");
    } else {
      $(".nav").removeClass("nav-scroll");
      $(".back-to-top").fadeOut("slow");
    }
  });
  $(".back-to-top").click(function () {
    $("html, body").animate({ scrollTop: 0 }, 500);
    return false;
  });

  // Header slider
  $(".header-slider").slick({
    autoplay: true,
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
  });

  // Product Slider 4 Column
  $(".product-slider-4").slick({
    autoplay: true,
    infinite: true,
    dots: false,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  });

  // Product Slider 3 Column
  $(".product-slider-3").slick({
    autoplay: true,
    infinite: true,
    dots: false,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  });

  // Product Detail Slider
  $(".product-slider-single").slick({
    infinite: true,
    autoplay: true,
    dots: false,
    fade: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    asNavFor: ".product-slider-single-nav",
  });
  $(".product-slider-single-nav").slick({
    slidesToShow: 3,
    slidesToScroll: 1,
    dots: false,
    centerMode: true,
    focusOnSelect: true,
    asNavFor: ".product-slider-single",
  });

  // Brand Slider
  $(".brand-slider").slick({
    speed: 5000,
    autoplay: true,
    autoplaySpeed: 0,
    cssEase: "linear",
    slidesToShow: 5,
    slidesToScroll: 1,
    infinite: true,
    swipeToSlide: true,
    centerMode: true,
    focusOnSelect: false,
    arrows: false,
    dots: false,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 300,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  });

  // Review slider
  $(".review-slider").slick({
    autoplay: true,
    dots: false,
    infinite: true,
    slidesToShow: 2,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  });

  // Widget slider
  $(".sidebar-slider").slick({
    autoplay: true,
    dots: false,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
  });

  // Quantity
  $(".qty button").on("click", function () {
    var $button = $(this);
    var oldValue = $button.parent().find("input").val();
    if ($button.hasClass("btn-plus")) {
      var newVal = parseFloat(oldValue) + 1;
      $(".qty button.btn-minus").attr("disabled", false);
    } else {
      if (oldValue > 1) {
        var newVal = parseFloat(oldValue) - 1;
        newVal == 1 ? $button.attr("disabled", true) : "";
      } else {
        newVal = 1;
        $button.attr("disabled", true);
      }
    }
    $button.parent().find("input").val(newVal);
  });

  // Shipping address show hide
  $(".checkout #shipto").change(function () {
    if ($(this).is(":checked")) {
      $(".checkout .shipping-address").slideDown();
    } else {
      $(".checkout .shipping-address").slideUp();
    }
  });

  // Payment methods show hide
  $(".checkout .payment-method .custom-control-input").change(function () {
    if ($(this).prop("checked")) {
      var checkbox_id = $(this).attr("id");
      $(".checkout .payment-method .payment-content").slideUp();
      $("#" + checkbox_id + "-show").slideDown();
      $(".payment-info").css("display", "none");
    }
  });

  // Handle submit place order
  $(".submit-checkout").click(function (e) {
    e.preventDefault();

    if ($(".payment-info").css("display") === "block") {
      return;
    }

    if (!$("#checkout-payment input").is(":checked")) {
      $(".payment-methods")
        .last()
        .after(
          '<span class="text-warning payment-info" style="line-height: 3rem; display: block;">Vui lòng chọn phương thức thanh toán</span>'
        );
      return;
    }
    if ($("#total-quantity>strong").html() == 0) {
      $(".payment-methods")
        .last()
        .after(
          '<span class="text-warning payment-info2" style="line-height: 3rem; display: block;">Không có vật phẩm nào trong giỏ hàng</span>'
        );
      return;
    }

    $("#form-val").submit();
  });

  // Handle logout
  $("#logout").click(function (e) {
    e.preventDefault();
    $("#user-act").submit();
  });

  // Search on resource
  $("#search").click(function (e) {
    e.preventDefault();

    const search = $("input[name=search]").val();

    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("search", search);
    window.location.search = urlParams;
  });

  // Search sort price
  $("a[name=sort]").click(function (e) {
    e.preventDefault();

    const val = $(this).attr("data");

    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("sort", val);
    window.location.search = urlParams;
  });

  // Search filter price
  $(".filter a").click(function (e) {
    e.preventDefault();

    const min = $(this).attr("min");
    const max = $(this).attr("max");

    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("min", min);
    urlParams.set("max", max);
    window.location.search = urlParams;
  });

  // Handle click forgot password
  $(".action-toggle").click(function (e) {
    e.preventDefault();

    const html = `<form class="forgot-form" method="POST" action="/user/forgot">
    <div class="row">
      <div class="col-md-6 user-login">
        <label>E-mail / Username</label>
        <input
          class="form-control"
          type="text"
          name="email"
          value=""
        />
      </div>
      <div class="col-md-12">
        <div class="custom-control custom-checkbox">
          <input
            type="checkbox"
            class="custom-control-input"
            id="newaccount"
          />
          <label class="custom-control-label" for="newaccount"
            >Keep me signed in.</label
          >
          <a href="/user/auth" style="display: inline-block"
            >&nbsp; Sign in?</a
          >
        </div>
      </div>
      <div class="col-md-12">
        <button class="btn" type="submit">Send</button>
      </div>
    </div>
  </form>`;

    $("#form-toggle").html(html);
  });

  // Pagination
  $(".page-item").click(function (e) {
    e.preventDefault();

    if ($(this).hasClass("disabled")) return;
    const val = $(this).attr("value");

    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("page", val);
    window.location.search = urlParams;
  });

  // Global search
  $(".btn-search-global").click(function (e) {
    e.preventDefault();

    const val = $(".text-search-global").val();

    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("q", val);
    window.location.assign(`/products/search?${urlParams}`);
  });

  // Upload avatar btn
  var readURL = function (input) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();

      reader.onload = function (e) {
        $(".profile-pic").attr("src", e.target.result);
      };

      reader.readAsDataURL(input.files[0]);
    }
  };

  $(".file-upload").on("change", function () {
    readURL(this);
  });

  $(".upload-button").on("click", function () {
    $(".file-upload").click();
  });

  // Dashboard logout
  $("#logout>a").click(function (e) {
    $("#logout").submit();
  });

  // Wishlist trash
  $(".trash-like").click(function (e) {
    e.preventDefault();

    const value = $(this).attr("value");

    if (parseInt(value) === 0) {
      const re = confirm("Bạn chắc chắn muốn xóa vật phẩm khỏi giỏ hàng ?");
      if (re == false) return false;
      $(this).parent().parent().css("display", "none");
    }
  });
})(jQuery);
