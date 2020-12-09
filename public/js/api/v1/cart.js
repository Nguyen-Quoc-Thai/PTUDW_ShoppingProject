// Add to cart
$(".add-to-cart").click(function (e) {
  e.preventDefault();
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
