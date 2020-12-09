// Post like
$(".add-to-like").click(function (e) {
  e.preventDefault();

  const slugName = $(this).attr("value");
  const url = `/user/api/v1/like/${slugName}`;
  $.post(url, {}, function (data, status) {
    if (data.msg === "success" && status === "success") {
      const oldVal = parseInt($(".cart-count-like").html().slice(1));
      $(".cart-count-like").html(`(${oldVal + 1})`);
    }
  });
});

// Post unlike
$(".trash-like").click(function (e) {
  e.preventDefault();

  const slugName = $(this).attr("name");
  const url = `/user/api/v1/unlike/${slugName}`;
  $.post(url, {}, function (data, status) {
    console.log(data);
    if (data.msg === "success" && status === "success") {
      $("span.cart-count-like").html(`(${data.data.length})`);
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
