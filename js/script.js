// API handling portion. 
//Should probably be broken down a bit more, refactoring parts out into their own functions.
// Could refactor out a buildImageCard function to get card HTML, 
// Unfortunately, jquery ajax calls are kind of ugly and this could be simpler with fetch. 
const loadData = (page = 1, searchTags = 'flowers') => {
  if (page === 1) {
    $('#previousPageButton').prop("disabled", true);
  } else {
    $('#previousPageButton').prop("disabled", false);
  }
  let photoRows = $('#photoRows');
  photoRows.empty();
  let tagsParam = searchTags;
  let pageParam = page === 1 ? '' : `&page=${page}`;
  apiURL = `https://www.flickr.com/services/rest/?method=flickr.photos.search1&api_key=20e5bc680a66df4de1440248313a6a41&tags=${tagsParam}&format=json&safe_search=1&nojsoncallback=1&per_page=24${pageParam}`;
  // console.log('apiURL', apiURL)
  $.getJSON(apiURL, (data) => {
    // console.log('Got data');
    // console.log(data.photos.photo);
    images = data.photos.photo;
    images.forEach(image => {
      let { farm, server, id, secret, owner } = image;
      imgURL = `https://farm${farm}.staticflickr.com/${server}/${id}_${secret}_w.jpg`;
      // handle cases where image won't load even with good api data, 
      // in this case there will be less than 24 photos but it looks better than an image that isn't loading.
      if (farm === 0) return;
      // console.log('imgURL', imgURL);
      imgTitle = image.title.length > 25 ? (image.title.substr(0, 25) + "...") : image.title;
      imgCardHTML = `
        <div class="col-md-4">
          <div class="card mb-4 text-white bg-info">
            <img class="card-img-top card-preview-img" src="${imgURL}" alt="Card image cap">
            <div class="card-body">
                <p class="card-text">${imgTitle}</p>
            </div>
          </div>
        </div> `; // End image card html
      photoRows.append(imgCardHTML);
    });

  });
};

// Helper to parse the tags entered into the form. Allows multiple tags separated by commas.
// Trims and joins entered tags for use in API calls
const parseTags = () => {
  currentTags = $('#searchTags').val() || 'flowers';
  let tagsParam = '';
  if (currentTags.includes(',')) {
    // parse tags
    let tags = currentTags.split(',');
    console.log('tags', tags)
    if (tags.length > 1) {
      // format tags
      tags = tags.map(tag => {
        tag = tag.trim();
        tag = encodeURIComponent(tag);
        return tag;
      });
      tagsParam = tags.join(',');
      // console.log('tagsParam', tagsParam)
    }
  } else {
    tagsParam += currentTags;
  }
  return tagsParam;
};

// Globals
let currentTags;
let currentPage = 1;

// User changed the tags in the search, load new data
const changeTags = () => {
  // Handle multiple tags for search
  $('#introText').hide();
  let tagsParam = parseTags();
  $('#introText').text(`Showing photos for "${$('#searchTags').val()}"`);
  $('#introText').show();
  loadData(page = 1, searchTags = tagsParam);
};

// helper function to update the page number on the bottom of the grid
const updatePageDisplay = () => {
  $('#pageNumber').text(`Page ${currentPage}`);
};

// Handle app events such as hitting enter in tags form, clicking submit button for tag search, next / previous pages
$('#tagsForm').submit((event) => {
  event.preventDefault();
  currentPage = 1;
  changeTags();
});
$('#changeTagsButton').click(() => {
    currentPage = 1;
    changeTags;
});
$('#nextPageButton').click(function () {
  let searchTags = parseTags();
  currentPage += 1;
  loadData(page=currentPage, searchTags=searchTags);
  updatePageDisplay();
});
$('#previousPageButton').click(function () {
  if (currentPage > 1) {
    let searchTags = parseTags();
    currentPage -= 1;
    loadData(page=currentPage, searchTags=searchTags);
    updatePageDisplay();
  }
});

// Load 'flowers' search on first visit.
loadData();