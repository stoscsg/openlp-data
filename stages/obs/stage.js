window.OpenLP = {
  loadService: function (event) {
    $.getJSON(
      "/api/service/list",
      function (data, status) {

        OpenLP.nextSong = "";
        $("#notes").html("");

        for (idx in data.results.items) {
          idx = parseInt(idx, 10);
          const item = data.results.items[idx];

          if (item["selected"]) {
            $("#notes").html(item["notes"].replace(/\n/g, "<br />"));
            if (data.results.items.length > idx + 1) {
              OpenLP.nextSong = data.results.items[idx + 1]["title"];
            }
            break;
          }
        }

        OpenLP.updateSlide();
      }
    );
  },

  loadSlides: function (event) {
    $.getJSON(
      "/api/controller/live/text",
      function (data, status) {

        OpenLP.currentSlides = data.results.slides;
        OpenLP.currentSlide = 0;
        OpenLP.currentTags = Array();
        var div = $("#verseorder");
        div.html("");

        var tag = "";
        var tags = 0;
        var lastChange = 0;

        $.each(data.results.slides, function(idx, slide) {

          var prevtag = tag;
          tag = slide["tag"];
          if (tag !== prevtag) {
            lastChange = idx;
            tags++;
            div.append("&nbsp;<span>");
            $("#verseorder span").last().attr("id", "tag" + tags).text(tag);
          }
          else {
            if ((slide["text"] === data.results.slides[lastChange]["text"]) &&
              (data.results.slides.length >= idx + (idx - lastChange))) {
              var match = true;
              for (var idx2 = 0; idx2 < idx - lastChange; idx2++) {
                if(data.results.slides[lastChange + idx2]["text"] != data.results.slides[idx + idx2]["text"]) {
                  match = false;
                  break;
                }
              }

              if (match) {
                lastChange = idx;
                tags++;
                div.append("&nbsp;<span>");
                $("#verseorder span").last().attr("id", "tag" + tags).text(tag);
              }
            }
          }

          OpenLP.currentTags[idx] = tags;

          if (slide["selected"]) {
            OpenLP.currentSlide = idx;
          }
        });

        OpenLP.loadService();
      }
    );
  },

  updateSlide: function() {

    $("#verseorder span").removeClass("currenttag");
    const currentTagId = "tag" + OpenLP.currentTags[OpenLP.currentSlide];
    $("#"+currentTagId).addClass("currenttag");

    var slide = OpenLP.currentSlides[OpenLP.currentSlide];

    var text = slide["html"] || "";

    if (slide["img"]) {
      OpenLP.loadSlide();
      text = "";
    } else {
      var img = document.getElementById('image');
      img.src = "";
    }

    text = text.replace(/\n/g, "<br />");
    $("#currentslide").html(text);

    // Handling next slides
    text = "";
    if (OpenLP.currentSlide < OpenLP.currentSlides.length - 1) {
      for (var idx = OpenLP.currentSlide + 1; idx < OpenLP.currentSlides.length; idx++) {
        if (OpenLP.currentTags[idx] != OpenLP.currentTags[idx - 1]) {
          text += "<p class=\"nextslide\">";
        }

        text += OpenLP.currentSlides[idx]["title"] || OpenLP.currentSlides[idx]["text"];

        if (OpenLP.currentTags[idx] != OpenLP.currentTags[idx - 1])
          text += "</p>";
        else
          text += "<br />";
      }
      text = text.replace(/\n/g, "<br />");
      $("#nextslide").html(text);
    } else {
      text = "<p class=\"nextslide\">" + $("#next-text").val() + ": " + OpenLP.nextSong + "</p>";
      $("#nextslide").html(text);
    }
    // Set page title to current slide title
    document.title = OpenLP.currentSlides[OpenLP.currentSlide]["title"] || "Next Slide";
  },

  updateClock: function(data) {
    var div = $("#clock");
    var t = new Date();
    var h = t.getHours();
    if (data.results.twelve && h > 12)
      h = h - 12;
    var m = t.getMinutes();
    if (m < 10)
      m = '0' + m + '';
    div.html(h + ":" + m);
  },

  loadSlide: function (event) {
    $.getJSON(
      "/main/image",
      function (data, status) {
        var img = document.getElementById('image');
        img.src = data.results.slide_image;
        img.style.display = 'block';
      }
    );
  },

  pollServer: function () {
    $.getJSON(
      "/api/poll",
      function (data, status) {
        OpenLP.updateClock(data);

        if (OpenLP.currentItem != data.results.item ||
            OpenLP.currentService != data.results.service) {
          OpenLP.currentItem = data.results.item;
          OpenLP.currentService = data.results.service;
          OpenLP.loadSlides();
        } else if (OpenLP.currentSlide != data.results.slide) {
          OpenLP.currentSlide = parseInt(data.results.slide, 10);
          OpenLP.updateSlide();
        }
      }
    );
  }
};

$.ajaxSetup({ cache: false });
setInterval("OpenLP.pollServer();", 500);
OpenLP.pollServer();
