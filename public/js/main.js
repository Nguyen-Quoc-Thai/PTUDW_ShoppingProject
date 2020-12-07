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

  // Add to cart
  $(".add-to-cart").click(function (e) {
    e.preventDefault();
    const slugName = $(this).attr("value");

    $.post(`/cart/${slugName}`, {}, function (data, status) {
      if (data.msg === "success" && status === "success") {
        const curCount = parseInt(
          $(".cart-count-add").html().replace(/[()]/g, "")
        );

        $(".cart-count-add").html(`(${curCount + 1})`);
      }
    });
  });

  // Update cart
  $(".change-val").click(function (e) {
    e.preventDefault();

    const value = $(this).attr("value");
    const slugName = $(this).attr("name");

    if (parseInt(value) === 0) {
      const re = confirm("Bạn chắc chắn muốn xóa vật phẩm khỏi giỏ hàng ?");
      if (re == false) return false;
      $(this).parent().parent().css("display", "none");
    }

    const request = $.ajax({
      url: `/cart/${slugName}`,
      data: JSON.stringify({
        bias: parseInt(value),
      }),
      type: "PUT",
      contentType: "application/json",
      processData: false,
      xhr: function () {
        return window.XMLHttpRequest == null ||
          new window.XMLHttpRequest().addEventListener == null
          ? new window.ActiveXObject("Microsoft.XMLHTTP")
          : $.ajaxSettings.xhr();
      },
    });

    request.done(function (data, status) {
      if (data.msg === "success" && status === "success") {
        data.data.items.forEach((item) => {
          $(`#${item.itemId}`).html(item.total.toLocaleString("vi-VN"));
        });

        $("#total-cost").html(data.data.totalCost.toLocaleString("vi-VN"));
        $("#total-quantity").html(
          data.data.totalQuantity.toLocaleString("vi-VN")
        );
        $("#shipping-fee").html(data.data.totalQuantity ? "25.000" : "0");
        $("#total-payment").html(
          data.data.totalQuantity
            ? (data.data.totalCost + 25000).toLocaleString("vi-VN")
            : 0
        );
        $(".cart-count-add").html(
          data.data.totalQuantity ? `(${data.data.totalQuantity})` : `(0)`
        );
      }
    });
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

  // Handle comment
  // $("#comment :input").each(function () {
  //   $(this).focus(function () {
  //     $(".comment-warning").remove(this);
  //   });
  // });
  $("#comment").submit(function (e) {
    e.preventDefault();

    const url = $(this).attr("action");
    let data = {};
    $("#comment :input").each(function () {
      data[$(this).attr("name")] = $(this).val();
    });

    if (!data.name || !data.email || !data.review) {
      console.log($("span.comment-warning span").val());
      if ($("span.comment-warning span").val()) return;
      const warning = `<div style="padding: 0 0 10px 0px;" class="comment-warning"><span class="text-warning">Bạn phải điền đây đủ thông tin</span></div>`;
      $(".leave-comment").prepend(warning);
      return;
    }

    $.post(url, { ...data }, function (data, status) {
      console.log(data);
      if (data.msg === "success" && status === "success") {
        const html = `<div class="reviews-submitted" user-id="${data.data.userId}">
        <div class="reviewer">
          ${data.data.name}&nbsp;&nbsp;&nbsp; <span>${data.data.date}</span>
        </div>
        <div class="ratting">
          <i class="fa fa-star"></i>
          <i class="fa fa-star"></i>
          <i class="fa fa-star"></i>
          <i class="fa fa-star"></i>
          <i class="fa fa-star"></i>
        </div>
        <p>${data.data.review}</p>
      </div>`;
        $(".reviews-submit").before(html);
        $("textarea[name='review']").val("");
      }
    });
  });

  // Handle logout
  $("#logout").click(function (e) {
    e.preventDefault();
    $("#user-act").submit();
  });

  // Handle change password
  $("#change-password").submit(function (e) {
    e.preventDefault();

    const url = $(this).attr("action");
    let data = {};
    $("#change-password :input").each(function () {
      data[$(this).attr("name")] = $(this).val();
    });

    const request = $.ajax({
      url,
      data: JSON.stringify({ ...data }),
      type: "PUT",
      contentType: "application/json",
      processData: false,
      xhr: function () {
        return window.XMLHttpRequest == null ||
          new window.XMLHttpRequest().addEventListener == null
          ? new window.ActiveXObject("Microsoft.XMLHTTP")
          : $.ajaxSettings.xhr();
      },
    });

    request.done(function (data, status) {
      if (status === "success") {
        let className = "";

        if (data.msg !== "success") {
          className = "text-warning";
        } else className = "text-success";
        const result = `<div style="padding: 0 0 5px;"><span class="${className}">${data.user}</span></div>`;
        $(".change-password").prepend(result);
      }
    });
  });

  // Handle change info
  $("#change-info").submit(function (e) {
    e.preventDefault();

    let formData = new FormData();
    var d = $("#thumbnail")[0].files[0];
    formData.append("thumbnail", d);

    const url = $(this).attr("action");
    $("#change-info :input").each(function () {
      formData.append($(this).attr("name"), $(this).val());
    });

    const request = $.ajax({
      url,
      data: formData,
      type: "PUT",
      contentType: false,
      processData: false,
      xhr: function () {
        return window.XMLHttpRequest == null ||
          new window.XMLHttpRequest().addEventListener == null
          ? new window.ActiveXObject("Microsoft.XMLHTTP")
          : $.ajaxSettings.xhr();
      },
    });

    request.done(function (data, status) {
      if (status === "success") {
        let className = "";

        if (data.msg !== "success") {
          className = "text-warning";
        } else className = "text-success";
        const result = `<div style="padding: 0 0 5px;"><span class="${className}">${data.user}</span></div>`;
        $(".change-info").prepend(result);
      }
    });
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

  // View history
  $(".view-checkout").click(function (e) {
    e.preventDefault();

    const id = $(this).attr("value");

    $.get(`/checkout/${id}`, function (data) {
      if (data.msg !== "success") return;

      const modal_header = `<div class="modal-dialog modal-dialog-centered modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLongTitle">
            Thông tin mua hàng
          </h5>
          <button
            type="button"
            class="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
        <div class="mb-3"><span><b>Người nhận:</b>&nbsp;${
          data.data.receiver
        }&nbsp;&nbsp;${
        data.data.phone
      }<strong>&nbsp;${data.data.paymentMethod.toUpperCase()}</strong></span></div>
          <div class="table-responsive">
            <table class="table table-bordered">
              <thead class="thead-dark">
                <tr>
                  <th>No</th>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody class="align-middle" id="cart">`;

      const modal_footer = `<tr>
              <td>Sum
              </td>
              <td>
              </td>
              <td></td>
              <td>${data.data.totalQuantity}
              </td>
              <td>${data.data.totalPayment.toLocaleString("vi-VN")} đ</td>
            </tr>
          </tbody>
        </table>
        </div>
        <div class="modal-footer">
        <button
        type="button"
        class="btn btn-secondary"
        data-dismiss="modal"
        >
        Close
        </button>
        </div>
        </div>
        </div>`;

      const modal_content = data.data.items.map((item, index) => {
        return `
                  <tr>
                    <td>
                      ${index + 1}
                    </td>
                    <td>
                      <div class="img d-flex align-items-center">
                        <a href="/products/${item.slugName}"
                          ><img style="width: 45px; height: auto;" src="${
                            item.thumbnail
                          }" alt="Image"
                        /></a>
                        <p class="m-0">${item.name}</p>
                      </div>
                    </td>
                    <td>${item.price}</td>
                    <td>${item.quantity}
                    </td>
                    <td>${item.total.toLocaleString("vi-VN")} đ</td>
                  </tr>
                  `;
      });

      $("#exampleModalCenter").html(
        modal_header + modal_content.reverse().join("") + modal_footer
      );

      $("#show-model").trigger("click");
    });
  });

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
})(jQuery);
