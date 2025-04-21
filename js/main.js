const usersContainer = document.getElementById("users-container");
const loadMoreBtn = document.getElementById("load-more-btn");
const followingBtn = document.getElementById("following-btn");
const followed = document.getElementById("liked");
const closeLikedBtn = document.getElementById("close-liked-btn");
const overlay = document.getElementById("overlay");

closeLikedBtn.addEventListener("click", () => {
    followed.classList.add("hidden");
    overlay.classList.add("hidden");
})


let limit = 10;

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
    console.log(item);
    const nameId = item.name.first;
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
            <button onclick="follow('${item.name.first}', '${item.name.last}', '${item.email}', '${item.gender}', '${item.picture.large}')" data-id="" class="btn follow-btn">${checkIsFollowed(nameId)}</button>
        `;
    usersContainer.appendChild(userItem);
}


function follow(firstName, lastName, email, gender, imgUrl) {
    const obj = {
        firstName, 
        lastName, 
        email, 
        gender, 
        imgUrl
    }
    console.log("Following");
    console.log("mana shu object: ", obj);
    const followedUsersObjs = JSON.parse(localStorage.getItem("followed") || "[]");

    const followedUsers = [];
    for (el of followedUsersObjs) {
        followedUsers.push(el.firstName);
    }
    console.log(followedUsers);
    
    if(!followedUsers.includes(firstName)) {
        followedUsersObjs.push(obj);
        localStorage.setItem("followed", JSON.stringify(followedUsers));
        console.log(followedUsers);
    } else {
        const removedFollowing = followedUsers.filter((followedIds) => followedIds !== firstName);
        localStorage.setItem("followed", JSON.stringify(removedFollowing))
    }

    checkIsFollowed(firstName);
}

function checkIsFollowed(id) {
    const followedUsers = JSON.parse(localStorage.getItem("followed") || "[]");

    return `${followedUsers.includes(id) ? "Followed" : "Follow"}`;
}




// Following modalga olib kelish

async function getFollowedData(param) {
    const url = `https://randomuser.me/api/?name=${param}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
  
      const json = await response.json();
      const data = json.results;
        console.log(data);
    } catch (error) {
      console.error(error.message);
    }
  }

followingBtn.addEventListener("click", () => {
    followed.classList.remove("hidden");
    overlay.classList.remove("hidden");
    
    getFollowedData()
})