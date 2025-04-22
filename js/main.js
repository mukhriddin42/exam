const usersContainer = document.getElementById("users-container");
const loadMoreBtn = document.getElementById("load-more-btn");
const followingBtn = document.getElementById("following-btn");
const followed = document.getElementById("liked");
const followedElContainer = document.getElementById("liked-elements-container");
const closeLikedBtn = document.getElementById("close-liked-btn");
const overlay = document.getElementById("overlay");

closeLikedBtn.addEventListener("click", () => {
    followed.classList.add("hidden");
    overlay.classList.add("hidden");
})


let limit = 5;

window.addEventListener("DOMContentLoaded", () => {
  getData(limit);
});

loadMoreBtn.addEventListener("click", (e) => {
    e.preventDefault();
    limit = 0;
    limit += 5;
    getData(limit)
})

async function getData(param) {
  const url = `https://randomuser.me/api/?results=${param}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    const data = json.results;
    //   console.log(data);
    displayData(data);
  } catch (error) {
    console.error(error.message);
  }
}

function displayData(data) {
    data.forEach(element => {
        renderCard(element);
    });
}

function renderCard(item) {
    // console.log(item);
    // const nameId = item.name.first;
    const userItem = document.createElement("div");
    userItem.classList.add("user-item")
    userItem.innerHTML = `
            <div class="image-box">
              <img src="${item.picture.large}" alt="" />
            </div>
            <h2 class="fullname">${item.name.first} ${item.name.last}</h2>
            <p class="email">${item.email}</p>
            <p class="gender">
              <i class="fa-solid fa-person-half-dress ${item.gender}"></i> ${item.gender}
            </p>
            <p class="state"><i class="fa-solid fa-globe"></i> ${item.location.country}</p>
            <button onclick="follow('${item.email}', '${item.name.first}', '${item.name.last}', '${item.email}', '${item.gender}', '${item.picture.large}')" data-id="" class="btn follow-btn">
              ${checkIsFollowed(item.email)}
            </button>
        `;
    usersContainer.appendChild(userItem);
}


function follow(id, firstName, lastName, email, gender, imgUrl) {
    const obj = {
        id,
        firstName, 
        lastName, 
        email, 
        gender, 
        imgUrl
    };
    let followedUsers = JSON.parse(localStorage.getItem("followed") || "[]");

    const isFollowed = followedUsers.some(user => user.id === id)

    if(!isFollowed) {
        followedUsers.push(obj);
        localStorage.setItem("followed", JSON.stringify(followedUsers));
        console.log(`${firstName} followed!`);
    } else {
        followedUsers = followedUsers.filter(user => user.id !== id);
        localStorage.setItem("followed", JSON.stringify(followedUsers));
        console.log(`${firstName} unfollowed`);
    }
    checkIsFollowed(firstName);
}

function checkIsFollowed(id) {
    const followedUsers = JSON.parse(localStorage.getItem("followed") || "[]");
    return followedUsers.some(user => user.id === id) ? "Followed" : "Follow"
}





// Follow qilingan userlar
function renderFollowedUsers() {
  const followedUsers = JSON.parse(localStorage.getItem("followed") || "[]");

  followedElContainer.innerHTML = "";
  if(followedUsers.length === 0) {
    followedElContainer.innerHTML = "<h2>No followed users yet</h2>";
    return;
  }

  followedUsers.forEach(user => {
    const followedItem = document.createElement("div");
    followedItem.classList.add("user-item")
    followedItem.innerHTML = `
            <div class="image-box">
              <img src="${user.imgUrl}" alt="" />
            </div>
            <h2 class="fullname">${user.firstName} ${user.lastName}</h2>
            <p class="email">${user.email}</p>
            <p class="gender">
              <i class="fa-solid fa-person-half-dress ${user.gender}"></i> ${user.gender}
            </p>
            <p class="state"><i class="fa-solid fa-globe"></i> ${user.country}</p>
        `;
    followedElContainer.appendChild(followedItem);
  });
}


followingBtn.addEventListener("click", () => {
  renderFollowedUsers();
  followed.classList.remove("hidden");
  overlay.classList.remove("hidden");
})