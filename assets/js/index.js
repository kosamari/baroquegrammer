$(function() {
  const PARENT_FACE_WIDTH = 135; // The width of the face hole. Gross.

  var imageFace = $('#image-face'); // The element the face is planted onto
  var imagePreview = $('#image-preview');

  $('#image-file-field').change(function() {
    var data = $(this)[0].files[0];

    showPreview(data);
  });

  $('#image-upload').click(function(event) {
    event.preventDefault();

    processFace();
  });

  // Return how big the original face is in comparision with the "face hole".
  // Again, gross.
  function findScale(face) {
    return (PARENT_FACE_WIDTH / face.width);
  }

  function placeFace() {
    var imagePath = imagePreview.attr('src');

    imageFace.attr('src', imagePath);
  }

  // This is where the face detection / image "validation" is done.
  function processFace() {
    imagePreview.faceDetection({
      complete: function(faces) {
        var face = randomFace(faces);

        if (face) {
          placeFace();
          sizeFace(face);
        } else {
          alert('Your image was bullshit');
        }
      }
    });
  }

  // I haven't gone ahead and implemented a way to actually target a face so I'm
  // just picking a random face that's detected because I hate humanity.
  function randomFace(faces) {
    return $.rand(faces);
  }

  // This sets a preview field that's used for facial detection. A future
  // refactor could probably remove this step altogether and do everything on
  // the fly but that's a step for another day y'all.
  function showPreview(data) {
    var reader = new FileReader();

    reader.onload = function(event) {
      imagePreview.attr('src', event.target.result)
    }

    reader.readAsDataURL(data);
  }

  // Actually size the face behind the main image
  function sizeFace(face) {
    var scale = findScale(face);
    var marginLeft = face.x * scale;
    var marginTop = face.y * scale;

    imageFace.
      css('margin-left', -(marginLeft)).
      css('margin-top', -(marginTop)).
      css('transform', 'scale(' + scale + ')');
  }

  // Let's make a random function that we're stealing from Stack Overflow
  // because my time is worth something to me and you don't know me.
  $.rand = function(arg) {
    if ($.isArray(arg)) {
      return arg[$.rand(arg.length)];
    } else if (typeof arg === "number") {
      return Math.floor(Math.random() * arg);
    } else {
      return 4;  // chosen by fair dice roll
    }
  };
});
