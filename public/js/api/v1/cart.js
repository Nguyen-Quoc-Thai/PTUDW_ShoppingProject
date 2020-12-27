// Add to cart
$(".add-to-cart").click(function (e) {
  e.preventDefault();

  if ($(this).hasClass("disabled")) return;
  $(".add-to-cart").addClass("disabled");
  setTimeout(function () {
    $(".add-to-cart").removeClass("disabled");
  }, 500);

  const cart = $(".btn.cart");
  const imgToDrag = $(this).parent().prev().find("img").eq(0);

  if (imgToDrag) {
    const imgClone = imgToDrag
      .clone()
      .offset({
        top: imgToDrag.offset().top,
        left: imgToDrag.offset().left,
      })
      .css({
        opacity: "0.8",
        position: "absolute",
        height: "100px",
        width: "100px",
        "z-index": "101",
      })
      .appendTo($("body"))
      .animate(
        {
          top: cart.offset().top + 10,
          left: cart.offset().left + 10,
          width: 75,
          height: 75,
        },
        1000,
        "easeInOutExpo"
      );

    imgClone.animate(
      {
        width: 0,
        height: 0,
      },
      function () {
        $(this).detach();
      }
    );
  }

  const slugName = $(this).attr("value");

  $.post(`/cart/api/v1/${slugName}`, {}, function (data, status) {
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

  // Loading
  $("#loading").addClass("loading");
  setTimeout(function () {
    $("#loading").removeClass("loading");
  }, 300);

  const request = $.ajax({
    url: `/cart/api/v1/${slugName}`,
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
