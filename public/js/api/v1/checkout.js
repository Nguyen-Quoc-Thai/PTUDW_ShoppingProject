// View history
$(".view-checkout").click(function (e) {
  e.preventDefault();

  const id = $(this).attr("value");

  $.get(`/checkout/api/v1/${id}`, function (data) {
    if (data.msg !== "success") return;

    const modal_header = `<div class="modal-dialog modal-dialog-centered modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header" style="background-color: honeydew;">
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
                    <th>Sản phẩm</th>
                    <th>Giá</th>
                    <th>Số lượng</th>
                    <th>Tổng tiền</th>
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
      modal_header + modal_content.join("") + modal_footer
    );

    $("#show-model").trigger("click");
  });
});

// Get buy now
$(".buy-now").click(function (e) {
  e.preventDefault();

  // Loading
  $("#loading").addClass("loading");
  setTimeout(function () {
    $("#loading").removeClass("loading");
  }, 700);

  const slugName = $(this).attr("value");

  $.post(`/cart/api/v1/${slugName}`, {}, function (data, status) {
    if (data.msg === "success" && status === "success") {
      const curCount = parseInt(
        $(".cart-count-add").html().replace(/[()]/g, "")
      );

      $(".cart-count-add").html(`(${curCount + 1})`);

      window.location.replace("/checkout");
    }
  });
});
