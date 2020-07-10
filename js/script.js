const loadData = (page=1) => {
  searchTags = $('#searchTags').val() || 'colorful';
  tagsParam = searchTags;
  let pageParam = page === 1 ? '' : `&page=${page}`;
  apiURL = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=20e5bc680a66df4de1440248313a6a41&tags=${tagsParam}&format=json&nojsoncallback=1&per_page=24${pageParam}`;
  $.getJSON(apiURL, ( data ) => {
      console.log('Got data');
      console.log(data.photos.photo);
      images = data.photos.photo;
      images.forEach(image => {
        let { farm, server, id, secret, owner } = image;
        imgURL = `https://farm${farm}.staticflickr.com/${server}/${id}_${secret}_w.jpg`;
        console.log('imgURL', imgURL);
        imgTitle = image.title.substr(0,50);
        imgLink = `https://www.flickr.com/photos/placeholder`; // TODO get image links

      });
      
  });
};

loadData();