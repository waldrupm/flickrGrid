
const loadData = (page=1, searchTags='flowers') => {
  let photoRows = $('#photoRows');
  photoRows.empty();
  let tagsParam = searchTags;
  let pageParam = page === 1 ? '' : `&page=${page}`;
  apiURL = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=20e5bc680a66df4de1440248313a6a41&tags=${tagsParam}&format=json&safe_search=1&nojsoncallback=1&per_page=24${pageParam}`;
  // console.log('apiURL', apiURL)
  $.getJSON(apiURL, ( data ) => {
      // console.log('Got data');
      // console.log(data.photos.photo);
      images = data.photos.photo;
      images.forEach( image => {
        let { farm, server, id, secret, owner } = image;
        imgURL = `https://farm${farm}.staticflickr.com/${server}/${id}_${secret}_w.jpg`;
        // handle cases where image won't load even with good api data, 
        // in this case there will be less than 24 photos but it looks better than an image that isn't loading.
        if (farm === 0) return;
        // console.log('imgURL', imgURL);
        imgTitle = image.title.length > 17 ? (image.title.substr(0, 17) + "...") : image.title;
        imgCardHTML = `
        <div class="col-md-4">
          <div class="card mb-4 text-white bg-dark">
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
let currentTags;
let currentPage;

const changeTags = () => {
  // Handle multiple tags for search
  $('#introText').hide();
  currentTags = $('#searchTags').val();
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
  $('#introText').text(`Showing photos for ${currentTags}`);
  $('#introText').show();
  loadData(page=1, searchTags=tagsParam);
};
$('#tagsForm').submit((event) => {
  event.preventDefault();
  changeTags();
});
$('#changeTagsButton').click(changeTags);

loadData();