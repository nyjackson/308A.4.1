import {
  appendCarousel,
  clear,
  createCarouselItem,
  start,
} from "./Carousel.js";

// The breed selection input element.
const breedSelect = document.getElementById("breedSelect");
// The information section div element.
const infoDump = document.getElementById("infoDump");
// The progress bar div element.
const progressBar = document.getElementById("progressBar");
// The get favourites button element.
const getFavouritesBtn = document.getElementById("getFavouritesBtn");

const API_KEY =
  "live_OhZHbAsMzJK6UuuMHkxqGT9e9f4F6kgOwpvrWkEdc1lM1Al7dQaXwCwxibzzwpWy";

/**
 * 4. Change all of your fetch() functions to axios!
 * - axios has already been imported for you within index.js.
 * - If you've done everything correctly up to this point, this should be simple.
 * - If it is not simple, take a moment to re-evaluate your original code.
 * - Hint: Axios has the ability to set default headers. Use this to your advantage
 *   by setting a default header with your API key so that you do not have to
 *   send it manually with all of your requests! You can also set a default base URL!
 */


async function initialLoad(){
  const breeds = await axios("/v1/breeds", {baseURL: "https://api.thecatapi.com", headers: {apiKey:API_KEY}})
  //console.log(breeds)
  const jsonBreeds = breeds.data
  for(let i = 0; i< jsonBreeds.length;i++){
    const breedType = jsonBreeds[i]
    const breedOption = document.createElement("option")
    breedOption.value = breedType.id
    breedOption.textContent = breedType.name
    breedSelect.appendChild(breedOption)
  }
 start()
}
initialLoad()

async function getCatInfo(id) {
  const breedResponse = await axios("/v1/breeds", {baseURL: "https://api.thecatapi.com", headers: {apiKey:API_KEY}})
  const jsonBreeds = breedResponse.data;
  for (let i = 0; i < jsonBreeds.length; i++) {
    const breedType = jsonBreeds[i];
    if (id == breedType.id) {
      return breedType;
    }
  }
}

async function getCatPictures(event) {
  clear();
  //let breedType = event.target.value;
  //const apiLink = await axios("/v1/images/search?limit=10", {baseURL: "https://api.thecatapi.com", headers: {apiKey:API_KEY, breed_ids:breedType}})
  let link =
    "https://api.thecatapi.com/v1/images/search?limit=10&breed_ids=";
  let breedType = event.target.value;
  link += `${breedType}`;
  let apiLink = await axios(link, {headers: {apiKey:API_KEY}})

  const jsonCats = apiLink.data
  for (let i = 0; i < jsonCats.length; i++) {
    let catPic = jsonCats[i];
    const catElt = document.createElement("img");
    catElt.src = catPic.url;
    const cat = createCarouselItem(catElt.src, breedType.id, catPic.id);
    appendCarousel(cat);
  }
  const jsonInfo = await getCatInfo(breedType);
  console.log(jsonInfo)
  const cat = craftInfoDump(jsonInfo)
  infoDump.appendChild(cat)
}

breedSelect.addEventListener("click", getCatPictures);

function craftInfoDump(info) {
  while(infoDump.firstChild){
    infoDump.removeChild(infoDump.firstChild)
  }
  const frag = document.createDocumentFragment();
  const h1 = document.createElement("h1");
  const description = document.createElement("p");
  h1.textContent = info.name;
  description.textContent = info.description;

  frag.appendChild(h1);
  frag.appendChild(description);
  return frag;
}
/**
 * 5. Add axios interceptors to log the time between request and response to the console.
 * - Hint: you already have access to code that does this!
 * - Add a console.log statement to indicate when requests begin.
 * - As an added challenge, try to do this on your own without referencing the lesson material.
 */
axios.interceptors.request.use(req => {
    console.log("Request Started")
    req.metadata = req.metadata || {}
    req.metadata.startTime = new Date().getTime()
    progressBar.style.width = "0%"
    return req
});
axios.interceptors.response.use(res => {
    console.log("Response Reached")
    res.config.metadata.endTime = new Date().getTime()
    res.config.metadata.durationInMS = new Date().getTime() - res.config.metadata.startTime
    console.log(`The request took ${res.config.metadata.durationInMS} ms.`)
    return res
}, (error) => {
        error.config.metadata.endTime = new Date().getTime();
        error.config.metadata.durationInMS = error.config.metadata.endTime - error.config.metadata.startTime;
        console.log(`Request took ${error.config.metadata.durationInMS} ms.`)
        throw error;
});

/**
 * 6. Next, we'll create a progress bar to indicate the request is in progress.
 * - The progressBar element has already been created for you.
 *  - You need only to modify its "width" style property to align with the request progress.
 * - In your request interceptor, set the width of the progressBar element to 0%.
 *  - This is to reset the progress with each request.
 * - Research the axios onDownloadProgress config option.
 * - Create a function "updateProgress" that receives a ProgressEvent object.
 *  - Pass this function to the axios onDownloadProgress config option in your event handler.
 * - console.log your ProgressEvent object within updateProgess, and familiarize yourself with its structure.
 *  - Update the progress of the request using the properties you are given.
 * - Note that we are not downloading a lot of data, so onDownloadProgress will likely only fire
 *   once or twice per request to this API. This is still a concept worth familiarizing yourself
 *   with for future projects.
 */
async function updateProgress(progEvt){

}
/**
 * 7. As a final element of progress indication, add the following to your axios interceptors:
 * - In your request interceptor, set the body element's cursor style to "progress."
 * - In your response interceptor, remove the progress cursor style from the body element.
 */
/**
 * 8. To practice posting data, we'll create a system to "favourite" certain images.
 * - The skeleton of this function has already been created for you.
 * - This function is used within Carousel.js to add the event listener as items are created.
 *  - This is why we use the export keyword for this function.
 * - Post to the cat API's favourites endpoint with the given ID.
 * - The API documentation gives examples of this functionality using fetch(); use Axios!
 * - Add additional logic to this function such that if the image is already favourited,
 *   you delete that favourite using the API, giving this function "toggle" functionality.
 * - You can call this function by clicking on the heart at the top right of any image.
 */
export async function favourite(imgId) {
  // your code here
}

/**
 * 9. Test your favourite() function by creating a getFavourites() function.
 * - Use Axios to get all of your favourites from the cat API.
 * - Clear the carousel and display your favourites when the button is clicked.
 *  - You will have to bind this event listener to getFavouritesBtn yourself.
 *  - Hint: you already have all of the logic built for building a carousel.
 *    If that isn't in its own function, maybe it should be so you don't have to
 *    repeat yourself in this section.
 */

/**
 * 10. Test your site, thoroughly!
 * - What happens when you try to load the Malayan breed?
 *  - If this is working, good job! If not, look for the reason why and fix it!
 * - Test other breeds as well. Not every breed has the same data available, so
 *   your code should account for this.
 */
