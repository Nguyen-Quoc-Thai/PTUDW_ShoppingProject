// Handle comment
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
    const options = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: false,
      timeZone: "America/Los_Angeles",
    };

    const time = Intl.DateTimeFormat(["ban", "id"], options).format(
      new Date(data.data.date)
    );

    if (data.msg === "success" && status === "success") {
      const html = `<div class="reviews-submitted" user-id="${data.data.userId}">
        <div class="reviewer">
          ${data.data.name}&nbsp;&nbsp;&nbsp; <span>${time}</span>
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
